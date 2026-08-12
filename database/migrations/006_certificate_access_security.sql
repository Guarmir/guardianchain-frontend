CREATE TABLE IF NOT EXISTS gc_certificate_access_credentials (
  certificate_id UUID PRIMARY KEY
    REFERENCES gc_certificates(id)
    ON DELETE RESTRICT,

  key_hash TEXT,
  key_salt TEXT,
  key_algorithm TEXT,

  recovery_code_hash TEXT,

  access_version INTEGER NOT NULL DEFAULT 1
    CHECK (access_version > 0),

  status TEXT NOT NULL DEFAULT 'setup_required'
    CHECK (
      status IN (
        'setup_required',
        'active',
        'disabled'
      )
    ),

  failed_attempts INTEGER NOT NULL DEFAULT 0
    CHECK (failed_attempts >= 0),

  locked_until TIMESTAMPTZ,

  configured_at TIMESTAMPTZ,
  last_authenticated_at TIMESTAMPTZ,
  last_recovery_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CHECK (
    (
      status = 'setup_required'
      AND key_hash IS NULL
      AND key_salt IS NULL
      AND key_algorithm IS NULL
    )
    OR
    (
      status = 'active'
      AND key_hash IS NOT NULL
      AND key_salt IS NOT NULL
      AND key_algorithm IS NOT NULL
      AND recovery_code_hash IS NOT NULL
    )
    OR
    status = 'disabled'
  )
);

-- statement-breakpoint

CREATE INDEX IF NOT EXISTS
  gc_certificate_access_credentials_status_idx
ON gc_certificate_access_credentials (
  status,
  updated_at DESC
);

-- statement-breakpoint

CREATE INDEX IF NOT EXISTS
  gc_certificate_access_credentials_lock_idx
ON gc_certificate_access_credentials (
  locked_until
)
WHERE locked_until IS NOT NULL;

-- statement-breakpoint

CREATE TABLE IF NOT EXISTS gc_certificate_access_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  certificate_id UUID NOT NULL
    REFERENCES gc_certificates(id)
    ON DELETE RESTRICT,

  token_type TEXT NOT NULL
    CHECK (
      token_type IN (
        'setup',
        'recovery'
      )
    ),

  token_hash TEXT NOT NULL UNIQUE
    CHECK (
      token_hash ~ '^[0-9a-f]{64}$'
    ),

  attempt_count INTEGER NOT NULL DEFAULT 0
    CHECK (attempt_count >= 0),

  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CHECK (
    expires_at > created_at
  )
);

-- statement-breakpoint

CREATE INDEX IF NOT EXISTS
  gc_certificate_access_tokens_certificate_idx
ON gc_certificate_access_tokens (
  certificate_id,
  token_type,
  created_at DESC
);

-- statement-breakpoint

CREATE INDEX IF NOT EXISTS
  gc_certificate_access_tokens_expiry_idx
ON gc_certificate_access_tokens (
  expires_at
)
WHERE
  used_at IS NULL
  AND revoked_at IS NULL;

-- statement-breakpoint

CREATE TABLE IF NOT EXISTS gc_certificate_access_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  certificate_id UUID NOT NULL
    REFERENCES gc_certificates(id)
    ON DELETE RESTRICT,

  session_token_hash TEXT NOT NULL UNIQUE
    CHECK (
      session_token_hash ~ '^[0-9a-f]{64}$'
    ),

  access_version INTEGER NOT NULL
    CHECK (access_version > 0),

  expires_at TIMESTAMPTZ NOT NULL,

  last_used_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CHECK (
    expires_at > created_at
  )
);

-- statement-breakpoint

CREATE INDEX IF NOT EXISTS
  gc_certificate_access_sessions_certificate_idx
ON gc_certificate_access_sessions (
  certificate_id,
  created_at DESC
);

-- statement-breakpoint

CREATE INDEX IF NOT EXISTS
  gc_certificate_access_sessions_expiry_idx
ON gc_certificate_access_sessions (
  expires_at
)
WHERE revoked_at IS NULL;

-- statement-breakpoint

CREATE TABLE IF NOT EXISTS gc_certificate_access_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  certificate_id UUID NOT NULL
    REFERENCES gc_certificates(id)
    ON DELETE RESTRICT,

  event_type TEXT NOT NULL
    CHECK (
      LENGTH(TRIM(event_type)) > 0
    ),

  outcome TEXT NOT NULL DEFAULT 'success'
    CHECK (
      outcome IN (
        'success',
        'failure',
        'blocked'
      )
    ),

  ip_address INET,
  user_agent TEXT,

  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- statement-breakpoint

CREATE INDEX IF NOT EXISTS
  gc_certificate_access_events_certificate_idx
ON gc_certificate_access_events (
  certificate_id,
  created_at DESC
);

-- statement-breakpoint

CREATE INDEX IF NOT EXISTS
  gc_certificate_access_events_type_idx
ON gc_certificate_access_events (
  event_type,
  created_at DESC
);

-- statement-breakpoint

INSERT INTO gc_certificate_access_credentials (
  certificate_id
)
SELECT
  certificate.id
FROM gc_certificates AS certificate
ON CONFLICT (certificate_id) DO NOTHING;

-- statement-breakpoint

CREATE OR REPLACE FUNCTION
guardianchain_create_certificate_access_credential()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO gc_certificate_access_credentials (
    certificate_id
  )
  VALUES (
    NEW.id
  )
  ON CONFLICT (certificate_id)
  DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- statement-breakpoint

DROP TRIGGER IF EXISTS
  gc_certificates_access_credential_trigger
ON gc_certificates;

-- statement-breakpoint

CREATE TRIGGER
  gc_certificates_access_credential_trigger
AFTER INSERT ON gc_certificates
FOR EACH ROW
EXECUTE FUNCTION
  guardianchain_create_certificate_access_credential();

-- statement-breakpoint

DROP TRIGGER IF EXISTS
  gc_certificate_access_credentials_updated_at_trigger
ON gc_certificate_access_credentials;

-- statement-breakpoint

CREATE TRIGGER
  gc_certificate_access_credentials_updated_at_trigger
BEFORE UPDATE
ON gc_certificate_access_credentials
FOR EACH ROW
EXECUTE FUNCTION guardianchain_set_updated_at();
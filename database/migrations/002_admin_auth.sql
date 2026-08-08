ALTER TABLE gc_admin_users
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- statement-breakpoint

ALTER TABLE gc_admin_users
ADD COLUMN IF NOT EXISTS password_salt TEXT;

-- statement-breakpoint

ALTER TABLE gc_admin_users
ADD COLUMN IF NOT EXISTS password_algorithm TEXT
NOT NULL DEFAULT 'scrypt-v1';

-- statement-breakpoint

ALTER TABLE gc_admin_users
ADD COLUMN IF NOT EXISTS password_updated_at TIMESTAMPTZ;

-- statement-breakpoint

ALTER TABLE gc_admin_users
ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN
NOT NULL DEFAULT TRUE;

-- statement-breakpoint

ALTER TABLE gc_admin_users
ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER
NOT NULL DEFAULT 0;

-- statement-breakpoint

ALTER TABLE gc_admin_users
ADD COLUMN IF NOT EXISTS locked_until TIMESTAMPTZ;

-- statement-breakpoint

ALTER TABLE gc_admin_users
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- statement-breakpoint

ALTER TABLE gc_admin_users
ADD COLUMN IF NOT EXISTS last_login_ip INET;

-- statement-breakpoint

ALTER TABLE gc_admin_users
ADD COLUMN IF NOT EXISTS session_version INTEGER
NOT NULL DEFAULT 1;

-- statement-breakpoint

CREATE TABLE IF NOT EXISTS gc_admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  admin_user_id UUID NOT NULL
    REFERENCES gc_admin_users(id)
    ON DELETE CASCADE,

  token_hash TEXT NOT NULL UNIQUE,

  session_version INTEGER NOT NULL
    DEFAULT 1,

  expires_at TIMESTAMPTZ NOT NULL,

  revoked_at TIMESTAMPTZ,

  last_seen_at TIMESTAMPTZ,

  ip_address INET,

  user_agent TEXT,

  created_at TIMESTAMPTZ NOT NULL
    DEFAULT NOW()
);

-- statement-breakpoint

CREATE INDEX IF NOT EXISTS
  gc_admin_sessions_admin_created_idx
ON gc_admin_sessions (
  admin_user_id,
  created_at DESC
);

-- statement-breakpoint

CREATE INDEX IF NOT EXISTS
  gc_admin_sessions_expires_idx
ON gc_admin_sessions (
  expires_at
);

-- statement-breakpoint

CREATE INDEX IF NOT EXISTS
  gc_admin_sessions_active_idx
ON gc_admin_sessions (
  admin_user_id,
  expires_at
)
WHERE revoked_at IS NULL;
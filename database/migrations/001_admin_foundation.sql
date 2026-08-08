CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- statement-breakpoint

CREATE OR REPLACE FUNCTION guardianchain_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- statement-breakpoint

CREATE TABLE IF NOT EXISTS gc_admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  external_auth_subject TEXT,
  role TEXT NOT NULL DEFAULT 'admin'
    CHECK (role IN ('owner', 'admin', 'support', 'viewer')),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'blocked', 'disabled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS
  gc_admin_users_email_lower_uidx
ON gc_admin_users (LOWER(email));

-- statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS
  gc_admin_users_external_auth_subject_uidx
ON gc_admin_users (external_auth_subject)
WHERE external_auth_subject IS NOT NULL;

-- statement-breakpoint

CREATE TABLE IF NOT EXISTS gc_products (
  id TEXT PRIMARY KEY,
  product_type TEXT NOT NULL
    CHECK (product_type IN ('single', 'package')),
  credits INTEGER NOT NULL
    CHECK (credits > 0),
  currency TEXT NOT NULL
    CHECK (currency ~ '^[A-Z]{3}$'),
  unit_amount INTEGER NOT NULL
    CHECK (unit_amount > 0),
  active BOOLEAN NOT NULL DEFAULT FALSE,
  checkout_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  highlighted BOOLEAN NOT NULL DEFAULT FALSE,
  content JSONB NOT NULL DEFAULT '{}'::JSONB,
  catalog_version TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1
    CHECK (version > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- statement-breakpoint

CREATE TABLE IF NOT EXISTS gc_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT,
  owner_type TEXT NOT NULL DEFAULT 'individual'
    CHECK (owner_type IN ('individual', 'company')),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'blocked', 'disabled')),
  blocked_reason TEXT,
  blocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS
  gc_customers_email_lower_uidx
ON gc_customers (LOWER(email));

-- statement-breakpoint

CREATE TABLE IF NOT EXISTS gc_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_checkout_session_id TEXT NOT NULL UNIQUE,
  stripe_payment_intent_id TEXT,
  customer_id UUID NOT NULL
    REFERENCES gc_customers(id)
    ON DELETE RESTRICT,
  product_id TEXT NOT NULL
    REFERENCES gc_products(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  product_snapshot JSONB NOT NULL,
  amount_total INTEGER NOT NULL
    CHECK (amount_total >= 0),
  currency TEXT NOT NULL
    CHECK (currency ~ '^[A-Z]{3}$'),
  credits_purchased INTEGER NOT NULL
    CHECK (credits_purchased > 0),
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (
      payment_status IN (
        'pending',
        'paid',
        'unpaid',
        'failed',
        'canceled',
        'refunded',
        'partially_refunded',
        'disputed'
      )
    ),
  fulfillment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (
      fulfillment_status IN (
        'pending',
        'credited',
        'partially_used',
        'consumed',
        'blocked',
        'revoked',
        'refunded',
        'error'
      )
    ),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS
  gc_orders_payment_intent_uidx
ON gc_orders (stripe_payment_intent_id)
WHERE stripe_payment_intent_id IS NOT NULL;

-- statement-breakpoint

CREATE INDEX IF NOT EXISTS
  gc_orders_customer_created_idx
ON gc_orders (customer_id, created_at DESC);

-- statement-breakpoint

CREATE INDEX IF NOT EXISTS
  gc_orders_product_created_idx
ON gc_orders (product_id, created_at DESC);

-- statement-breakpoint

CREATE INDEX IF NOT EXISTS
  gc_orders_payment_status_idx
ON gc_orders (payment_status);

-- statement-breakpoint

CREATE TABLE IF NOT EXISTS gc_credit_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL UNIQUE
    REFERENCES gc_customers(id)
    ON DELETE RESTRICT,
  balance INTEGER NOT NULL DEFAULT 0
    CHECK (balance >= 0),
  total_granted INTEGER NOT NULL DEFAULT 0
    CHECK (total_granted >= 0),
  total_used INTEGER NOT NULL DEFAULT 0
    CHECK (total_used >= 0),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'blocked', 'disabled')),
  blocked_reason TEXT,
  blocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- statement-breakpoint

CREATE TABLE IF NOT EXISTS gc_credit_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL
    REFERENCES gc_credit_accounts(id)
    ON DELETE RESTRICT,
  order_id UUID
    REFERENCES gc_orders(id)
    ON DELETE RESTRICT,
  admin_user_id UUID
    REFERENCES gc_admin_users(id)
    ON DELETE SET NULL,
  operation_type TEXT NOT NULL
    CHECK (
      operation_type IN (
        'purchase_grant',
        'certificate_consumption',
        'manual_grant',
        'manual_debit',
        'refund',
        'reversal',
        'correction'
      )
    ),
  delta INTEGER NOT NULL
    CHECK (delta <> 0),
  balance_after INTEGER NOT NULL
    CHECK (balance_after >= 0),
  reason TEXT,
  reference_type TEXT,
  reference_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- statement-breakpoint

CREATE INDEX IF NOT EXISTS
  gc_credit_ledger_account_created_idx
ON gc_credit_ledger (account_id, created_at DESC);

-- statement-breakpoint

CREATE INDEX IF NOT EXISTS
  gc_credit_ledger_order_idx
ON gc_credit_ledger (order_id)
WHERE order_id IS NOT NULL;

-- statement-breakpoint

CREATE TABLE IF NOT EXISTS gc_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL
    REFERENCES gc_customers(id)
    ON DELETE RESTRICT,
  source_order_id UUID
    REFERENCES gc_orders(id)
    ON DELETE RESTRICT,
  credit_ledger_entry_id UUID
    REFERENCES gc_credit_ledger(id)
    ON DELETE RESTRICT,
  evidence_key TEXT NOT NULL UNIQUE,
  file_hash TEXT NOT NULL
    CHECK (file_hash ~ '^0x[0-9A-Fa-f]{64}$'),
  hash_algorithm TEXT NOT NULL DEFAULT 'sha-256',
  hash_version TEXT NOT NULL DEFAULT '1',
  file_name TEXT,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'blocked', 'revoked', 'voided')),
  status_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status_changed_at TIMESTAMPTZ
);

-- statement-breakpoint

CREATE INDEX IF NOT EXISTS
  gc_certificates_customer_created_idx
ON gc_certificates (customer_id, created_at DESC);

-- statement-breakpoint

CREATE INDEX IF NOT EXISTS
  gc_certificates_file_hash_idx
ON gc_certificates (file_hash);

-- statement-breakpoint

CREATE TABLE IF NOT EXISTS gc_admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID
    REFERENCES gc_admin_users(id)
    ON DELETE SET NULL,
  actor_email TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  before_data JSONB,
  after_data JSONB,
  reason TEXT,
  request_id TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- statement-breakpoint

CREATE INDEX IF NOT EXISTS
  gc_admin_audit_entity_idx
ON gc_admin_audit_logs (
  entity_type,
  entity_id,
  created_at DESC
);

-- statement-breakpoint

CREATE INDEX IF NOT EXISTS
  gc_admin_audit_actor_idx
ON gc_admin_audit_logs (
  admin_user_id,
  created_at DESC
);

-- statement-breakpoint

INSERT INTO gc_products (
  id,
  product_type,
  credits,
  currency,
  unit_amount,
  active,
  checkout_enabled,
  highlighted,
  content,
  catalog_version
)
VALUES
  (
    'single-certificate',
    'single',
    1,
    'USD',
    800,
    TRUE,
    TRUE,
    FALSE,
    '{
      "pt": {
        "name": "Certificado avulso",
        "description": "Um registro digital verificável"
      },
      "en": {
        "name": "Single certificate",
        "description": "One verifiable digital record"
      }
    }'::JSONB,
    '1.1'
  ),
  (
    'package-5-records',
    'package',
    5,
    'USD',
    3500,
    FALSE,
    FALSE,
    FALSE,
    '{
      "pt": {
        "name": "Pacote com 5 registros",
        "description": "Cinco provas digitais verificáveis"
      },
      "en": {
        "name": "5-record package",
        "description": "Five verifiable digital proofs"
      }
    }'::JSONB,
    '1.1'
  ),
  (
    'package-8-records',
    'package',
    8,
    'USD',
    5200,
    FALSE,
    FALSE,
    TRUE,
    '{
      "pt": {
        "name": "Pacote com 8 registros",
        "description": "Oito provas digitais verificáveis"
      },
      "en": {
        "name": "8-record package",
        "description": "Eight verifiable digital proofs"
      }
    }'::JSONB,
    '1.1'
  ),
  (
    'package-12-records',
    'package',
    12,
    'USD',
    7200,
    FALSE,
    FALSE,
    FALSE,
    '{
      "pt": {
        "name": "Pacote com 12 registros",
        "description": "Doze provas digitais verificáveis"
      },
      "en": {
        "name": "12-record package",
        "description": "Twelve verifiable digital proofs"
      }
    }'::JSONB,
    '1.1'
  )
ON CONFLICT (id) DO NOTHING;

-- statement-breakpoint

DROP TRIGGER IF EXISTS
  gc_admin_users_updated_at_trigger
ON gc_admin_users;

-- statement-breakpoint

CREATE TRIGGER gc_admin_users_updated_at_trigger
BEFORE UPDATE ON gc_admin_users
FOR EACH ROW
EXECUTE FUNCTION guardianchain_set_updated_at();

-- statement-breakpoint

DROP TRIGGER IF EXISTS
  gc_products_updated_at_trigger
ON gc_products;

-- statement-breakpoint

CREATE TRIGGER gc_products_updated_at_trigger
BEFORE UPDATE ON gc_products
FOR EACH ROW
EXECUTE FUNCTION guardianchain_set_updated_at();

-- statement-breakpoint

DROP TRIGGER IF EXISTS
  gc_customers_updated_at_trigger
ON gc_customers;

-- statement-breakpoint

CREATE TRIGGER gc_customers_updated_at_trigger
BEFORE UPDATE ON gc_customers
FOR EACH ROW
EXECUTE FUNCTION guardianchain_set_updated_at();

-- statement-breakpoint

DROP TRIGGER IF EXISTS
  gc_orders_updated_at_trigger
ON gc_orders;

-- statement-breakpoint

CREATE TRIGGER gc_orders_updated_at_trigger
BEFORE UPDATE ON gc_orders
FOR EACH ROW
EXECUTE FUNCTION guardianchain_set_updated_at();

-- statement-breakpoint

DROP TRIGGER IF EXISTS
  gc_credit_accounts_updated_at_trigger
ON gc_credit_accounts;

-- statement-breakpoint

CREATE TRIGGER gc_credit_accounts_updated_at_trigger
BEFORE UPDATE ON gc_credit_accounts
FOR EACH ROW
EXECUTE FUNCTION guardianchain_set_updated_at();
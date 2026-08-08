ALTER TABLE gc_certificates
ADD COLUMN IF NOT EXISTS delivery_status TEXT
  NOT NULL
  DEFAULT 'pending'
  CHECK (
    delivery_status IN (
      'pending',
      'sent',
      'error'
    )
  );

-- statement-breakpoint

ALTER TABLE gc_certificates
ADD COLUMN IF NOT EXISTS delivery_attempts INTEGER
  NOT NULL
  DEFAULT 0
  CHECK (delivery_attempts >= 0);

-- statement-breakpoint

ALTER TABLE gc_certificates
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

-- statement-breakpoint

ALTER TABLE gc_certificates
ADD COLUMN IF NOT EXISTS last_delivery_error TEXT;

-- statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS
  gc_certificates_order_hash_uidx
ON gc_certificates (
  source_order_id,
  file_hash
)
WHERE source_order_id IS NOT NULL;

-- statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS
  gc_certificates_credit_ledger_entry_uidx
ON gc_certificates (
  credit_ledger_entry_id
)
WHERE credit_ledger_entry_id IS NOT NULL;

-- statement-breakpoint

CREATE INDEX IF NOT EXISTS
  gc_certificates_delivery_status_idx
ON gc_certificates (
  delivery_status,
  created_at DESC
);
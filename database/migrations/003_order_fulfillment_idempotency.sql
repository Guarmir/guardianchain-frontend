CREATE UNIQUE INDEX IF NOT EXISTS
  gc_credit_ledger_purchase_grant_order_uidx
ON gc_credit_ledger (order_id)
WHERE
  order_id IS NOT NULL
  AND operation_type = 'purchase_grant';
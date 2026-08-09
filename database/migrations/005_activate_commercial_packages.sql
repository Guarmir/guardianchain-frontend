UPDATE gc_products
SET
  active = TRUE,
  checkout_enabled = TRUE,
  catalog_version = '1.2',
  version = version + 1
WHERE id IN (
  'single-certificate',
  'package-5-records',
  'package-8-records',
  'package-12-records'
);
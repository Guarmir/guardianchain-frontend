import {
  getDatabaseClient,
} from "../db.js"

function normalizeEmail(value) {
  const email = String(
    value || "",
  )
    .trim()
    .toLowerCase()

  if (
    !email ||
    email.length > 320 ||
    !email.includes("@")
  ) {
    throw new Error(
      "A valid customer email is required",
    )
  }

  return email
}

function normalizeName(value) {
  const name = String(
    value || "",
  )
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 200)

  return name || null
}

function normalizeOwnerType(value) {
  return value === "company"
    ? "company"
    : "individual"
}

function normalizeDate(value) {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return null
  }

  return date.toISOString()
}

function mapCustomer(row) {
  return {
    id:
      row.id,

    email:
      row.email,

    name:
      row.name || null,

    ownerType:
      row.owner_type,

    status:
      row.status,

    createdAt:
      normalizeDate(
        row.created_at,
      ),

    updatedAt:
      normalizeDate(
        row.updated_at,
      ),
  }
}

export async function syncCustomerAccount({
  email,
  name,
  ownerType,
}) {
  const normalizedEmail =
    normalizeEmail(email)

  const normalizedName =
    normalizeName(name)

  const normalizedOwnerType =
    normalizeOwnerType(
      ownerType,
    )

  const sql =
    getDatabaseClient()

  await sql`
    INSERT INTO gc_customers (
      email,
      name,
      owner_type
    )
    VALUES (
      ${normalizedEmail},
      ${normalizedName},
      ${normalizedOwnerType}
    )

    ON CONFLICT DO NOTHING
  `

  await sql`
    UPDATE gc_customers

    SET
      name = COALESCE(
        NULLIF(
          ${normalizedName || ""},
          ''
        ),
        name
      ),

      owner_type =
        ${normalizedOwnerType}

    WHERE
      LOWER(email) =
      LOWER(${normalizedEmail})
  `

  const customerRows =
    await sql`
      SELECT
        id,
        email,
        name,
        owner_type,
        status,
        created_at,
        updated_at

      FROM gc_customers

      WHERE
        LOWER(email) =
        LOWER(${normalizedEmail})

      LIMIT 1
    `

  const customer =
    customerRows[0]

  if (!customer) {
    throw new Error(
      "Customer synchronization failed",
    )
  }

  await sql`
    INSERT INTO gc_credit_accounts (
      customer_id
    )
    VALUES (
      ${customer.id}
    )

    ON CONFLICT (
      customer_id
    )
    DO NOTHING
  `

  return mapCustomer(
    customer,
  )
}
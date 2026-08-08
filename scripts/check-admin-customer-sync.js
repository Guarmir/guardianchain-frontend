import {
  getDatabaseClient,
} from "../api/lib/db.js"

import {
  syncCustomerAccount,
} from "../api/lib/admin/admin-customer-sync-repository.js"

const TEST_CUSTOMER = {
  email:
    "guardianchain-customer-sync-test@example.invalid",

  name:
    "GuardianChain Customer Sync Test",

  ownerType:
    "individual",
}

function toNumber(value) {
  const number = Number(value)

  return Number.isFinite(number)
    ? number
    : 0
}

async function removeTestCustomer() {
  const sql =
    getDatabaseClient()

  await sql`
    DELETE FROM gc_credit_accounts

    WHERE customer_id IN (
      SELECT id
      FROM gc_customers
      WHERE
        LOWER(email) =
        LOWER(${TEST_CUSTOMER.email})
    )
  `

  await sql`
    DELETE FROM gc_customers

    WHERE
      LOWER(email) =
      LOWER(${TEST_CUSTOMER.email})
  `
}

async function readTestSnapshot() {
  const sql =
    getDatabaseClient()

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
        LOWER(${TEST_CUSTOMER.email})
    `

  const accountRows =
    await sql`
      SELECT
        account.id,
        account.customer_id,
        account.balance,
        account.total_granted,
        account.total_used,
        account.status

      FROM gc_credit_accounts
        AS account

      INNER JOIN gc_customers
        AS customer
        ON customer.id =
          account.customer_id

      WHERE
        LOWER(customer.email) =
        LOWER(${TEST_CUSTOMER.email})
    `

  return {
    customers:
      customerRows,

    creditAccounts:
      accountRows,
  }
}

function validateFirstSync(
  customer,
) {
  if (!customer?.id) {
    throw new Error(
      "The first synchronization did not return a customer ID",
    )
  }

  if (
    customer.email !==
    TEST_CUSTOMER.email
  ) {
    throw new Error(
      "The synchronized customer email is incorrect",
    )
  }

  if (
    customer.name !==
    TEST_CUSTOMER.name
  ) {
    throw new Error(
      "The synchronized customer name is incorrect",
    )
  }

  if (
    customer.ownerType !==
    TEST_CUSTOMER.ownerType
  ) {
    throw new Error(
      "The synchronized owner type is incorrect",
    )
  }

  if (
    customer.status !==
    "active"
  ) {
    throw new Error(
      "The synchronized customer should be active",
    )
  }
}

function validateIdempotency(
  firstCustomer,
  secondCustomer,
) {
  if (
    firstCustomer.id !==
    secondCustomer.id
  ) {
    throw new Error(
      "Repeated synchronization created a different customer",
    )
  }
}

function validateDatabaseSnapshot(
  snapshot,
  expectedCustomerId,
) {
  if (
    snapshot.customers.length !== 1
  ) {
    throw new Error(
      [
        "Expected exactly one test customer,",
        `found ${snapshot.customers.length}`,
      ].join(" "),
    )
  }

  if (
    snapshot.creditAccounts.length !== 1
  ) {
    throw new Error(
      [
        "Expected exactly one credit account,",
        `found ${snapshot.creditAccounts.length}`,
      ].join(" "),
    )
  }

  const customer =
    snapshot.customers[0]

  const account =
    snapshot.creditAccounts[0]

  if (
    customer.id !==
    expectedCustomerId
  ) {
    throw new Error(
      "The stored customer ID does not match the synchronized customer",
    )
  }

  if (
    account.customer_id !==
    expectedCustomerId
  ) {
    throw new Error(
      "The credit account belongs to a different customer",
    )
  }

  if (
    toNumber(
      account.balance,
    ) !== 0
  ) {
    throw new Error(
      "The initial credit balance should be zero",
    )
  }

  if (
    toNumber(
      account.total_granted,
    ) !== 0
  ) {
    throw new Error(
      "The initial granted credits should be zero",
    )
  }

  if (
    toNumber(
      account.total_used,
    ) !== 0
  ) {
    throw new Error(
      "The initial used credits should be zero",
    )
  }

  if (
    account.status !==
    "active"
  ) {
    throw new Error(
      "The initial credit account should be active",
    )
  }
}

async function runCheck() {
  console.log(
    "[CUSTOMER SYNC CHECK] Preparing isolated test...",
  )

  await removeTestCustomer()

  try {
    console.log(
      "[CUSTOMER SYNC CHECK] Running first synchronization...",
    )

    const firstCustomer =
      await syncCustomerAccount(
        TEST_CUSTOMER,
      )

    validateFirstSync(
      firstCustomer,
    )

    console.log(
      "[CUSTOMER SYNC CHECK] First synchronization confirmed:",
      {
        customerId:
          firstCustomer.id,

        status:
          firstCustomer.status,
      },
    )

    console.log(
      "[CUSTOMER SYNC CHECK] Repeating synchronization...",
    )

    const secondCustomer =
      await syncCustomerAccount(
        TEST_CUSTOMER,
      )

    validateIdempotency(
      firstCustomer,
      secondCustomer,
    )

    console.log(
      "[CUSTOMER SYNC CHECK] Idempotency confirmed:",
      {
        sameCustomerId:
          firstCustomer.id ===
          secondCustomer.id,
      },
    )

    const snapshot =
      await readTestSnapshot()

    validateDatabaseSnapshot(
      snapshot,
      firstCustomer.id,
    )

    console.log(
      "[CUSTOMER SYNC CHECK] Database records confirmed:",
      {
        customers:
          snapshot.customers.length,

        creditAccounts:
          snapshot
            .creditAccounts
            .length,

        balance:
          snapshot
            .creditAccounts[0]
            .balance,

        accountStatus:
          snapshot
            .creditAccounts[0]
            .status,
      },
    )

    console.log(
      "[CUSTOMER SYNC CHECK] Validation completed successfully.",
    )
  } finally {
    await removeTestCustomer()

    console.log(
      "[CUSTOMER SYNC CHECK] Test records removed.",
    )
  }
}

runCheck().catch(
  (error) => {
    console.error(
      "[CUSTOMER SYNC CHECK] Validation failed:",
      {
        name:
          error?.name,

        message:
          error?.message,
      },
    )

    process.exitCode = 1
  },
)
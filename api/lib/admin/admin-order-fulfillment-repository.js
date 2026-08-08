import {
  getDatabaseClient,
} from "../db.js"

const COMPLETED_FULFILLMENT_STATUSES =
  new Set([
    "credited",
    "partially_used",
    "consumed",
  ])

function normalizeRequiredText(
  value,
  fieldName,
  maximumLength = 500,
) {
  const normalizedValue =
    String(value || "")
      .trim()
      .slice(
        0,
        maximumLength,
      )

  if (!normalizedValue) {
    throw new Error(
      `${fieldName} is required`,
    )
  }

  return normalizedValue
}

function normalizeOptionalText(
  value,
  maximumLength = 500,
) {
  const normalizedValue =
    String(value || "")
      .trim()
      .slice(
        0,
        maximumLength,
      )

  return normalizedValue || null
}

function normalizePositiveInteger(
  value,
  fieldName,
) {
  const number =
    Number.parseInt(
      String(value || ""),
      10,
    )

  if (
    !Number.isInteger(number) ||
    number < 1
  ) {
    throw new Error(
      `${fieldName} must be a positive integer`,
    )
  }

  return number
}

function normalizeNonNegativeInteger(
  value,
  fieldName,
) {
  const number =
    Number(value)

  if (
    !Number.isInteger(number) ||
    number < 0
  ) {
    throw new Error(
      `${fieldName} must be a non-negative integer`,
    )
  }

  return number
}

function normalizeCurrency(value) {
  const currency =
    String(value || "")
      .trim()
      .toUpperCase()

  if (
    !/^[A-Z]{3}$/.test(
      currency,
    )
  ) {
    throw new Error(
      "A valid currency is required",
    )
  }

  return currency
}

function normalizeProductType(value) {
  if (
    value === "single" ||
    value === "package"
  ) {
    return value
  }

  throw new Error(
    "A valid product type is required",
  )
}

function normalizeDate(value) {
  const date =
    value
      ? new Date(value)
      : new Date()

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    throw new Error(
      "A valid payment date is required",
    )
  }

  return date.toISOString()
}

function toNumber(value) {
  const number =
    Number(value)

  return Number.isFinite(number)
    ? number
    : 0
}

function mapOrderState(row) {
  if (!row) {
    return null
  }

  return {
    order: {
      id:
        row.order_id,

      customerId:
        row.customer_id,

      productId:
        row.product_id,

      checkoutSessionId:
        row.stripe_checkout_session_id,

      paymentIntentId:
        row.stripe_payment_intent_id ||
        null,

      amountTotal:
        toNumber(
          row.amount_total,
        ),

      currency:
        row.currency,

      creditsPurchased:
        toNumber(
          row.credits_purchased,
        ),

      paymentStatus:
        row.payment_status,

      fulfillmentStatus:
        row.fulfillment_status,

      paidAt:
        row.paid_at
          ? new Date(
              row.paid_at,
            ).toISOString()
          : null,
    },

    customerStatus:
      row.customer_status,

    creditAccount: {
      id:
        row.credit_account_id,

      status:
        row.credit_account_status,

      balance:
        toNumber(
          row.credit_balance,
        ),

      totalGranted:
        toNumber(
          row.total_granted,
        ),

      totalUsed:
        toNumber(
          row.total_used,
        ),
    },

    purchaseGrantLedgerId:
      row.purchase_grant_ledger_id ||
      null,
  }
}

function validateStoredOrder(
  state,
  expected,
) {
  if (!state) {
    throw new Error(
      "The paid order could not be created or located",
    )
  }

  const order =
    state.order

  const matches =
    order.customerId ===
      expected.customerId &&
    order.productId ===
      expected.productId &&
    order.checkoutSessionId ===
      expected.checkoutSessionId &&
    order.amountTotal ===
      expected.amountTotal &&
    order.currency ===
      expected.currency &&
    order.creditsPurchased ===
      expected.creditsPurchased

  if (!matches) {
    throw new Error(
      "The stored order conflicts with the Stripe checkout session",
    )
  }

  if (
    order.paymentStatus !== "paid"
  ) {
    throw new Error(
      "The stored order is not marked as paid",
    )
  }

  if (
    !state.purchaseGrantLedgerId
  ) {
    throw new Error(
      [
        "Credits could not be granted.",
        `Customer status: ${state.customerStatus}.`,
        `Credit account status: ${state.creditAccount.status}.`,
      ].join(" "),
    )
  }
}

export async function preparePaidCheckoutOrder({
  customerId,
  checkoutSessionId,
  paymentIntentId = null,
  productId,
  productType,
  creditsPurchased,
  amountTotal,
  currency,
  paidAt,
  productSnapshot = {},
}) {
  const normalizedCustomerId =
    normalizeRequiredText(
      customerId,
      "customerId",
      100,
    )

  const normalizedCheckoutSessionId =
    normalizeRequiredText(
      checkoutSessionId,
      "checkoutSessionId",
      255,
    )

  const normalizedPaymentIntentId =
    normalizeOptionalText(
      paymentIntentId,
      255,
    )

  const normalizedProductId =
    normalizeRequiredText(
      productId,
      "productId",
      200,
    )

  const normalizedProductType =
    normalizeProductType(
      productType,
    )

  const normalizedCredits =
    normalizePositiveInteger(
      creditsPurchased,
      "creditsPurchased",
    )

  const normalizedAmountTotal =
    normalizeNonNegativeInteger(
      amountTotal,
      "amountTotal",
    )

  const normalizedCurrency =
    normalizeCurrency(
      currency,
    )

  const normalizedPaidAt =
    normalizeDate(
      paidAt,
    )

  const normalizedSnapshot =
    JSON.stringify({
      ...productSnapshot,

      id:
        normalizedProductId,

      type:
        normalizedProductType,

      credits:
        normalizedCredits,

      currency:
        normalizedCurrency,

      unitAmount:
        normalizedAmountTotal,
    })

  const sql =
    getDatabaseClient()

  const [
    ,
    insertedOrderRows,
    grantedCreditRows,
    stateRows,
  ] =
    await sql.transaction([
      sql`
        SELECT
          pg_advisory_xact_lock(
            hashtextextended(
              ${normalizedCheckoutSessionId}::TEXT,
              0
            )
          )
      `,

      sql`
        INSERT INTO gc_orders (
          stripe_checkout_session_id,
          stripe_payment_intent_id,
          customer_id,
          product_id,
          product_snapshot,
          amount_total,
          currency,
          credits_purchased,
          payment_status,
          fulfillment_status,
          paid_at
        )

        SELECT
          ${normalizedCheckoutSessionId},
          ${normalizedPaymentIntentId},
          ${normalizedCustomerId}::UUID,
          product.id,
          ${normalizedSnapshot}::JSONB,
          ${normalizedAmountTotal},
          ${normalizedCurrency},
          ${normalizedCredits},
          'paid',
          'pending',
          ${normalizedPaidAt}::TIMESTAMPTZ

        FROM gc_products
          AS product

        WHERE
          product.id =
            ${normalizedProductId}

          AND product.product_type =
            ${normalizedProductType}

          AND product.credits =
            ${normalizedCredits}

          AND product.currency =
            ${normalizedCurrency}

          AND product.unit_amount =
            ${normalizedAmountTotal}

        ON CONFLICT (
          stripe_checkout_session_id
        )
        DO NOTHING

        RETURNING id
      `,

      sql`
        WITH target_order AS (
          SELECT
            order_record.id
              AS order_id,

            order_record.customer_id,

            order_record.credits_purchased

          FROM gc_orders
            AS order_record

          WHERE
            order_record
              .stripe_checkout_session_id =
              ${normalizedCheckoutSessionId}
        ),

        eligible_account AS (
          SELECT
            credit_account.id
              AS account_id,

            target_order.order_id,

            target_order.credits_purchased

          FROM target_order

          INNER JOIN gc_customers
            AS customer
            ON customer.id =
              target_order.customer_id

          INNER JOIN gc_credit_accounts
            AS credit_account
            ON credit_account.customer_id =
              target_order.customer_id

          WHERE
            customer.status = 'active'

            AND credit_account.status =
              'active'

            AND NOT EXISTS (
              SELECT 1

              FROM gc_credit_ledger
                AS existing_ledger

              WHERE
                existing_ledger.order_id =
                  target_order.order_id

                AND existing_ledger
                  .operation_type =
                  'purchase_grant'
            )

          FOR UPDATE OF credit_account
        ),

        updated_account AS (
          UPDATE gc_credit_accounts
            AS credit_account

          SET
            balance =
              credit_account.balance +
              eligible_account
                .credits_purchased,

            total_granted =
              credit_account.total_granted +
              eligible_account
                .credits_purchased,

            updated_at = NOW()

          FROM eligible_account

          WHERE
            credit_account.id =
              eligible_account.account_id

          RETURNING
            credit_account.id
              AS account_id,

            credit_account.balance
              AS balance_after,

            eligible_account.order_id,

            eligible_account
              .credits_purchased
        )

        INSERT INTO gc_credit_ledger (
          account_id,
          order_id,
          operation_type,
          delta,
          balance_after,
          reason,
          reference_type,
          reference_id,
          metadata
        )

        SELECT
          updated_account.account_id,
          updated_account.order_id,
          'purchase_grant',
          updated_account.credits_purchased,
          updated_account.balance_after,
          'Créditos concedidos após pagamento confirmado.',
          'stripe_checkout_session',
          ${normalizedCheckoutSessionId},

          jsonb_build_object(
            'source',
            'stripe_webhook',

            'productId',
            ${normalizedProductId}::TEXT
          )

        FROM updated_account

        ON CONFLICT DO NOTHING

        RETURNING
          id,
          order_id,
          account_id,
          delta,
          balance_after
      `,

      sql`
        SELECT
          order_record.id
            AS order_id,

          order_record.customer_id,
          order_record.product_id,

          order_record
            .stripe_checkout_session_id,

          order_record
            .stripe_payment_intent_id,

          order_record.amount_total,
          order_record.currency,
          order_record.credits_purchased,
          order_record.payment_status,
          order_record.fulfillment_status,
          order_record.paid_at,

          customer.status
            AS customer_status,

          credit_account.id
            AS credit_account_id,

          credit_account.status
            AS credit_account_status,

          credit_account.balance
            AS credit_balance,

          credit_account.total_granted,
          credit_account.total_used,

          purchase_grant.id
            AS purchase_grant_ledger_id

        FROM gc_orders
          AS order_record

        INNER JOIN gc_customers
          AS customer
          ON customer.id =
            order_record.customer_id

        INNER JOIN gc_credit_accounts
          AS credit_account
          ON credit_account.customer_id =
            order_record.customer_id

        LEFT JOIN LATERAL (
          SELECT
            ledger.id

          FROM gc_credit_ledger
            AS ledger

          WHERE
            ledger.order_id =
              order_record.id

            AND ledger.operation_type =
              'purchase_grant'

          ORDER BY
            ledger.created_at ASC,
            ledger.id ASC

          LIMIT 1
        ) AS purchase_grant
          ON TRUE

        WHERE
          order_record
            .stripe_checkout_session_id =
            ${normalizedCheckoutSessionId}

        LIMIT 1
      `,
    ])

  const state =
    mapOrderState(
      stateRows[0],
    )

  validateStoredOrder(
    state,
    {
      customerId:
        normalizedCustomerId,

      productId:
        normalizedProductId,

      checkoutSessionId:
        normalizedCheckoutSessionId,

      amountTotal:
        normalizedAmountTotal,

      currency:
        normalizedCurrency,

      creditsPurchased:
        normalizedCredits,
    },
  )

  const fulfillmentCompleted =
    COMPLETED_FULFILLMENT_STATUSES
      .has(
        state.order
          .fulfillmentStatus,
      )

  return {
    ...state,

    orderCreated:
      insertedOrderRows.length > 0,

    creditsGrantedNow:
      grantedCreditRows.length > 0,

    alreadyProcessed:
      fulfillmentCompleted,

    shouldDeliverCertificate:
      !fulfillmentCompleted,
  }
}

export async function markPaidCheckoutDelivered({
  checkoutSessionId,
}) {
  const normalizedCheckoutSessionId =
    normalizeRequiredText(
      checkoutSessionId,
      "checkoutSessionId",
      255,
    )

  const sql =
    getDatabaseClient()

  const updatedRows =
    await sql`
      UPDATE gc_orders
        AS order_record

      SET
        fulfillment_status =
          'credited',

        updated_at = NOW()

      WHERE
        order_record
          .stripe_checkout_session_id =
          ${normalizedCheckoutSessionId}

        AND order_record.payment_status =
          'paid'

        AND order_record
          .fulfillment_status =
          'pending'

        AND EXISTS (
          SELECT 1

          FROM gc_credit_ledger
            AS ledger

          WHERE
            ledger.order_id =
              order_record.id

            AND ledger.operation_type =
              'purchase_grant'
        )

      RETURNING
        id,
        fulfillment_status
    `

  if (updatedRows.length > 0) {
    return {
      orderId:
        updatedRows[0].id,

      fulfillmentStatus:
        updatedRows[0]
          .fulfillment_status,

      changed:
        true,
    }
  }

  const existingRows =
    await sql`
      SELECT
        id,
        fulfillment_status

      FROM gc_orders

      WHERE
        stripe_checkout_session_id =
          ${normalizedCheckoutSessionId}

      LIMIT 1
    `

  const existingOrder =
    existingRows[0]

  if (!existingOrder) {
    throw new Error(
      "The checkout order could not be located",
    )
  }

  return {
    orderId:
      existingOrder.id,

    fulfillmentStatus:
      existingOrder
        .fulfillment_status,

    changed:
      false,
  }
}
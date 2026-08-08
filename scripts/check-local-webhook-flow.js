import net from "node:net"

import {
  Readable,
} from "node:stream"

import {
  getDatabaseClient,
} from "../api/lib/db.js"

import webhookHandler from "../api/webhook.js"

const TEST_EMAIL =
  "guardianchain-webhook-test@example.invalid"

const TEST_CHECKOUT_SESSION_ID =
  "cs_test_gc_local_webhook_flow"

const TEST_PAYMENT_INTENT_ID =
  "pi_test_gc_local_webhook_flow"

const TEST_HASH =
  `0x${"b".repeat(64)}`

const ORIGINAL_SMTP_ENV = {
  host:
    process.env.SMTP_HOST,

  port:
    process.env.SMTP_PORT,

  user:
    process.env.SMTP_USER,

  pass:
    process.env.SMTP_PASS,
}

function toNumber(value) {
  const number =
    Number(value)

  return Number.isFinite(number)
    ? number
    : 0
}

function createFakeSmtpServer() {
  const messages = []
  const sockets =
    new Set()

  const server =
    net.createServer(
      (socket) => {
        sockets.add(socket)

        socket.setEncoding(
          "utf8",
        )

        socket.on(
          "close",
          () => {
            sockets.delete(
              socket,
            )
          },
        )

        let buffer = ""
        let dataMode = false
        let dataLines = []
        let authLoginStep = 0

        function send(value) {
          socket.write(
            `${value}\r\n`,
          )
        }

        send(
          "220 localhost GuardianChain test SMTP",
        )

        socket.on(
          "data",
          (chunk) => {
            buffer += chunk

            while (
              buffer.includes(
                "\r\n",
              )
            ) {
              const separator =
                buffer.indexOf(
                  "\r\n",
                )

              const line =
                buffer.slice(
                  0,
                  separator,
                )

              buffer =
                buffer.slice(
                  separator + 2,
                )

              if (dataMode) {
                if (line === ".") {
                  messages.push(
                    dataLines.join(
                      "\r\n",
                    ),
                  )

                  dataLines = []
                  dataMode = false

                  send(
                    "250 2.0.0 Message accepted",
                  )

                  continue
                }

                dataLines.push(
                  line.startsWith(
                    "..",
                  )
                    ? line.slice(1)
                    : line,
                )

                continue
              }

              if (
                authLoginStep === 1
              ) {
                authLoginStep = 2

                send(
                  "334 UGFzc3dvcmQ6",
                )

                continue
              }

              if (
                authLoginStep === 2
              ) {
                authLoginStep = 0

                send(
                  "235 2.7.0 Authentication successful",
                )

                continue
              }

              const upperLine =
                line.toUpperCase()

              if (
                upperLine.startsWith(
                  "EHLO ",
                )
              ) {
                socket.write(
                  [
                    "250-localhost",
                    "250-AUTH PLAIN LOGIN",
                    "250 SIZE 10485760",
                    "",
                  ].join(
                    "\r\n",
                  ),
                )

                continue
              }

              if (
                upperLine.startsWith(
                  "HELO ",
                )
              ) {
                send(
                  "250 localhost",
                )

                continue
              }

              if (
                upperLine.startsWith(
                  "AUTH PLAIN",
                )
              ) {
                send(
                  "235 2.7.0 Authentication successful",
                )

                continue
              }

              if (
                upperLine ===
                "AUTH LOGIN"
              ) {
                authLoginStep = 1

                send(
                  "334 VXNlcm5hbWU6",
                )

                continue
              }

              if (
                upperLine.startsWith(
                  "MAIL FROM:",
                )
              ) {
                send(
                  "250 2.1.0 Sender accepted",
                )

                continue
              }

              if (
                upperLine.startsWith(
                  "RCPT TO:",
                )
              ) {
                send(
                  "250 2.1.5 Recipient accepted",
                )

                continue
              }

              if (
                upperLine === "DATA"
              ) {
                dataMode = true
                dataLines = []

                send(
                  "354 End data with <CR><LF>.<CR><LF>",
                )

                continue
              }

              if (
                upperLine === "RSET" ||
                upperLine === "NOOP"
              ) {
                send("250 OK")
                continue
              }

              if (
                upperLine === "QUIT"
              ) {
                send(
                  "221 2.0.0 Bye",
                )

                socket.end()
                continue
              }

              send("250 OK")
            }
          },
        )
      },
    )

  async function start() {
    await new Promise(
      (
        resolve,
        reject,
      ) => {
        server.once(
          "error",
          reject,
        )

        server.listen(
          0,
          "127.0.0.1",
          () => {
            server.off(
              "error",
              reject,
            )

            resolve()
          },
        )
      },
    )

    const address =
      server.address()

    if (
      !address ||
      typeof address ===
        "string"
    ) {
      throw new Error(
        "Could not determine the fake SMTP port",
      )
    }

    return address.port
  }

  async function stop() {
    for (
      const socket of sockets
    ) {
      socket.destroy()
    }

    await new Promise(
      (resolve) => {
        server.close(
          () => resolve(),
        )
      },
    )
  }

  return {
    start,
    stop,
    messages,
  }
}

async function removeTestRecords() {
  const sql =
    getDatabaseClient()

  await sql`
    DELETE FROM gc_certificates

    WHERE source_order_id IN (
      SELECT id

      FROM gc_orders

      WHERE
        stripe_checkout_session_id =
          ${TEST_CHECKOUT_SESSION_ID}
    )
  `

  await sql`
    DELETE FROM gc_credit_ledger

    WHERE order_id IN (
      SELECT id

      FROM gc_orders

      WHERE
        stripe_checkout_session_id =
          ${TEST_CHECKOUT_SESSION_ID}
    )
  `

  await sql`
    DELETE FROM gc_orders

    WHERE
      stripe_checkout_session_id =
        ${TEST_CHECKOUT_SESSION_ID}
  `

  await sql`
    DELETE FROM gc_credit_accounts

    WHERE customer_id IN (
      SELECT id

      FROM gc_customers

      WHERE
        LOWER(email) =
        LOWER(${TEST_EMAIL})
    )
  `

  await sql`
    DELETE FROM gc_customers

    WHERE
      LOWER(email) =
      LOWER(${TEST_EMAIL})
  `
}

function createStripeEvent() {
  const now =
    Math.floor(
      Date.now() / 1000,
    )

  return {
    id:
      "evt_test_gc_local_webhook",

    object:
      "event",

    created:
      now,

    type:
      "checkout.session.completed",

    data: {
      object: {
        id:
          TEST_CHECKOUT_SESSION_ID,

        object:
          "checkout.session",

        payment_status:
          "paid",

        amount_total:
          800,

        currency:
          "usd",

        payment_intent:
          TEST_PAYMENT_INTENT_ID,

        customer_email:
          TEST_EMAIL,

        customer_details: {
          email:
            TEST_EMAIL,
        },

        created:
          now,

        metadata: {
          hash:
            TEST_HASH,

          hashAlgorithm:
            "sha-256",

          hashVersion:
            "1",

          fileName:
            "guardianchain-local-webhook-test.pdf",

          language:
            "pt",

          ownerName:
            "GuardianChain Webhook Test",

          ownerEmail:
            TEST_EMAIL,

          ownerType:
            "individual",

          ownershipDeclaration:
            "accepted",

          declarationVersion:
            "1.0",

          certificateType:
            "declared_owner",

          productId:
            "single-certificate",

          productType:
            "single",

          productCredits:
            "1",

          currency:
            "USD",

          price:
            "8.00",
        },
      },
    },
  }
}

function createRequest(
  event,
) {
  const request =
    Readable.from([
      JSON.stringify(
        event,
      ),
    ])

  request.method = "POST"
  request.headers = {}

  return request
}

function createResponse() {
  return {
    statusCode: 200,
    body: null,

    status(code) {
      this.statusCode =
        code

      return this
    },

    json(body) {
      this.body =
        body

      return this
    },

    send(body) {
      this.body =
        body

      return this
    },
  }
}

async function executeWebhook(
  event,
) {
  const request =
    createRequest(event)

  const response =
    createResponse()

  await webhookHandler(
    request,
    response,
  )

  return response
}

async function readDatabaseState() {
  const sql =
    getDatabaseClient()

  const rows =
    await sql`
      SELECT
        customer.id
          AS customer_id,

        customer.status
          AS customer_status,

        credit_account.balance,

        credit_account.total_granted,

        credit_account.total_used,

        order_record.id
          AS order_id,

        order_record.payment_status,

        order_record.fulfillment_status,

        order_record.credits_purchased,

        certificate.id
          AS certificate_id,

        certificate.evidence_key,

        certificate.file_hash,

        certificate.delivery_status,

        certificate.delivery_attempts,

        (
          SELECT
            COUNT(*)::INTEGER

          FROM gc_credit_ledger
            AS ledger

          WHERE
            ledger.order_id =
              order_record.id

            AND ledger.operation_type =
              'purchase_grant'
        )
          AS purchase_grants,

        (
          SELECT
            COUNT(*)::INTEGER

          FROM gc_credit_ledger
            AS ledger

          WHERE
            ledger.order_id =
              order_record.id

            AND ledger.operation_type =
              'certificate_consumption'
        )
          AS certificate_consumptions,

        (
          SELECT
            COUNT(*)::INTEGER

          FROM gc_certificates
            AS counted_certificate

          WHERE
            counted_certificate
              .source_order_id =
              order_record.id
        )
          AS certificate_count

      FROM gc_customers
        AS customer

      INNER JOIN gc_credit_accounts
        AS credit_account
        ON credit_account.customer_id =
          customer.id

      INNER JOIN gc_orders
        AS order_record
        ON order_record.customer_id =
          customer.id

      LEFT JOIN gc_certificates
        AS certificate
        ON certificate.source_order_id =
          order_record.id

      WHERE
        LOWER(customer.email) =
        LOWER(${TEST_EMAIL})

        AND order_record
          .stripe_checkout_session_id =
          ${TEST_CHECKOUT_SESSION_ID}

      LIMIT 1
    `

  return rows[0] || null
}

function validateFirstResponse(
  response,
) {
  if (
    response.statusCode !== 200
  ) {
    throw new Error(
      `First webhook returned HTTP ${response.statusCode}: ${JSON.stringify(
        response.body,
      )}`,
    )
  }

  if (
    response.body
      ?.customerSynchronized !==
      true ||
    response.body
      ?.orderSynchronized !==
      true ||
    response.body
      ?.certificateSynchronized !==
      true ||
    response.body
      ?.creditsGranted !==
      true ||
    response.body
      ?.creditConsumed !==
      true ||
    response.body
      ?.emailSent !==
      true ||
    response.body
      ?.duplicateDeliverySkipped !==
      false
  ) {
    throw new Error(
      `Unexpected first webhook response: ${JSON.stringify(
        response.body,
      )}`,
    )
  }
}

function validateFirstDatabaseState(
  state,
) {
  if (!state) {
    throw new Error(
      "The webhook did not create the expected administrative records",
    )
  }

  if (
    state.customer_status !==
    "active"
  ) {
    throw new Error(
      "The test customer should be active",
    )
  }

  if (
    toNumber(
      state.balance,
    ) !== 0
  ) {
    throw new Error(
      "The final credit balance should be zero",
    )
  }

  if (
    toNumber(
      state.total_granted,
    ) !== 1
  ) {
    throw new Error(
      "Exactly one credit should have been granted",
    )
  }

  if (
    toNumber(
      state.total_used,
    ) !== 1
  ) {
    throw new Error(
      "Exactly one credit should have been consumed",
    )
  }

  if (
    state.payment_status !==
    "paid"
  ) {
    throw new Error(
      "The order should be marked as paid",
    )
  }

  if (
    state.fulfillment_status !==
    "consumed"
  ) {
    throw new Error(
      "The single-certificate order should be consumed",
    )
  }

  if (
    !state.certificate_id
  ) {
    throw new Error(
      "The certificate was not created",
    )
  }

  if (
    state.file_hash !==
    TEST_HASH
  ) {
    throw new Error(
      "The persisted certificate hash is incorrect",
    )
  }

  if (
    !state.evidence_key
  ) {
    throw new Error(
      "The persisted Evidence Key is missing",
    )
  }

  if (
    state.delivery_status !==
    "sent"
  ) {
    throw new Error(
      "The certificate delivery should be marked as sent",
    )
  }

  if (
    toNumber(
      state.delivery_attempts,
    ) !== 1
  ) {
    throw new Error(
      "Exactly one delivery attempt should be recorded",
    )
  }

  if (
    toNumber(
      state.purchase_grants,
    ) !== 1
  ) {
    throw new Error(
      "Exactly one purchase grant should exist",
    )
  }

  if (
    toNumber(
      state.certificate_consumptions,
    ) !== 1
  ) {
    throw new Error(
      "Exactly one certificate consumption should exist",
    )
  }

  if (
    toNumber(
      state.certificate_count,
    ) !== 1
  ) {
    throw new Error(
      "Exactly one certificate should exist",
    )
  }
}

function validateRepeatedResponse(
  response,
) {
  if (
    response.statusCode !== 200
  ) {
    throw new Error(
      `Repeated webhook returned HTTP ${response.statusCode}: ${JSON.stringify(
        response.body,
      )}`,
    )
  }

  if (
    response.body
      ?.creditsGranted !==
      false
  ) {
    throw new Error(
      "Repeated webhook granted another credit",
    )
  }

  if (
    response.body
      ?.creditConsumed !==
      false
  ) {
    throw new Error(
      "Repeated webhook consumed another credit",
    )
  }

  if (
    response.body
      ?.emailSent !==
      false
  ) {
    throw new Error(
      "Repeated webhook attempted another delivery",
    )
  }

  if (
    response.body
      ?.duplicateDeliverySkipped !==
      true
  ) {
    throw new Error(
      "Repeated webhook was not recognized as already delivered",
    )
  }
}

function validateRepeatedDatabaseState(
  firstState,
  repeatedState,
) {
  if (
    repeatedState
      ?.certificate_id !==
    firstState
      ?.certificate_id
  ) {
    throw new Error(
      "Repeated webhook created a different certificate",
    )
  }

  if (
    repeatedState
      ?.evidence_key !==
    firstState
      ?.evidence_key
  ) {
    throw new Error(
      "Repeated webhook replaced the Evidence Key",
    )
  }

  if (
    toNumber(
      repeatedState
        ?.purchase_grants,
    ) !== 1 ||
    toNumber(
      repeatedState
        ?.certificate_consumptions,
    ) !== 1 ||
    toNumber(
      repeatedState
        ?.certificate_count,
    ) !== 1
  ) {
    throw new Error(
      "Repeated webhook created duplicate administrative records",
    )
  }

  if (
    toNumber(
      repeatedState
        ?.delivery_attempts,
    ) !== 1
  ) {
    throw new Error(
      "Repeated webhook created another delivery attempt",
    )
  }

  if (
    toNumber(
      repeatedState
        ?.balance,
    ) !== 0 ||
    toNumber(
      repeatedState
        ?.total_granted,
    ) !== 1 ||
    toNumber(
      repeatedState
        ?.total_used,
    ) !== 1
  ) {
    throw new Error(
      "Repeated webhook changed the credit account",
    )
  }
}

async function runCheck() {
  console.log(
    "[LOCAL WEBHOOK CHECK] Preparing isolated test...",
  )

  const fakeSmtp =
    createFakeSmtpServer()

  let smtpStarted = false

  await removeTestRecords()

  try {
    const smtpPort =
      await fakeSmtp.start()

    smtpStarted = true

    process.env.SMTP_HOST =
      "127.0.0.1"

    process.env.SMTP_PORT =
      String(smtpPort)

    process.env.SMTP_USER =
      "guardianchain-test@localhost"

    process.env.SMTP_PASS =
      "guardianchain-test-password"

    console.log(
      "[LOCAL WEBHOOK CHECK] Local SMTP ready:",
      {
        port:
          smtpPort,
      },
    )

    const event =
      createStripeEvent()

    console.log(
      "[LOCAL WEBHOOK CHECK] Executing first webhook...",
    )

    const firstResponse =
      await executeWebhook(
        event,
      )

    validateFirstResponse(
      firstResponse,
    )

    const firstState =
      await readDatabaseState()

    validateFirstDatabaseState(
      firstState,
    )

    if (
      fakeSmtp.messages
        .length !== 1
    ) {
      throw new Error(
        `Expected one local email, found ${fakeSmtp.messages.length}`,
      )
    }

    const capturedEmail =
      fakeSmtp.messages[0]

    if (
      !capturedEmail.includes(
        firstState.evidence_key,
      )
    ) {
      throw new Error(
        "The email does not contain the same Evidence Key stored in the database",
      )
    }

    console.log(
      "[LOCAL WEBHOOK CHECK] First execution confirmed:",
      {
        orderId:
          firstState.order_id,

        certificateId:
          firstState
            .certificate_id,

        evidenceKey:
          firstState
            .evidence_key,

        granted:
          firstState
            .total_granted,

        used:
          firstState
            .total_used,

        balance:
          firstState.balance,

        deliveryStatus:
          firstState
            .delivery_status,
      },
    )

    console.log(
      "[LOCAL WEBHOOK CHECK] Repeating the same Stripe event...",
    )

    const repeatedResponse =
      await executeWebhook(
        event,
      )

    validateRepeatedResponse(
      repeatedResponse,
    )

    const repeatedState =
      await readDatabaseState()

    validateRepeatedDatabaseState(
      firstState,
      repeatedState,
    )

    if (
      fakeSmtp.messages
        .length !== 1
    ) {
      throw new Error(
        "Repeated webhook produced another email",
      )
    }

    console.log(
      "[LOCAL WEBHOOK CHECK] Idempotency confirmed:",
      {
        certificates:
          repeatedState
            .certificate_count,

        purchaseGrants:
          repeatedState
            .purchase_grants,

        consumptions:
          repeatedState
            .certificate_consumptions,

        emails:
          fakeSmtp.messages
            .length,

        deliveryAttempts:
          repeatedState
            .delivery_attempts,
      },
    )

    console.log(
      "[LOCAL WEBHOOK CHECK] Validation completed successfully.",
    )
  } finally {
    process.env.SMTP_HOST =
      ORIGINAL_SMTP_ENV.host

    process.env.SMTP_PORT =
      ORIGINAL_SMTP_ENV.port

    process.env.SMTP_USER =
      ORIGINAL_SMTP_ENV.user

    process.env.SMTP_PASS =
      ORIGINAL_SMTP_ENV.pass

    if (smtpStarted) {
      await fakeSmtp.stop()
    }

    await removeTestRecords()

    console.log(
      "[LOCAL WEBHOOK CHECK] Test records removed.",
    )
  }
}

runCheck().catch(
  (error) => {
    console.error(
      "[LOCAL WEBHOOK CHECK] Validation failed:",
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
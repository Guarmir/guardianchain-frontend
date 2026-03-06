import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { hash, lang } = req.body;

    if (!hash) {
      return res.status(400).json({ error: "Hash não informado" });
    }

    const session = await stripe.checkout.sessions.create({

      mode: "payment",

      payment_method_types: ["card"],

      billing_address_collection: "auto",

      customer_creation: "always",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "GuardianChain Digital Proof Registration",
              description: "On-chain proof of authorship and precedence"
            },
            unit_amount: 900
          },
          quantity: 1
        }
      ],

      metadata: {
        hash: hash,
        lang: lang || "en"
      },

      success_url: `${req.headers.origin}/success?hash=${hash}`,

      cancel_url: `${req.headers.origin}`

    });

    return res.status(200).json({ url: session.url });

  } catch (error) {

    console.error("Stripe error:", error);

    return res.status(500).json({
      error: "Erro ao criar sessão de pagamento"
    });

  }

}
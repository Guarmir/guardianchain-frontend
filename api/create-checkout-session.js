import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { hash } = req.body;

    if (!hash) {
      return res.status(400).json({ error: "Missing hash" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "GuardianChain Proof Registration",
            },
            unit_amount: 900,
          },
          quantity: 1,
        },
      ],

      success_url: `${req.headers.origin}/success?hash=${hash}`,
      cancel_url: `${req.headers.origin}`,

      metadata: {
        hash: hash,
      },

    });

    return res.status(200).json({ url: session.url });

  } catch (error) {

    console.error("Stripe error:", error);

    return res.status(500).json({
      error: "Stripe session creation failed",
      details: error.message
    });

  }

}
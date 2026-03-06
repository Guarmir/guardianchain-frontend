import Stripe from "stripe";
import nodemailer from "nodemailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {

  const sig = req.headers["stripe-signature"];

  let event;

  try {

    const chunks = [];

    for await (const chunk of req) {
      chunks.push(chunk);
    }

    const buf = Buffer.concat(chunks);

    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

  } catch (err) {

    console.error("Erro na assinatura do webhook:", err.message);

    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // EVENTO DE PAGAMENTO CONFIRMADO
  if (event.type === "checkout.session.completed") {

    const session = event.data.object;

    const email =
      session.customer_details?.email ||
      session.customer_email ||
      null;

    const hash = session.metadata?.hash || null;

    console.log("Pagamento confirmado");
    console.log("Email:", email);
    console.log("Hash:", hash);

    if (!email) {
      console.error("Email não encontrado.");
      return res.status(200).json({ received: true });
    }

    try {

      const transporter = nodemailer.createTransport({

        host: process.env.SMTP_HOST,

        port: Number(process.env.SMTP_PORT),

        secure: true,

        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }

      });

      await transporter.sendMail({

        from: `"GuardianChain" <${process.env.SMTP_USER}>`,

        to: email,

        subject: "GuardianChain - Certificado de Registro",

        html: `
        <h2>Registro realizado com sucesso</h2>

        <p>Seu arquivo foi registrado na blockchain.</p>

        <p><strong>Hash do arquivo:</strong></p>

        <p>${hash}</p>

        <p>Guarde este hash como prova de autoria.</p>
        `
      });

      console.log("Email enviado com sucesso");

    } catch (error) {

      console.error("Erro ao enviar email:", error);

    }

  }

  res.status(200).json({ received: true });

}
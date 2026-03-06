import Stripe from "stripe";
import nodemailer from "nodemailer";
import generateCertificate from "./generate-certificate.js";

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

  if (event.type === "checkout.session.completed") {

    const session = event.data.object;

    const email =
      session.customer_details?.email ||
      session.customer_email ||
      null;

    const hash = session.metadata?.hash || null;

    const lang = session.metadata?.lang || "en";

    console.log("Pagamento confirmado");
    console.log("Email:", email);
    console.log("Hash:", hash);
    console.log("Idioma:", lang);

    if (!email || !hash) {

      console.error("Email ou hash não encontrados");

      return res.status(200).json({ received: true });
    }

    try {

      const pdfBuffer = await generateCertificate(hash, lang);

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

        subject:
          lang === "pt"
            ? "GuardianChain - Certificado de Registro"
            : "GuardianChain - Registration Certificate",

        html: `
        <h2>
        ${
          lang === "pt"
            ? "Registro realizado com sucesso"
            : "Registration completed successfully"
        }
        </h2>

        <p>
        ${
          lang === "pt"
            ? "Seu certificado está anexado."
            : "Your certificate is attached."
        }
        </p>
        `,

        attachments: [
          {
            filename: "GuardianChain_Certificate.pdf",
            content: pdfBuffer
          }
        ]

      });

      console.log("Email enviado com certificado");

    } catch (error) {

      console.error("Erro ao gerar ou enviar certificado:", error);

    }

  }

  res.status(200).json({ received: true });

}
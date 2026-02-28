import Stripe from "stripe";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function generatePDF(hash, date, qrBuffer) {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });

    doc.fontSize(22).text("GuardianChain Certificate", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Hash: ${hash}`);
    doc.text(`Date: ${date}`);
    doc.text("Network: Polygon");
    doc.moveDown();
    doc.text("This document certifies proof of existence and authorship.");
    doc.moveDown();
    doc.image(qrBuffer, { fit: [150, 150], align: "center" });

    doc.end();
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    const rawBody = await getRawBody(req);

    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;

      const email = session.customer_details.email;
      const hash = session.metadata.hash;
      const date = new Date().toISOString();

      console.log("Pagamento confirmado:");
      console.log("Email:", email);
      console.log("Hash:", hash);

      // QR Code
      const verifyUrl = `https://www.guardianchain.online/#/verify/${hash}`;
      const qrBuffer = await QRCode.toBuffer(verifyUrl);

      // PDF
      const pdfBuffer = await generatePDF(hash, date, qrBuffer);

      // Email transport
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"GuardianChain" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "GuardianChain Certificate of Registration",
        html: `
          <h2>Your digital proof has been registered</h2>
          <p><strong>Hash:</strong> ${hash}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p>Verification link:</p>
          <a href="${verifyUrl}">${verifyUrl}</a>
        `,
        attachments: [
          {
            filename: "GuardianChain_Certificate.pdf",
            content: pdfBuffer,
          },
        ],
      });

      console.log("Email enviado com sucesso.");
    } catch (err) {
      console.error("Erro ao enviar email:", err);
      return res.status(500).json({ error: "Email sending failed" });
    }
  }

  res.status(200).json({ received: true });
}
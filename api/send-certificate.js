import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, pdfBase64 } = req.body;

  if (!email || !pdfBase64) {
    return res.status(400).json({ message: "Missing data" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"GuardianChain" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Digital Proof Certificate",
      text: "Your certificate is attached.",
      attachments: [
        {
          filename: "guardianchain-certificate.pdf",
          content: pdfBase64,
          encoding: "base64",
        },
      ],
    });

    return res.status(200).json({ message: "Email sent successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error sending email" });
  }
}

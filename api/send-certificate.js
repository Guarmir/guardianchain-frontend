import nodemailer from "nodemailer"

export default async function sendCertificate(email, verificationUrl){

  const transporter = nodemailer.createTransport({

    host: process.env.SMTP_HOST,

    port: 587,

    secure: false,

    auth:{
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }

  })

  await transporter.sendMail({

    from: '"GuardianChain" <no-reply@guardianchain.online>',

    to: email,

    subject: "Your GuardianChain Certificate",

    html: `
      <h2>Your certificate is ready</h2>

      <p>
      Your file hash has been successfully registered.
      </p>

      <p>
      Access your certificate using the link below:
      </p>

      <p>
      <a href="${verificationUrl}">
      ${verificationUrl}
      </a>
      </p>

      <p>
      GuardianChain
      </p>
    `
  })

}
import PDFDocument from "pdfkit";
import QRCode from "qrcode";

export default async function generateCertificate(hash, lang = "en") {

  const texts = {

    en: {
      title: "GuardianChain Certificate",
      proof: "This document certifies proof of existence and authorship.",
      hash: "Hash:",
      date: "Date:",
      network: "Network:"
    },

    pt: {
      title: "Certificado GuardianChain",
      proof: "Este documento certifica prova de existência e autoria.",
      hash: "Hash:",
      date: "Data:",
      network: "Rede:"
    }

  };

  const t = texts[lang] || texts.en;

  const verifyURL = `https://guardianchain.online/verify?hash=${hash}`;

  const qr = await QRCode.toDataURL(verifyURL);

  const doc = new PDFDocument();

  const buffers = [];

  doc.on("data", buffers.push.bind(buffers));

  const result = new Promise((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
  });

  doc.fontSize(24).text(t.title, { align: "center" });

  doc.moveDown();

  doc.fontSize(12).text(`${t.hash} ${hash}`);
  doc.text(`${t.date} ${new Date().toISOString()}`);
  doc.text(`${t.network} Polygon`);

  doc.moveDown();

  doc.text(t.proof);

  doc.moveDown();

  const qrImage = qr.replace(/^data:image\/png;base64,/, "");
  const qrBuffer = Buffer.from(qrImage, "base64");

  doc.image(qrBuffer, {
    fit: [150, 150],
    align: "center"
  });

  doc.end();

  return result;

}
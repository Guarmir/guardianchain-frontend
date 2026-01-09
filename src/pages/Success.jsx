import jsPDF from "jspdf";

export default function Success() {
  function downloadPDF() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("GuardianChain", 20, 20);

    doc.setFontSize(12);
    doc.text("Digital Proof Certificate", 20, 40);

    doc.text(
      "This document certifies that a digital proof was successfully registered.",
      20,
      60
    );

    doc.text("Timestamp:", 20, 80);
    doc.text(new Date().toISOString(), 20, 90);

    doc.text(
      "Blockchain: Polygon\nImmutable cryptographic proof.",
      20,
      110
    );

    doc.save("guardianchain-certificate.pdf");
  }

  return (
    <div style={styles.container}>
      <h1>✅ Payment Confirmed</h1>
      <p>Your digital proof registration was successful.</p>

      <button style={styles.button} onClick={downloadPDF}>
        Download Certificate (PDF)
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "80px auto",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center"
  },
  button: {
    marginTop: "30px",
    padding: "14px 28px",
    fontSize: "16px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

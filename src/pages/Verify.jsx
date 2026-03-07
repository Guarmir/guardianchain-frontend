import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { useSearchParams } from "react-router-dom"

export default function Verify() {

  const [searchParams] = useSearchParams()

  const [file, setFile] = useState(null)
  const [calculatedHash, setCalculatedHash] = useState("")
  const [inputHash, setInputHash] = useState("")
  const [match, setMatch] = useState(null)

  // carregar hash da URL
  useEffect(() => {
    const hashFromUrl = searchParams.get("hash")

    if (hashFromUrl) {
      setInputHash(hashFromUrl)
    }
  }, [searchParams])

  // gerar hash do arquivo
  async function generateHash(file) {

    const buffer = await file.arrayBuffer()

    const hash = ethers.keccak256(new Uint8Array(buffer))

    return hash
  }

  // quando usuário seleciona arquivo
  async function handleFileChange(e) {

    const selectedFile = e.target.files[0]

    if (!selectedFile) return

    setFile(selectedFile)

    const hash = await generateHash(selectedFile)

    setCalculatedHash(hash)

    if (inputHash) {
      setMatch(hash.toLowerCase() === inputHash.toLowerCase())
    }
  }

  // quando usuário digita hash
  function handleHashChange(e) {

    const value = e.target.value.trim()

    setInputHash(value)

    if (calculatedHash) {
      setMatch(calculatedHash.toLowerCase() === value.toLowerCase())
    }
  }

  return (

    <div style={styles.page}>

      <div style={styles.card}>

        <h1 style={styles.title}>
          Verify Digital Proof
        </h1>

        <p style={styles.description}>
          Upload a file and compare its cryptographic hash with a registered proof.
        </p>

        <label style={styles.label}>
          Registered Hash
        </label>

        <input
          type="text"
          value={inputHash}
          onChange={handleHashChange}
          placeholder="0x..."
          style={styles.input}
        />

        <label style={styles.label}>
          Upload File
        </label>

        <input
          type="file"
          onChange={handleFileChange}
          style={styles.file}
        />

        {calculatedHash && (

          <div style={styles.hashBox}>

            <p style={styles.hashLabel}>
              Calculated Hash
            </p>

            <p style={styles.hash}>
              {calculatedHash}
            </p>

          </div>

        )}

        {match !== null && (

          <div style={{
            ...styles.result,
            backgroundColor: match ? "#e6f7ee" : "#fdecea",
            color: match ? "#1a7f4b" : "#b42318"
          }}>

            {match
              ? "File matches the registered hash. Proof verified."
              : "File does NOT match the registered hash."}

          </div>

        )}

        {inputHash && (

          <div style={styles.explorer}>

            <p>
              View blockchain record:
            </p>

            <a
              href={`https://polygonscan.com/search?query=${inputHash}`}
              target="_blank"
              rel="noreferrer"
            >
              Open in PolygonScan
            </a>

          </div>

        )}

      </div>

    </div>

  )
}

const styles = {

  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f4f6f8",
    padding: "20px"
  },

  card: {
    maxWidth: "600px",
    width: "100%",
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
  },

  title: {
    fontSize: "28px",
    marginBottom: "10px"
  },

  description: {
    marginBottom: "30px",
    color: "#666"
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600"
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "6px",
    border: "1px solid #ddd"
  },

  file: {
    marginBottom: "20px"
  },

  hashBox: {
    marginTop: "20px",
    marginBottom: "20px"
  },

  hashLabel: {
    fontSize: "14px",
    color: "#888"
  },

  hash: {
    fontFamily: "monospace",
    wordBreak: "break-all"
  },

  result: {
    marginTop: "20px",
    padding: "16px",
    borderRadius: "8px",
    fontWeight: "600",
    textAlign: "center"
  },

  explorer: {
    marginTop: "20px",
    fontSize: "14px"
  }

}
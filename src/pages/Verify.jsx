import { useState, useEffect } from "react"

export default function Verify() {

  const [hash, setHash] = useState("")
  const [fileHash, setFileHash] = useState("")
  const [match, setMatch] = useState(null)
  const [language, setLanguage] = useState("en")

  useEffect(() => {

    const params = new URLSearchParams(window.location.search)

    const hashParam = params.get("hash")

    const langParam = params.get("lang")

    if (hashParam) {
      setHash(hashParam)
    }

    if (langParam && langParam.startsWith("pt")) {
      setLanguage("pt")
    } else if (navigator.language.startsWith("pt")) {
      setLanguage("pt")
    }

  }, [])

  async function generateHash(file) {

    const buffer = await file.arrayBuffer()

    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)

    const hashArray = Array.from(new Uint8Array(hashBuffer))

    const hashHex = hashArray
      .map(b => b.toString(16).padStart(2, "0"))
      .join("")

    const fullHash = "0x" + hashHex

    setFileHash(fullHash)

    if (hash === fullHash) {
      setMatch(true)
    } else {
      setMatch(false)
    }

  }

  const text = {

    pt: {
      title: "Verificar Prova Digital",
      description:
        "Envie o arquivo original para comparar o hash criptográfico.",
      registeredHash: "Hash Registrado",
      uploadFile: "Enviar Arquivo",
      viewBlockchain: "Ver registro na blockchain",
      match: "Arquivo autêntico ✔",
      fail: "Arquivo não corresponde ✖"
    },

    en: {
      title: "Verify Digital Proof",
      description:
        "Upload a file and compare its cryptographic hash with a registered proof.",
      registeredHash: "Registered Hash",
      uploadFile: "Upload File",
      viewBlockchain: "View blockchain record",
      match: "File authentic ✔",
      fail: "File does not match ✖"
    }

  }

  const t = text[language]

  return (

    <div style={{
      maxWidth: "700px",
      margin: "auto",
      padding: "40px",
      fontFamily: "Arial"
    }}>

      <h1>{t.title}</h1>

      <p>{t.description}</p>

      <h3>{t.registeredHash}</h3>

      <input
        value={hash}
        readOnly
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px"
        }}
      />

      <h3>{t.uploadFile}</h3>

      <input
        type="file"
        onChange={(e) => generateHash(e.target.files[0])}
      />

      <br/><br/>

      <p>
        {t.viewBlockchain}:
        <br/>
        <a
          href={`https://polygonscan.com/search?q=${hash}`}
          target="_blank"
        >
          Open in PolygonScan
        </a>
      </p>

      {match === true && (
        <p style={{color:"green",fontWeight:"bold"}}>
          {t.match}
        </p>
      )}

      {match === false && (
        <p style={{color:"red",fontWeight:"bold"}}>
          {t.fail}
        </p>
      )}

    </div>

  )

}
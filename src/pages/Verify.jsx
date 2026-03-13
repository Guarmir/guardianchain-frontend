import { useSearchParams } from "react-router-dom"

export default function Verify(){

  const [params] = useSearchParams()

  const hash = params.get("hash")

  const langParam = params.get("lang")

  const lang = langParam === "pt" ? "pt" : "en"

  function download(){

    window.location.href =
      `/api/download-certificate?hash=${hash}&lang=${lang}`

  }

  return(

    <div style={{textAlign:"center",marginTop:"100px"}}>

      <h1>GuardianChain</h1>

      <p>Hash:</p>

      <p>{hash}</p>

      <button onClick={download}>
        Download Certificate
      </button>

    </div>

  )

}
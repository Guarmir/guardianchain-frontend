function About() {
  return (
    <div style={{ padding: "3rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Sobre o GuardianChain</h1>

      <p style={{ marginTop: "1rem", lineHeight: "1.6" }}>
        GuardianChain é uma infraestrutura digital de registro on-chain
        que permite comprovar autoria e anterioridade de arquivos digitais
        através da tecnologia blockchain.
      </p>

      <p style={{ marginTop: "1rem", lineHeight: "1.6" }}>
        Ao registrar o hash criptográfico do arquivo na rede Polygon,
        o sistema cria uma prova pública, imutável e verificável,
        sem expor o conteúdo original.
      </p>

      <p style={{ marginTop: "1rem", lineHeight: "1.6" }}>
        O serviço foi projetado para criadores, desenvolvedores,
        empresas e profissionais que necessitam de comprovação técnica
        de existência e autoria.
      </p>
    </div>
  );
}

export default About;
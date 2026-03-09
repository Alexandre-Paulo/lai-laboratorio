export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  try {
    // Esta URL pede ao Google a lista de modelos disponíveis para a sua chave
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    console.log("Modelos disponíveis:", data);

    if (data.error) {
      return res.status(500).json({ error: "Erro na Chave: " + data.error.message });
    }

    // Retorna a lista de nomes de modelos para você ver no site
    const nomes = data.models.map(m => m.name).join(', ');
    res.status(200).json({ resposta: "Sua chave permite estes modelos: " + nomes });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

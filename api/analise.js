export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.GEMINI_API_KEY;
  const { dados } = req.body;

  try {
    // Mudamos para gemini-pro que tem 100% de disponibilidade nas rotas v1
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: "Analise estes dados de rescisão e explique os direitos: " + dados }] 
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("Erro do Google:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    if (!data.candidates || data.candidates.length === 0) {
        return res.status(500).json({ error: "A IA não gerou uma resposta. Tente novamente." });
    }

    const textoIA = data.candidates[0].content.parts[0].text;
    res.status(200).json({ resposta: textoIA });

  } catch (err) {
    res.status(500).json({ error: "Falha na conexão: " + err.message });
  }
}

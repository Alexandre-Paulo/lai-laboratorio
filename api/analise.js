export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.GEMINI_API_KEY;
  const { dados } = req.body;

  try {
    // Mudamos para v1 (mais estável) e o nome do modelo completo
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: "Atue como um consultor especializado. Analise estes dados de rescisão e explique os direitos: " + dados }] 
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("Erro detalhado do Google:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    const textoIA = data.candidates[0].content.parts[0].text;
    res.status(200).json({ resposta: textoIA });

  } catch (err) {
    res.status(500).json({ error: "Falha na conexão: " + err.message });
  }
}

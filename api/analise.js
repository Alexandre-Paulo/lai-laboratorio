export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.GEMINI_API_KEY;
  const { dados } = req.body;

  try {
    // Usando o modelo que apareceu na sua lista!
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: "Atue como um consultor jurídico e financeiro. Analise estes dados de rescisão e explique os direitos e cálculos de forma didática: " + dados }] 
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    // A estrutura do Gemini 3 mantém a compatibilidade
    const textoIA = data.candidates[0].content.parts[0].text;
    res.status(200).json({ resposta: textoIA });

  } catch (err) {
    res.status(500).json({ error: "Erro na conexão: " + err.message });
  }
}

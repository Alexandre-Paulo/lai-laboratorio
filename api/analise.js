export default async function handler(req, res) {
  // Configurações de segurança para o seu site acessar a função
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { dados } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; // Puxa a chave que você salvou na Vercel

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Atue como um consultor jurídico e financeiro especializado. Analise estes dados de rescisão e explique os direitos e cálculos de forma clara e didática: " + dados }] }]
      })
    });

    const data = await response.json();
    const textoIA = data.candidates[0].content.parts[0].text;
    res.status(200).json({ resposta: textoIA });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao conectar com a IA' });
  }
}

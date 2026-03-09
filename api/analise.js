export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("ERRO: Variável GEMINI_API_KEY não encontrada!");
    return res.status(500).json({ error: "Configuração ausente" });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Diga Oi" }] }]
      })
    });

    const data = await response.json();
    console.log("Resposta do Google:", data);
    
    if (data.error) {
       return res.status(500).json({ error: data.error.message });
    }

    res.status(200).json({ resposta: data.candidates[0].content.parts[0].text });
  } catch (err) {
    console.error("Erro na função:", err.message);
    res.status(500).json({ error: err.message });
  }
}

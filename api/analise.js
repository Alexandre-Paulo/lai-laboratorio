export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

    const { dados } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Mudamos para v1beta para garantir compatibilidade total com o modelo flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Analise como consultor de RH: " + dados }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ error: `Google: ${data.error.message}` });
        }

        if (data.candidates && data.candidates[0].content) {
            res.status(200).json({ resposta: data.candidates[0].content.parts[0].text });
        } else {
            res.status(500).json({ error: "Resposta vazia da IA." });
        }
    } catch (error) {
        res.status(500).json({ error: "Falha na conexão com a API." });
    }
}

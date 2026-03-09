export default async function handler(req, res) {
    // Configurações de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { dados } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Chave API não encontrada no servidor.' });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Atue como um consultor financeiro. Analise estes dados: " + dados }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ error: 'Erro na API do Google: ' + data.error.message });
        }

        const textoIA = data.candidates[0].content.parts[0].text;
        res.status(200).json({ resposta: textoIA });
    } catch (error) {
        res.status(500).json({ error: 'Falha total na requisição: ' + error.message });
    }
}

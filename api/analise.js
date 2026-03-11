export default async function handler(req, res) {
    const { dados } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Mudamos de v1beta para v1 (mais estável)
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Analise esta rescisão como um consultor de RH sênior: " + dados }] }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        const textoIA = data.candidates[0].content.parts[0].text;
        res.status(200).json({ resposta: textoIA });
    } catch (error) {
        res.status(500).json({ error: "Erro na comunicação com a IA." });
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Metodo não permitido');
    
    const { dados } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Mudamos para o gemini-1.0-pro (Máxima compatibilidade)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Atue como consultor de RH. Analise os dados e dê um parecer: " + dados }] }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            // Isso vai nos mostrar no alerta exatamente o que o Google está reclamando
            return res.status(500).json({ error: data.error.message });
        }

        if (data.candidates && data.candidates[0].content) {
            const textoIA = data.candidates[0].content.parts[0].text;
            res.status(200).json({ resposta: textoIA });
        } else {
            res.status(500).json({ error: "O Google retornou uma resposta vazia." });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro interno: " + error.message });
    }
}

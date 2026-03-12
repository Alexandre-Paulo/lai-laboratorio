export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

    const { dados } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Usando o modelo que apareceu na sua lista!
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Atue como um consultor de RH sênior. Analise estes dados de rescisão e forneça um parecer técnico detalhado: " + dados }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ error: `Erro Google: ${data.error.message}` });
        }

        if (data.candidates && data.candidates[0].content) {
            const textoIA = data.candidates[0].content.parts[0].text;
            res.status(200).json({ resposta: textoIA });
        } else {
            res.status(500).json({ error: "A IA não retornou dados." });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro na comunicação com o servidor." });
    }
}

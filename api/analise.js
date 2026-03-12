export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

    const { dados } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // 'gemini-flash-latest' é o caminho mais seguro para fugir do erro 'limit: 0'
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Atue como um consultor de RH sênior. Analise estes dados de rescisão e forneça um parecer técnico: " + dados }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            // Se o erro de quota persistir, aqui ele vai nos dizer o motivo real
            return res.status(500).json({ error: `Google: ${data.error.message}` });
        }

        if (data.candidates && data.candidates[0].content) {
            res.status(200).json({ resposta: data.candidates[0].content.parts[0].text });
        } else {
            res.status(500).json({ error: "A IA não retornou dados." });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro na comunicação com o servidor." });
    }
}

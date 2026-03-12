export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Método não permitido');
    
    const { dados } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Rota v1 estável - o "porto seguro" do Google
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Atue como um consultor de RH sênior. Analise estes dados e forneça um parecer sobre a rescisão: " + dados }] }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        const textoIA = data.candidates[0].content.parts[0].text;
        res.status(200).json({ resposta: textoIA });
    } catch (error) {
        res.status(500).json({ error: "Erro interno no servidor." });
    }
}

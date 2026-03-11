export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Metodo não permitido');
    
    const { dados } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Mudança para v1 (Estável) e modelo estável
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Analise esta situação de rescisão trabalhista e dê um parecer consultivo: " + dados }] }]
            })
        });

        const data = await response.json();
        
        // Se der erro, vamos enviar o erro detalhado para o seu alerta na tela
        if (data.error) {
            return res.status(data.error.code || 500).json({ 
                error: `Erro Google (${data.error.status}): ${data.error.message}` 
            });
        }

        if (data.candidates && data.candidates[0].content) {
            const textoIA = data.candidates[0].content.parts[0].text;
            res.status(200).json({ resposta: textoIA });
        } else {
            res.status(500).json({ error: "Resposta da IA veio vazia." });
        }

    } catch (error) {
        res.status(500).json({ error: "Erro de conexão no servidor." });
    }
}

export default async function handler(req, res) {
    const { dados } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Atualizado para o modelo gemini-1.5-flash, que é o padrão atual
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        text: "Você é um especialista em RH. Analise estes dados de rescisão e dê um parecer profissional: " + dados 
                    }] 
                }]
            })
        });

        const data = await response.json();
        
        // Verifica se a API do Google retornou algum erro específico
        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        // Extrai o texto da resposta gerada
        const textoIA = data.candidates[0].content.parts[0].text;
        res.status(200).json({ resposta: textoIA });

    } catch (error) {
        res.status(500).json({ error: "Erro interno ao processar a análise." });
    }
}

export default async function handler(req, res) {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Vamos extrair apenas os nomes dos modelos para facilitar a leitura
        const modelosDisponiveis = data.models ? data.models.map(m => m.name) : data;
        
        res.status(200).json({ 
            mensagem: "Estes são os modelos que sua chave alcança:",
            modelos: modelosDisponiveis 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

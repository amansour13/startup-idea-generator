const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { InferenceClient } = require('@huggingface/inference'); // Import InferenceClient
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Create a Hugging Face inference client with your API key
const client = new InferenceClient(process.env.HF_API_KEY);

// Endpoint to generate startup idea using the Hugging Face API
app.post('/generate-idea', async (req, res) => {
    const { industry, trend } = req.body;

    if (!industry || !trend) {
        return res.status(400).json({ error: 'Industry and Trend are required.' });
    }

    const prompt = `Generate a startup idea for the industry: ${industry} and trend: ${trend}. just give me the name of idea and one-liner pitch. (no more or less) (make your response in this form only: Idea: **"<idea>"** Pitch: "<pitch>")\n\n`;

    try {
        // Use the InferenceClient to make a request to the Hugging Face model
        const chatCompletion = await client.chatCompletion({
            provider: 'hf-inference',
            model: 'mistralai/Mistral-Nemo-Instruct-2407', // Replace with your model name
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            max_tokens: 500,
        });

        // Extract the generated text from the response
        const startupIdea = chatCompletion.choices[0]?.message?.content || 'Could not generate an idea.';
        res.json({ startupIdea });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate startup idea' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

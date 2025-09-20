import {
    GoogleGenAI,
} from '@google/genai';

export async function generatorExecuse(execuse: string) {
    const ai = new GoogleGenAI({
        apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
    });
    const config = {
        thinkingConfig: {
            thinkingBudget: 0,
        },
        systemInstruction: [
            {
                text:
                    `Estou fazendo um app onde o usuario irá entrar com um evento e quero responder um desculpa esfarrapada, quero que seja engraçada e que não ofenda ninguém.
                Responda o texto diretamente em texto puro com a desculpa escolhida, sem links.
                Sugira apenas um desculpa por entrada.`,
            }
        ],
    };
    const model = 'gemini-2.5-flash-lite';
    const contents = [
        {
            role: 'user',
            parts: [
                {
                    text: execuse,
                },
            ],
        },
    ];

    try {
        const response = await ai.models.generateContent({
            model,
            config,
            contents,
        });

        const result = response?.candidates?.[0]?.content?.parts?.[0]?.text;
        return result;
    } catch (error) {
        return "Preciso levar minha vó ao jiu jitsu!"
    }
}



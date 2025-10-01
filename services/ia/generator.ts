import {
    GoogleGenAI,
} from '@google/genai';

export async function generatorPokemonFusion(pokemon1: string, pokemon2: string) {
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
          `Você é um especialista em criar fusões criativas de Pokémon. 
          
          Quando receber dois nomes de Pokémon, você deve:
          1. Criar um nome de fusão criativo combinando elementos dos dois nomes
          2. Descrever detalhadamente as características físicas da fusão, incluindo aparência, cores, texturas e elementos visuais marcantes
          3. Explicar os poderes e habilidades especiais que a fusão possui, combinando as características dos dois Pokémon originais
          4. Descrever a personalidade e comportamento da criatura
          
          Exemplo de formato esperado:
          "Nome: [nome da fusão]
          
          Características: [descrição detalhada da aparência física, incluindo corpo, pelagem/pele, olhos, cauda, membros especiais, cores, brilhos, texturas, etc.]
          
          [descrição dos poderes psíquicos, elementais, físicos e habilidades especiais. Incluir possíveis evoluções ou formas alternativas se fizer sentido]
          
          [descrição da personalidade, inteligência e temperamento]"
          
          Seja criativo, detalhado e mantenha o espírito divertido do universo Pokémon.
          Responda diretamente em texto puro, sem formatação markdown.`,
      }
    ],
  };

  const model = 'gemini-2.5-flash-lite';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `${pokemon1} com ${pokemon2}`,
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
    return "Erro ao gerar a fusão de Pokémon. Tente novamente!";
  }
}

// services/ia/imageGenerator.ts
export async function generatePokemonImage(description: string, pokemon1: string, pokemon2: string) {
  try {
    // Extrai características principais da descrição para o prompt
    const prompt = `pokemon fusion of ${pokemon1} and ${pokemon2}, cute creature, official pokemon art style, colorful, detailed, high quality, digital art, centered, white background`;
    
    // Codifica o prompt para URL
    const encodedPrompt = encodeURIComponent(prompt);
    
    // URL da API Pollinations (gratuita, sem API key necessária)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&enhance=true`;
    
    return imageUrl;
  } catch (error) {
    console.error('Erro ao gerar imagem:', error);
    return null;
  }
}

export async function generatePokemonImage2(
  description: string, 
  pokemon1: string, 
  pokemon2: string
): Promise<string | null> {
  const HF_API_KEY = process.env.EXPO_PUBLIC_HUGGINGFACE_API_KEY;
  
  if (!HF_API_KEY) {
    console.error('API Key do Hugging Face não configurada');
    return null;
  }

  try {
    // Cria um prompt otimizado
    const prompt = `adorable pokemon fusion creature combining ${pokemon1} and ${pokemon2}, official pokemon card art style, colorful, cute, highly detailed, centered composition, white background, professional digital illustration`;
    
    const negativePrompt = "blurry, bad quality, distorted, ugly, low quality, dark, scary, realistic, human, text, watermark";

    // Usando o modelo Stable Diffusion XL
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: negativePrompt,
            num_inference_steps: 30,
            guidance_scale: 7.5,
            width: 512,
            height: 512,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na API:', errorText);
      
      // Se o modelo está carregando, tenta novamente após alguns segundos
      if (response.status === 503) {
        console.log('Modelo carregando, tentando novamente em 10s...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        return generatePokemonImage(description, pokemon1, pokemon2);
      }
      
      return null;
    }

    // Converte a resposta em blob
    const blob = await response.blob();
    
    // Converte blob para base64 para usar no React Native
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    
  } catch (error) {
    console.error('Erro ao gerar imagem:', error);
    return null;
  }
}

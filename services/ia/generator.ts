import { GoogleGenAI } from '@google/genai';

/**
 * Gera a descrição da fusão de dois Pokémon usando Google Gemini
 */
export async function generatorPokemonFusion(
  pokemon1: string, 
  pokemon2: string
): Promise<string | null> {
  try {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('❌ API Key do Gemini não configurada');
      return null;
    }

    const ai = new GoogleGenAI({ apiKey });

    const config = {
      thinkingConfig: {
        thinkingBudget: 0,
      },
      systemInstruction: [
        {
          text: `Você é um especialista em criar fusões criativas de Pokémon. 
          
          Quando receber dois nomes de Pokémon, você deve:
          1. Criar um nome de fusão criativo combinando elementos dos dois nomes
          2. Descrever detalhadamente as características físicas da fusão, incluindo aparência, cores, texturas e elementos visuais marcantes
          3. Explicar os poderes e habilidades especiais que a fusão possui, combinando as características dos dois Pokémon originais
          4. Descrever a personalidade e comportamento da criatura
          
          Exemplo de formato esperado:
          "Nome: [nome da fusão]
          
          Características: [descrição detalhada da aparência física, incluindo corpo, pelagem/pele, olhos, cauda, membros especiais, cores, brilhos, texturas, etc.]
          
          Poderes: [descrição dos poderes psíquicos, elementais, físicos e habilidades especiais. Incluir possíveis evoluções ou formas alternativas se fizer sentido]
          
          Personalidade: [descrição da personalidade, inteligência e temperamento]"
          
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
            text: `Crie uma fusão de ${pokemon1} com ${pokemon2}`,
          },
        ],
      },
    ];

    console.log(`🤖 Gerando fusão: ${pokemon1} + ${pokemon2}`);

    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });

    const result = response?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!result) {
      console.error('❌ Resposta vazia do Gemini');
      return null;
    }

    console.log('✅ Descrição gerada com sucesso');
    return result;

  } catch (error) {
    console.error('❌ Erro ao gerar fusão:', error);
    return null;
  }
}

/**
 * Gera imagem da fusão usando Pollinations AI (gratuito, sem API key)
 */
export async function generatePokemonImage(
  description: string, 
  pokemon1: string, 
  pokemon2: string
): Promise<string | null> {
  try {
    // Cria um prompt otimizado
    const prompt = `pokemon fusion of ${pokemon1} and ${pokemon2}, cute creature, official pokemon art style, colorful, detailed, high quality, digital art, centered, white background`;
    
    // Codifica o prompt para URL
    const encodedPrompt = encodeURIComponent(prompt);
    
    // URL da API Pollinations (gratuita, sem API key necessária)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&enhance=true`;
    
    console.log('🎨 Gerando imagem via Pollinations AI');
    console.log('✅ URL da imagem gerada');
    
    return imageUrl;

  } catch (error) {
    console.error('❌ Erro ao gerar imagem:', error);
    return null;
  }
}

/**
 * Gera imagem usando Hugging Face (alternativa mais poderosa, requer API key)
 */
export async function generatePokemonImageHF(
  description: string, 
  pokemon1: string, 
  pokemon2: string
): Promise<string | null> {
  const HF_API_KEY = process.env.EXPO_PUBLIC_HUGGINGFACE_API_KEY;
  
  if (!HF_API_KEY) {
    console.error('❌ API Key do Hugging Face não configurada');
    return null;
  }

  try {
    // Cria um prompt otimizado
    const prompt = `adorable pokemon fusion creature combining ${pokemon1} and ${pokemon2}, official pokemon card art style, colorful, cute, highly detailed, centered composition, white background, professional digital illustration`;
    
    const negativePrompt = "blurry, bad quality, distorted, ugly, low quality, dark, scary, realistic, human, text, watermark";

    console.log('🎨 Gerando imagem via Hugging Face');

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
      console.error('❌ Erro na API Hugging Face:', errorText);
      
      // Se o modelo está carregando, tenta novamente após alguns segundos
      if (response.status === 503) {
        console.log('⏳ Modelo carregando, tentando novamente em 10s...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        return generatePokemonImageHF(description, pokemon1, pokemon2);
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
        console.log('✅ Imagem gerada com sucesso (base64)');
        resolve(base64data);
      };
      reader.onerror = (error) => {
        console.error('❌ Erro ao converter imagem:', error);
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
    
  } catch (error) {
    console.error('❌ Erro ao gerar imagem via HF:', error);
    return null;
  }
}

/**
 * Interface para escolher qual método de geração de imagem usar
 */
export type ImageGeneratorType = 'pollinations' | 'huggingface';

export async function generatePokemonImageWithProvider(
  description: string, 
  pokemon1: string, 
  pokemon2: string,
  provider: ImageGeneratorType = 'pollinations'
): Promise<string | null> {
  switch (provider) {
    case 'huggingface':
      return generatePokemonImageHF(description, pokemon1, pokemon2);
    case 'pollinations':
    default:
      return generatePokemonImage(description, pokemon1, pokemon2);
  }
}
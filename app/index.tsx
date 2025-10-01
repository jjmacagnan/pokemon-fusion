import { generatePokemonImage, generatorPokemonFusion } from "@/services/ia/generator";
import { styles } from "@/styles";
import { MotiView } from 'moti';
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function Index() {
  const [pokemon1, setPokemon1] = useState('')
  const [pokemon2, setPokemon2] = useState('')
  const [answer, setAnswer] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)

  const handlePress = async () => {
    if (pokemon1.length < 2 || pokemon2.length < 2) {
      alert("Digite o nome de dois Pokémon válidos!")
      return;
    }
    
    setLoading(true)
    setAnswer('')
    setImageUrl(null)
    
    try {
      // 1. Gera a descrição da fusão (primeira requisição)
      const result = await generatorPokemonFusion(pokemon1, pokemon2);
      setAnswer(result || "...");
      
      // 2. Inicia o loading da imagem e a segunda requisição
      console.log('Gerando imagem para:', result);
      setImageLoading(true)
      
      const image = await generatePokemonImage(result || '', pokemon1, pokemon2);
      
      if (image) {
        setImageUrl(image);
      } else {
        alert('Não foi possível gerar a imagem. Tente novamente.');
      }
      
    } catch (error) {
      console.error('Erro:', error);
      alert('Ocorreu um erro. Tente novamente.');
    } finally {
      // O loading principal só é desligado após a descrição E a imagem estarem prontas
      setLoading(false)
      setImageLoading(false) // Desliga o loading da imagem, não importa o resultado
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={{ padding: 20 }}>
        <StatusBar barStyle="light-content"></StatusBar>
        <Text style={styles.title}>PokéFusion</Text>
        <Text style={styles.subtitle}>Crie fusões incríveis de Pokémon</Text>
        
        <TextInput
          value={pokemon1}
          onChangeText={setPokemon1}
          style={styles.input}
          placeholder="Digite o primeiro Pokémon..."
          editable={!isLoading}
          placeholderTextColor="#666"
        />
        
        <TextInput
          value={pokemon2}
          onChangeText={setPokemon2}
          style={styles.input}
          placeholder="Digite o segundo Pokémon..."
          editable={!isLoading}
          placeholderTextColor="#666"
        />
        
        <TouchableOpacity 
          style={[styles.button, isLoading && { opacity: 0.6 }]} 
          onPress={handlePress}
          disabled={isLoading}
        >
          <Text style={styles.button_text}>
            {isLoading && !imageLoading ? "Gerando descrição..." : isLoading ? "Criando fusão..." : "Gerar Fusão Épica!"}
          </Text>
        </TouchableOpacity>
        
        {answer && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={styles.card}>
            
            {/* NOVO: Condição clara para o loading da imagem */}
            {imageLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#CC0000" />
                <Text style={styles.loadingText}>
                  Gerando a imagem da sua fusão...
                </Text>
              </View>
            )}
            
            {/* Imagem da fusão só é exibida se tiver URL e NÃO estiver carregando */}
            {imageUrl && !imageLoading && (
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: imageUrl }} 
                  style={styles.pokemonImage}
                  resizeMode="contain"
                />
              </View>
            )}
            
            <Text style={styles.card_title}>Sua fusão está pronta:</Text>
            <Text style={styles.card_text}>{answer}</Text>
          </MotiView>
        )}
      </View>
    </ScrollView>
  );
}
import { generatePokemonImage, generatorPokemonFusion } from "@/services/ia/generator";
import { pokemonService } from "@/services/pokemon/api";
import { styles } from "@/styles";
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
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

// Componente principal da tela inicial
export default function Index() {
  const router = useRouter(); // Hook de navegação
  const [pokemon1, setPokemon1] = useState(''); // Nome do primeiro Pokémon
  const [pokemon2, setPokemon2] = useState(''); // Nome do segundo Pokémon
  const [isLoading, setLoading] = useState(false); // Estado de carregamento global
  const [loadingMessage, setLoadingMessage] = useState(''); // Mensagem de carregamento exibida no botão
  const [showSuggestions1, setShowSuggestions1] = useState(false); // Controle de visibilidade das sugestões do 1º Pokémon
  const [showSuggestions2, setShowSuggestions2] = useState(false); // Controle de visibilidade das sugestões do 2º Pokémon
  const [suggestions1, setSuggestions1] = useState<string[]>([]); // Lista de sugestões do 1º Pokémon
  const [suggestions2, setSuggestions2] = useState<string[]>([]); // Lista de sugestões do 2º Pokémon
  const [loadingSuggestions1, setLoadingSuggestions1] = useState(false); // Estado de carregamento das sugestões do 1º Pokémon
  const [loadingSuggestions2, setLoadingSuggestions2] = useState(false); // Estado de carregamento das sugestões do 2º Pokémon

  // Efeito para buscar sugestões de nomes do primeiro Pokémon
  useEffect(() => {
    const searchPokemon = async () => {
      if (pokemon1.length < 2) { // Evita buscas com menos de 2 caracteres
        setSuggestions1([]);
        return;
      }

      setLoadingSuggestions1(true);
      try {
        const results = await pokemonService.searchPokemon(pokemon1, 6); // Busca no serviço de Pokémon
        setSuggestions1(results);
      } catch (error) {
        console.error('Erro ao buscar Pokémon:', error);
        setSuggestions1([]);
      } finally {
        setLoadingSuggestions1(false);
      }
    };

    const timeoutId = setTimeout(searchPokemon, 300); // Debounce para evitar múltiplas requisições
    return () => clearTimeout(timeoutId);
  }, [pokemon1]);

  // Efeito para buscar sugestões de nomes do segundo Pokémon
  useEffect(() => {
    const searchPokemon = async () => {
      if (pokemon2.length < 2) {
        setSuggestions2([]);
        return;
      }

      setLoadingSuggestions2(true);
      try {
        const results = await pokemonService.searchPokemon(pokemon2, 6);
        setSuggestions2(results);
      } catch (error) {
        console.error('Erro ao buscar Pokémon:', error);
        setSuggestions2([]);
      } finally {
        setLoadingSuggestions2(false);
      }
    };

    const timeoutId = setTimeout(searchPokemon, 300);
    return () => clearTimeout(timeoutId);
  }, [pokemon2]);

  // Função principal de geração da fusão
  const handlePress = async () => {
    // Validação simples de entrada
    if (pokemon1.length < 2 || pokemon2.length < 2) {
      alert("Digite o nome de dois Pokémon válidos!");
      return;
    }
    
    setLoading(true);
    setLoadingMessage('Gerando descrição da fusão...');
    setShowSuggestions1(false);
    setShowSuggestions2(false);
    
    try {
      // Etapa 1: gerar descrição textual da fusão
      console.log('Iniciando geração da fusão:', pokemon1, pokemon2);
      const description = await generatorPokemonFusion(pokemon1, pokemon2);
      console.log('Descrição recebida:', description);
      
      if (!description || description.trim() === '') {
        console.error('Descrição vazia recebida');
        alert('Não foi possível gerar a descrição da fusão. Tente novamente.');
        setLoading(false);
        return;
      }
      
      // Etapa 2: gerar imagem da fusão com base na descrição
      setLoadingMessage('Gerando imagem da fusão...');
      console.log('Iniciando geração da imagem');
      const imageUrl = await generatePokemonImage(description, pokemon1, pokemon2);
      console.log('Imagem recebida:', imageUrl);
      
      if (!imageUrl || imageUrl.trim() === '') {
        console.error('URL da imagem vazia');
        alert('Não foi possível gerar a imagem. Tente novamente.');
        setLoading(false);
        return;
      }
      
      // Etapa 3: navegar para a tela de resultado com os dados gerados
      console.log('Navegando para resultado');
      setLoading(false);
      
      router.push({
        pathname: '/result',
        params: {
          pokemon1: pokemon1.trim(),
          pokemon2: pokemon2.trim(),
          description: description,
          imageUrl: imageUrl
        }
      });
      
    } catch (error) {
      // Tratamento de erro genérico
      console.error('Erro detalhado:', error);
      setLoading(false);
      alert(`Erro ao gerar a fusão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  // Seleciona Pokémon da lista de sugestões (1º input)
  const selectPokemon1 = (name: string) => {
    setPokemon1(name);
    setShowSuggestions1(false);
  };

  // Seleciona Pokémon da lista de sugestões (2º input)
  const selectPokemon2 = (name: string) => {
    setPokemon2(name);
    setShowSuggestions2(false);
  };

  // Renderização da interface principal
  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={{ padding: 20 }}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>PokéFusion</Text>
        <Text style={styles.subtitle}>Crie fusões incríveis de Pokémon</Text>
        
        {/* Input 1 com autocomplete */}
        <View style={{ position: 'relative', zIndex: 2, marginTop: 20 }}>
          <TextInput
            value={pokemon1}
            onChangeText={(text) => {
              setPokemon1(text);
              setShowSuggestions1(text.length >= 2);
            }}
            onFocus={() => setShowSuggestions1(pokemon1.length >= 2)}
            onBlur={() => setTimeout(() => setShowSuggestions1(false), 200)} // Delay para permitir clique nas sugestões
            style={styles.input}
            placeholder="Digite o primeiro Pokémon..."
            editable={!isLoading}
            placeholderTextColor="#666"
            autoCapitalize="words"
          />
          
          {/* Lista de sugestões do 1º Pokémon */}
          {showSuggestions1 && (
            <View style={{
              backgroundColor: '#2a2a2a',
              borderRadius: 8,
              marginTop: 5,
              borderWidth: 1,
              borderColor: '#444',
              maxHeight: 200,
              overflow: 'hidden',
            }}>
              {loadingSuggestions1 ? (
                // Exibe indicador de carregamento enquanto busca
                <View style={{ padding: 12, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color="#CC0000" />
                  <Text style={{ color: '#999', fontSize: 14, marginTop: 5 }}>
                    Buscando...
                  </Text>
                </View>
              ) : suggestions1.length > 0 ? (
                // Lista de resultados encontrados
                <ScrollView nestedScrollEnabled={true}>
                  {suggestions1.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={{
                        padding: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: '#333',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                      }}
                      onPress={() => selectPokemon1(item)}
                    >
                      {/* Sprite do Pokémon */}
                      <Image
                        source={{ 
                          uri: `https://img.pokemondb.net/sprites/home/normal/${item.toLowerCase()}.png` 
                        }}
                        style={{ 
                          width: 40, 
                          height: 40,
                          backgroundColor: '#f0f0f0',
                          borderRadius: 20,
                        }}
                        resizeMode="contain"
                      />
                      <Text style={{ color: '#FFF', fontSize: 16 }}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                // Caso nenhuma sugestão seja encontrada
                <View style={{ padding: 12, alignItems: 'center' }}>
                  <Text style={{ color: '#999', fontSize: 14 }}>
                    Nenhum Pokémon encontrado
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
        
        {/* Input 2 com autocomplete (mesma estrutura do primeiro) */}
        <View style={{ position: 'relative', zIndex: 1, marginTop: 15 }}>
          <TextInput
            value={pokemon2}
            onChangeText={(text) => {
              setPokemon2(text);
              setShowSuggestions2(text.length >= 2);
            }}
            onFocus={() => setShowSuggestions2(pokemon2.length >= 2)}
            onBlur={() => setTimeout(() => setShowSuggestions2(false), 200)}
            style={styles.input}
            placeholder="Digite o segundo Pokémon..."
            editable={!isLoading}
            placeholderTextColor="#666"
            autoCapitalize="words"
          />
          
          {/* Lista de sugestões do 2º Pokémon */}
          {showSuggestions2 && (
            <View style={{
              backgroundColor: '#2a2a2a',
              borderRadius: 8,
              marginTop: 5,
              borderWidth: 1,
              borderColor: '#444',
              maxHeight: 200,
              overflow: 'hidden',
            }}>
              {loadingSuggestions2 ? (
                <View style={{ padding: 12, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color="#CC0000" />
                  <Text style={{ color: '#999', fontSize: 14, marginTop: 5 }}>
                    Buscando...
                  </Text>
                </View>
              ) : suggestions2.length > 0 ? (
                <ScrollView nestedScrollEnabled={true}>
                  {suggestions2.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={{
                        padding: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: '#333',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                      }}
                      onPress={() => selectPokemon2(item)}
                    >
                      <Image
                        source={{ 
                          uri: `https://img.pokemondb.net/sprites/home/normal/${item.toLowerCase()}.png` 
                        }}
                        style={{ 
                          width: 40, 
                          height: 40,
                          backgroundColor: '#f0f0f0',
                          borderRadius: 20,
                        }}
                        resizeMode="contain"
                      />
                      <Text style={{ color: '#FFF', fontSize: 16 }}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <View style={{ padding: 12, alignItems: 'center' }}>
                  <Text style={{ color: '#999', fontSize: 14 }}>
                    Nenhum Pokémon encontrado
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
        
        {/* Botão principal de geração */}
        <TouchableOpacity 
          style={[
            styles.button, 
            isLoading && { opacity: 0.6 }, 
            { marginTop: 20 }
          ]} 
          onPress={handlePress}
          disabled={isLoading}
        >
          {isLoading ? (
            // Exibe indicador de carregamento durante o processo
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <ActivityIndicator color="#FFF" size="small" />
              <Text style={styles.button_text}>{loadingMessage}</Text>
            </View>
          ) : (
            <Text style={styles.button_text}>Gerar Fusão Épica!</Text>
          )}
        </TouchableOpacity>
        
        {/* Mensagem auxiliar durante o carregamento */}
        {isLoading && (
          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <Text style={{ color: '#999', fontSize: 14, textAlign: 'center' }}>
              Isso pode levar alguns segundos...
            </Text>
          </View>
        )}
        
        {/* Dica para o usuário */}
        <Text style={{ color: 'rgba(15, 15, 104, 1)', fontSize: 12, textAlign: 'center', marginTop: 15 }}>
          Digite pelo menos 2 caracteres para buscar
        </Text>
      </View>
    </ScrollView>
  );
}

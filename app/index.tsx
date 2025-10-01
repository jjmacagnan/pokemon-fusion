import { generatePokemonImage, generatorPokemonFusion } from "@/services/ia/generator";
import { pokemonService } from "@/services/pokemon/api";
import { styles } from "@/styles";
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function Index() {
  const router = useRouter();
  const [pokemon1, setPokemon1] = useState('');
  const [pokemon2, setPokemon2] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showSuggestions1, setShowSuggestions1] = useState(false);
  const [showSuggestions2, setShowSuggestions2] = useState(false);
  const [pokemonList, setPokemonList] = useState<string[]>([]);
  const [loadingPokemons, setLoadingPokemons] = useState(true);

  // Busca lista de Pokémon ao montar o componente
  useEffect(() => {
    const loadPokemonList = async () => {
      const list = await pokemonService.fetchAllPokemon();
      setPokemonList(list);
      setLoadingPokemons(false);
    };

    loadPokemonList();
  }, []);

  // Filtra sugestões para o primeiro Pokémon
  const suggestions1 = useMemo(() => {
    return pokemonService.filterPokemon(pokemon1, pokemonList, 6);
  }, [pokemon1, pokemonList]);

  // Filtra sugestões para o segundo Pokémon
  const suggestions2 = useMemo(() => {
    return pokemonService.filterPokemon(pokemon2, pokemonList, 6);
  }, [pokemon2, pokemonList]);

  const handlePress = async () => {
    if (pokemon1.length < 2 || pokemon2.length < 2) {
      alert("Digite o nome de dois Pokémon válidos!");
      return;
    }
    
    setLoading(true);
    setLoadingMessage('Gerando descrição da fusão...');
    setShowSuggestions1(false);
    setShowSuggestions2(false);
    
    try {
      console.log('Iniciando geração da fusão:', pokemon1, pokemon2);
      const description = await generatorPokemonFusion(pokemon1, pokemon2);
      console.log('Descrição recebida:', description);
      
      if (!description || description.trim() === '') {
        console.error('Descrição vazia recebida');
        alert('Não foi possível gerar a descrição da fusão. Tente novamente.');
        setLoading(false);
        return;
      }
      
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
      console.error('Erro detalhado:', error);
      setLoading(false);
      alert(`Erro ao gerar a fusão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const selectPokemon1 = (name: string) => {
    setPokemon1(name);
    setShowSuggestions1(false);
  };

  const selectPokemon2 = (name: string) => {
    setPokemon2(name);
    setShowSuggestions2(false);
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={{ padding: 20 }}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>PokéFusion</Text>
        <Text style={styles.subtitle}>Crie fusões incríveis de Pokémon</Text>
        
        {loadingPokemons && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 10 }}>
            <ActivityIndicator size="small" color="#CC0000" />
            <Text style={{ color: '#999', fontSize: 14 }}>
              Carregando lista de Pokémon...
            </Text>
          </View>
        )}
        
        {/* Input 1 com autocomplete */}
        <View style={{ position: 'relative', zIndex: 2 }}>
          <TextInput
            value={pokemon1}
            onChangeText={(text) => {
              setPokemon1(text);
              setShowSuggestions1(text.length >= 2);
            }}
            onFocus={() => setShowSuggestions1(pokemon1.length >= 2)}
            onBlur={() => setTimeout(() => setShowSuggestions1(false), 200)}
            style={styles.input}
            placeholder="Digite o primeiro Pokémon..."
            editable={!isLoading && !loadingPokemons}
            placeholderTextColor="#666"
            autoCapitalize="words"
          />
          
          {showSuggestions1 && suggestions1.length > 0 && (
            <View style={{
              backgroundColor: '#2a2a2a',
              borderRadius: 8,
              marginTop: 5,
              borderWidth: 1,
              borderColor: '#444',
              maxHeight: 200,
              overflow: 'hidden',
            }}>
              <ScrollView nestedScrollEnabled={true}>
                {suggestions1.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={{
                      padding: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: '#333',
                    }}
                    onPress={() => selectPokemon1(item)}
                  >
                    <Text style={{ color: '#FFF', fontSize: 16 }}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        
        {/* Input 2 com autocomplete */}
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
            editable={!isLoading && !loadingPokemons}
            placeholderTextColor="#666"
            autoCapitalize="words"
          />
          
          {showSuggestions2 && suggestions2.length > 0 && (
            <View style={{
              backgroundColor: '#2a2a2a',
              borderRadius: 8,
              marginTop: 5,
              borderWidth: 1,
              borderColor: '#444',
              maxHeight: 200,
              overflow: 'hidden',
            }}>
              <ScrollView nestedScrollEnabled={true}>
                {suggestions2.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={{
                      padding: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: '#333',
                    }}
                    onPress={() => selectPokemon2(item)}
                  >
                    <Text style={{ color: '#FFF', fontSize: 16 }}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        
        <TouchableOpacity 
          style={[
            styles.button, 
            (isLoading || loadingPokemons) && { opacity: 0.6 }, 
            { marginTop: 20 }
          ]} 
          onPress={handlePress}
          disabled={isLoading || loadingPokemons}
        >
          {isLoading ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <ActivityIndicator color="#FFF" size="small" />
              <Text style={styles.button_text}>{loadingMessage}</Text>
            </View>
          ) : (
            <Text style={styles.button_text}>Gerar Fusão Épica!</Text>
          )}
        </TouchableOpacity>
        
        {isLoading && (
          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <Text style={{ color: '#999', fontSize: 14, textAlign: 'center' }}>
              Isso pode levar alguns segundos...
            </Text>
          </View>
        )}
        
        {pokemonList.length > 0 && (
          <Text style={{ color: '#666', fontSize: 12, textAlign: 'center', marginTop: 15 }}>
            {pokemonList.length} Pokémon disponíveis
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
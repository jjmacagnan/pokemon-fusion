import { styles } from "@/styles";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React from "react";
import {
    Image,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function Result() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const { pokemon1, pokemon2, description, imageUrl } = params;

  return (
    <ScrollView style={styles.container}>
      <View style={{ padding: 20 }}>
        <StatusBar barStyle="light-content" />
        
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 500 }}
        >
          <Text style={styles.title}>Fusão Completa!</Text>
          
          {/* Pokémon individuais */}
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginTop: 20,
            marginBottom: 10,
            gap: 15
          }}>
            {/* Pokémon 1 */}
            <View style={{ alignItems: 'center' }}>
              <Image
                source={{ 
                  uri: `https://img.pokemondb.net/sprites/home/normal/${pokemon1?.toString().toLowerCase()}.png` 
                }}
                style={{ 
                  width: 80, 
                  height: 80,
                  backgroundColor: '#f0f0f0',
                  borderRadius: 40,
                  padding: 5
                }}
                resizeMode="contain"
              />
              <Text style={{ 
                color: '#000', 
                fontSize: 14, 
                marginTop: 8,
                fontWeight: '600'
              }}>
                {pokemon1}
              </Text>
            </View>

            {/* Ícone de fusão */}
            <Text style={{ 
              fontSize: 28, 
              color: '#CC0000',
              fontWeight: 'bold'
            }}>
              +
            </Text>

            {/* Pokémon 2 */}
            <View style={{ alignItems: 'center' }}>
              <Image
                source={{ 
                  uri: `https://img.pokemondb.net/sprites/home/normal/${pokemon2?.toString().toLowerCase()}.png` 
                }}
                style={{ 
                  width: 80, 
                  height: 80,
                  backgroundColor: '#f0f0f0',
                  borderRadius: 40,
                  padding: 5
                }}
                resizeMode="contain"
              />
              <Text style={{ 
                color: '#000', 
                fontSize: 14, 
                marginTop: 8,
                fontWeight: '600'
              }}>
                {pokemon2}
              </Text>
            </View>
          </View>

          {/* Seta para baixo indicando resultado */}
          <Text style={{ 
            textAlign: 'center', 
            fontSize: 32, 
            color: '#CC0000',
            marginVertical: 10
          }}>
            ↓
          </Text>
        </MotiView>
        
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 200 }}
          style={styles.card}
        >
          {/* Imagem da fusão */}
          {imageUrl && (
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: imageUrl as string }} 
                style={styles.pokemonImage}
                resizeMode="contain"
              />
            </View>
          )}
          
          {/* Descrição */}
          <Text style={styles.card_title}>Descrição da Fusão:</Text>
          <Text style={styles.card_text}>{description}</Text>
        </MotiView>
        
        {/* Botões de ação */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 400 }}
          style={{ marginTop: 20, gap: 10 }}
        >
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.back()}
          >
            <Text style={styles.button_text}>Criar Nova Fusão</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#555' }]}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.button_text}>Voltar ao Início</Text>
          </TouchableOpacity>
        </MotiView>
      </View>
    </ScrollView>
  );
}
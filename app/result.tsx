import { styles } from "@/styles";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { useState } from "react";
import {
  ActivityIndicator,
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

  // Estado para controlar o carregamento da imagem de fusão
  const [loadingImage, setLoadingImage] = useState(true);

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

          {/* Pokémon base */}
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginTop: 20,
            marginBottom: 10,
            gap: 15
          }}>
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
              <Text style={{ color: '#000', fontSize: 14, marginTop: 8, fontWeight: '600' }}>
                {pokemon1}
              </Text>
            </View>

            <Text style={{ fontSize: 28, color: '#CC0000', fontWeight: 'bold' }}>+</Text>

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
              <Text style={{ color: '#000', fontSize: 14, marginTop: 8, fontWeight: '600' }}>
                {pokemon2}
              </Text>
            </View>
          </View>

          <Text style={{ textAlign: 'center', fontSize: 32, color: '#CC0000', marginVertical: 10 }}>
            ↓
          </Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 200 }}
          style={styles.card}
        >
          {imageUrl && (
            <View style={styles.imageContainer}>
              {/* Enquanto a imagem carrega */}
              {loadingImage && (
                <ActivityIndicator size="large" color="#CC0000" style={{ position: 'absolute', alignSelf: 'center', top: '40%' }} />
              )}

              <Image
                source={{ uri: imageUrl as string }}
                style={[
                  styles.pokemonImage,
                  loadingImage && { opacity: 0 } // esconde a imagem até carregar
                ]}
                resizeMode="contain"
                onLoadStart={() => setLoadingImage(true)}
                onLoadEnd={() => setLoadingImage(false)}
                onError={() => setLoadingImage(false)}
              />
            </View>
          )}

          <Text style={styles.card_title}>Descrição da Fusão:</Text>
          <Text style={styles.card_text}>{description}</Text>
        </MotiView>

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
        </MotiView>
      </View>
    </ScrollView>
  );
}

import { StyleSheet } from "react-native";

// Cores Temáticas Pokémon
const POKEBALL_RED = '#CC0000';    // Vermelho da Pokébola
const POKEBALL_BLUE = '#2A75BB';   // Azul Marinho
const POKEMON_YELLOW = '#FFCB05';  // Amarelo de Eletricidade/Destaque
const TEXT_COLOR = '#333333';      // Texto
const LIGHT_GREY = '#F0F0F0';      // Fundo leve
const WHITE = '#FFFFFF';           // Branco

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_GREY // Fundo claro para contraste
  },
  contentContainer: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: POKEBALL_RED, // Título em vermelho vibrante
    textAlign: 'center',
    marginTop: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)', // Sombra para destaque
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    marginVertical: 16,
    fontSize: 16,
    color: TEXT_COLOR,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    paddingHorizontal: 16,
    height: 55, // Um pouco maior
    backgroundColor: WHITE,
    borderRadius: 10,
    borderColor: POKEBALL_BLUE, // Borda azul
    borderWidth: 2,
    marginBottom: 12,
    fontSize: 16,
    color: TEXT_COLOR,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  button: {
    backgroundColor: POKEBALL_BLUE, // Botão azul
    height: 55,
    width: '100%',
    marginVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: POKEBALL_BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  button_text: {
    color: WHITE,
    fontWeight: 'bold',
    fontSize: 18,
    textTransform: 'uppercase', // Deixar mais épico
  },
  card: {
    backgroundColor: WHITE,
    borderWidth: 3,
    padding: 20,
    borderColor: POKEMON_YELLOW, // Borda amarela de destaque
    width: '100%',
    marginTop: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  pokemonImage: {
    width: 280,
    height: 280,
    borderRadius: 16,
    backgroundColor: LIGHT_GREY,
    borderWidth: 3,
    borderColor: POKEBALL_RED, // Borda vermelha para a imagem
    shadowColor: POKEBALL_RED,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: POKEBALL_RED,
    fontSize: 16,
    fontWeight: '600',
  },
  card_title: {
    fontWeight: 'bold',
    fontSize: 20, // Maior
    color: POKEBALL_RED,
    marginBottom: 8,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: POKEBALL_RED,
    paddingBottom: 5,
  },
  card_text: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 24,
    color: TEXT_COLOR,
    textAlign: 'justify',
  },
  errorText: {
    color: POKEBALL_RED,
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 10,
  }
});
import axios from 'axios';

const POKEMON_API = 'https://pokeapi.co/api/v2';

class PokemonService {
  private pokemonList: string[] = [];
  private isLoaded: boolean = false;

  /**
   * Load and cache the full Pokémon list
   */
  async loadPokemonList(): Promise<void> {
    if (this.isLoaded) return;
    
    try {
      console.log('Loading Pokemon list...');
      const response = await axios.get(`${POKEMON_API}/pokemon?limit=1000`, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      this.pokemonList = response.data.results.map((p: any) => 
        p.name.charAt(0).toUpperCase() + p.name.slice(1)
      );
      this.isLoaded = true;
      console.log(`Loaded ${this.pokemonList.length} Pokemon`);
    } catch (error) {
      console.error('Erro ao carregar lista de Pokémon:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response:', error.response?.data);
        console.error('Status:', error.response?.status);
        console.error('Message:', error.message);
      }
      throw error;
    }
  }

  /**
   * Search for Pokemon matching the query
   */
  async searchPokemon(query: string, limit: number = 6): Promise<string[]> {
    try {
      // Load list if not already loaded
      await this.loadPokemonList();
      
      if (!query || query.length < 2) return [];
      
      const normalizedQuery = query.toLowerCase();
      
      return this.pokemonList
        .filter(name => name.toLowerCase().includes(normalizedQuery))
        .sort((a, b) => {
          const aStarts = a.toLowerCase().startsWith(normalizedQuery);
          const bStarts = b.toLowerCase().startsWith(normalizedQuery);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return a.localeCompare(b);
        })
        .slice(0, limit);
    } catch (error) {
      console.error('Erro ao buscar Pokémon:', error);
      return [];
    }
  }

  /**
   * Get details for a specific Pokemon
   */
  async getPokemonDetails(nameOrId: string | number) {
    try {
      const response = await axios.get(`${POKEMON_API}/pokemon/${nameOrId}`, {
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes do Pokémon:', error);
      return null;
    }
  }
}

export const pokemonService = new PokemonService();
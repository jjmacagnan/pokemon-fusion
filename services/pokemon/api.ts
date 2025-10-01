interface Pokemon {
  name: string;
  url: string;
}

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2';
  private pokemonCache: string[] | null = null;

  /**
   * Busca a lista completa de Pokémon da API
   * @param limit Número máximo de Pokémon a buscar (padrão: 1000)
   * @returns Array com os nomes dos Pokémon formatados
   */
  async fetchAllPokemon(limit: number = 1000): Promise<string[]> {
    // Retorna do cache se já foi carregado
    if (this.pokemonCache) {
      return this.pokemonCache;
    }

    try {
      const response = await fetch(`${this.baseUrl}/pokemon?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data: PokemonListResponse = await response.json();
      
      // Formata os nomes (primeira letra maiúscula)
      const formattedNames = data.results.map((pokemon) => 
        this.formatPokemonName(pokemon.name)
      );

      // Armazena no cache
      this.pokemonCache = formattedNames;
      
      console.log(`✅ ${formattedNames.length} Pokémon carregados da PokéAPI`);
      return formattedNames;

    } catch (error) {
      console.error('❌ Erro ao buscar Pokémon da API:', error);
      
      // Retorna lista fallback em caso de erro
      return this.getFallbackList();
    }
  }

  /**
   * Busca detalhes de um Pokémon específico
   * @param nameOrId Nome ou ID do Pokémon
   */
  async getPokemonDetails(nameOrId: string | number) {
    try {
      const response = await fetch(`${this.baseUrl}/pokemon/${nameOrId.toString().toLowerCase()}`);
      
      if (!response.ok) {
        throw new Error(`Pokémon não encontrado: ${nameOrId}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar detalhes do Pokémon:', error);
      return null;
    }
  }

  /**
   * Filtra Pokémon por termo de busca
   * @param searchTerm Termo para buscar
   * @param pokemonList Lista de Pokémon
   * @param maxResults Número máximo de resultados
   */
  filterPokemon(
    searchTerm: string, 
    pokemonList: string[], 
    maxResults: number = 6
  ): string[] {
    if (searchTerm.length < 2) return [];

    const term = searchTerm.toLowerCase();
    
    return pokemonList
      .filter(pokemon => pokemon.toLowerCase().includes(term))
      .slice(0, maxResults);
  }

  /**
   * Formata o nome do Pokémon (primeira letra maiúscula)
   */
  private formatPokemonName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  /**
   * Lista fallback caso a API falhe
   */
  private getFallbackList(): string[] {
    return [
      'Pikachu', 'Charizard', 'Blastoise', 'Venusaur', 'Mewtwo',
      'Lucario', 'Garchomp', 'Dragonite', 'Gengar', 'Alakazam',
      'Gyarados', 'Snorlax', 'Eevee', 'Umbreon', 'Espeon',
      'Rayquaza', 'Kyogre', 'Groudon', 'Dialga', 'Palkia',
      'Greninja', 'Sylveon', 'Zoroark', 'Absol', 'Typhlosion'
    ];
  }

  /**
   * Limpa o cache (útil para forçar atualização)
   */
  clearCache(): void {
    this.pokemonCache = null;
  }
}

// Exporta instância única (Singleton)
export const pokemonService = new PokemonService();

// Exporta também o tipo para uso externo
export type { Pokemon, PokemonListResponse };

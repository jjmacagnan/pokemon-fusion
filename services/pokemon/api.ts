// @/services/pokemon/api.ts

const POKEMON_API = 'https://pokeapi.co/api/v2';

class PokemonService {
  /**
   * Busca Pokémon conforme o usuário digita
   * @param query - Texto digitado pelo usuário
   * @param limit - Número máximo de resultados
   */
  async searchPokemon(query: string, limit: number = 6): Promise<string[]> {
    try {
      const normalizedQuery = query.toLowerCase().trim();
      
      // Busca na API com filtro de limite maior para depois filtrar localmente
      const response = await fetch(`${POKEMON_API}/pokemon?limit=1000`);
      const data = await response.json();
      
      // Filtra os resultados que começam com a query ou contêm a query
      const filtered = data.results
        .map((p: any) => p.name)
        .filter((name: string) => name.includes(normalizedQuery))
        .sort((a: string, b: string) => {
          // Prioriza nomes que começam com a query
          const aStarts = a.startsWith(normalizedQuery);
          const bStarts = b.startsWith(normalizedQuery);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return a.localeCompare(b);
        })
        .slice(0, limit);
      
      // Capitaliza os nomes
      return filtered.map((name: string) => 
        name.charAt(0).toUpperCase() + name.slice(1)
      );
    } catch (error) {
      console.error('Erro ao buscar Pokémon:', error);
      return [];
    }
  }

  /**
   * Busca lista completa de Pokémon (mantido para compatibilidade)
   */
  async fetchAllPokemon(): Promise<string[]> {
    try {
      const response = await fetch(`${POKEMON_API}/pokemon?limit=1000`);
      const data = await response.json();
      return data.results.map((p: any) => 
        p.name.charAt(0).toUpperCase() + p.name.slice(1)
      );
    } catch (error) {
      console.error('Erro ao buscar lista de Pokémon:', error);
      return [];
    }
  }

  /**
   * Filtra Pokémon de uma lista já carregada (mantido para compatibilidade)
   */
  filterPokemon(query: string, pokemonList: string[], limit: number = 6): string[] {
    if (!query || query.length < 2) return [];
    
    const normalizedQuery = query.toLowerCase();
    
    return pokemonList
      .filter(name => name.toLowerCase().includes(normalizedQuery))
      .sort((a, b) => {
        const aStarts = a.toLowerCase().startsWith(normalizedQuery);
        const bStarts = b.toLowerCase().startsWith(normalizedQuery);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.localeCompare(b);
      })
      .slice(0, limit);
  }

  /**
   * Busca detalhes de um Pokémon específico
   */
  async getPokemonDetails(nameOrId: string | number) {
    try {
      const response = await fetch(`${POKEMON_API}/pokemon/${nameOrId}`);
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar detalhes do Pokémon:', error);
      return null;
    }
  }
}

export const pokemonService = new PokemonService();
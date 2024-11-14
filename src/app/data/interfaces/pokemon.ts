// Интерфейс для типа покемона
interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

// Интерфейс для способности покемона
interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: {
    name: string;
    url: string;
  };
}

// Интерфейс для статистики покемона (HP, Attack, и т. д.)
interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

// Интерфейс для изображения (спрайта) покемона
interface PokemonSprites {
  front_default: string;
  back_default?: string;
  front_shiny?: string;
  back_shiny?: string;
  other?: {
    [key: string]: {
      front_default: string;
    };
  };
}

// Основной интерфейс для данных покемона
export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonType[];       // Список типов покемона
  abilities: PokemonAbility[]; // Список способностей покемона
  stats: PokemonStat[];        // Статистика (HP, Attack и т. д.)
  sprites: PokemonSprites;     // Спрайты (изображения) покемона
}
export interface FlavorTextEntry {
  language: {
    name: string;
  };
  flavor_text: string;
}

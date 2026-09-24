// src/hooks/useItems.ts
// Catálogo con TanStack Query + CACHÉ OFFLINE en AsyncStorage (patrón
// offline-first básico):
//
// 1. Si hay red → trae de la API, mapea al dominio Editorial y guarda una
//    copia en AsyncStorage.
// 2. Si la red falla → responde desde la caché del dispositivo y marca
//    source: 'cache' para que la UI muestre el banner "sin conexión".
//
// La API fake (JSONPlaceholder) no persiste cambios, así que las mutaciones
// actualizan la caché de TanStack con setQueryData (igual que en semana 06).

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { apiClient } from '../services/api';
import type { CreateItemPayload, Item } from '../types';

export const ITEMS_QUERY_KEY = ['catalog'] as const;

const CACHE_KEY = '@editorial-luna/catalogo-v1';

// ─────────────────────────────────────────
// Tipo que devuelve la query: datos + origen
// ─────────────────────────────────────────

export interface CatalogPage {
  items: Item[];
  source: 'network' | 'cache';
}

// ─────────────────────────────────────────
// Catálogo semilla en español (Editorial Luna)
// ─────────────────────────────────────────

interface ApiPost {
  id: number;
  title: string;
  body: string;
  userId: number;
}

type SeedBook = Omit<Item, 'id'>;

const SPANISH_CATALOG: SeedBook[] = [
  {
    name: 'Cien años de soledad',
    description:
      'La saga de los Buendía en Macondo: realismo mágico al servicio de la memoria latinoamericana.',
    author: 'Gabriel García Márquez',
    year: 1967,
    genre: 'Realismo mágico',
    pages: 417,
    price: 24.9,
  },
  {
    name: 'Rayuela',
    description:
      'Novela que se puede leer en varios órdenes; un tablero donde Horacio Oliveira busca su cielo.',
    author: 'Julio Cortázar',
    year: 1963,
    genre: 'Vanguardia',
    pages: 640,
    price: 29.5,
  },
  {
    name: 'Pedro Páramo',
    description:
      'Juan Preciado llega a Comala buscando a su padre y encuentra un pueblo habitado por murmullos.',
    author: 'Juan Rulfo',
    year: 1955,
    genre: 'Novela',
    pages: 128,
    price: 15.75,
  },
  {
    name: 'Ficciones',
    description:
      'Cuentos de laberintos, bibliotecas infinitas y espejos: la obra cumbre de Borges.',
    author: 'Jorge Luis Borges',
    year: 1944,
    genre: 'Cuento',
    pages: 174,
    price: 18.0,
  },
  {
    name: 'La casa de los espíritus',
    description:
      'Cuatro generaciones de la familia Trueba entre la política, el amor y lo sobrenatural.',
    author: 'Isabel Allende',
    year: 1982,
    genre: 'Novela',
    pages: 448,
    price: 22.4,
  },
  {
    name: 'El túnel',
    description:
      'La confesión obsesiva del pintor Juan Pablo Castel, contada desde la celda de un penal.',
    author: 'Ernesto Sábato',
    year: 1948,
    genre: 'Psicológica',
    pages: 160,
    price: 14.99,
  },
  {
    name: 'Los ríos profundos',
    description:
      'Ernesto, interno en un colegio de Cusco, se debate entre el mundo indígena y el occidental.',
    author: 'José María Arguedas',
    year: 1958,
    genre: 'Neoindigenista',
    pages: 272,
    price: 19.9,
  },
  {
    name: 'Como agua para chocolate',
    description:
      'Tita cocina sus emociones en recetas que afectan a quien las prueba; amor y cocina en el siglo XIX.',
    author: 'Laura Esquivel',
    year: 1989,
    genre: 'Romance',
    pages: 256,
    price: 17.5,
  },
  {
    name: 'La ciudad y los perros',
    description:
      'La violencia y la jerarquía en un colegio militar de Lima durante la adolescencia de sus alumnos.',
    author: 'Mario Vargas Llosa',
    year: 1963,
    genre: 'Novela',
    pages: 512,
    price: 26.0,
  },
  {
    name: 'El amor en los tiempos del cólera',
    description:
      'Florentino Ariza espera cincuenta y un años, nueve meses y cuatro días por Fermina Daza.',
    author: 'Gabriel García Márquez',
    year: 1985,
    genre: 'Romance',
    pages: 496,
    price: 25.3,
  },
  {
    name: 'Aura',
    description:
      'Un joven historiador acepta terminar las memorias de un general y descubre a Aura en una casa vieja.',
    author: 'Carlos Fuentes',
    year: 1962,
    genre: 'Fantástica',
    pages: 96,
    price: 12.99,
  },
  {
    name: 'Delirio',
    description:
      'Aguilar busca entender la locura de su esposa Lucía en la Bogotá de fin de siglo.',
    author: 'Laura Restrepo',
    year: 2004,
    genre: 'Contemporánea',
    pages: 228,
    price: 16.9,
  },
  {
    name: 'La vorágine',
    description:
      'Arturo Cova atraviesa la selva colombiana tras el rastro de su amada, entre caucheros y rebelión.',
    author: 'José Eustasio Rivera',
    year: 1924,
    genre: 'Criollista',
    pages: 392,
    price: 20.0,
  },
  {
    name: 'El obsceno pájaro de la noche',
    description:
      'La novela laberíntica de Mudito, el sirviente que escribe en la "Casa de Ejercicios Espirituales".',
    author: 'José Donoso',
    year: 1970,
    genre: 'Vanguardia',
    pages: 368,
    price: 23.0,
  },
  {
    name: 'Desencuentros',
    description:
      'Relatos breves donde la rutina y el azar desenmascaran la soledad urbana.',
    author: 'Mario Benedetti',
    year: 1977,
    genre: 'Cuento',
    pages: 152,
    price: 13.5,
  },
];

// API → dominio: el id lo pone el servidor, el contenido lo pone nuestro
// catálogo en español (el post.id solo decide qué libro semilla le toca).
function apiToItem(post: ApiPost): Item {
  const seed = SPANISH_CATALOG[(post.id - 1) % SPANISH_CATALOG.length];
  return { id: post.id, ...seed };
}

// dominio → API (lo que viaja en el POST)
function itemToApiPayload(item: Omit<Item, 'id'>): ApiPost {
  return { id: 0, title: item.name, body: item.description ?? '', userId: 1 };
}

// ─────────────────────────────────────────
// READ — catálogo con respaldo offline
// ─────────────────────────────────────────

export function useItems() {
  return useQuery<CatalogPage>({
    queryKey: ITEMS_QUERY_KEY,
    queryFn: async (): Promise<CatalogPage> => {
      try {
        // 1) Intento de red
        const { data } = await apiClient.get<ApiPost[]>('/posts?_limit=15');
        const items = data.map(apiToItem);
        // 2) Guardo la copia local para cuando no haya internet
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(items));
        return { items, source: 'network' };
      } catch {
        // 3) Sin red → sirvo la última copia guardada en el dispositivo
        const raw = await AsyncStorage.getItem(CACHE_KEY);
        if (raw) {
          return { items: JSON.parse(raw) as Item[], source: 'cache' };
        }
        throw new Error('Sin conexión y sin caché previa');
      }
    },
    staleTime: 60_000,
    retry: 1,
  });
}

// ─────────────────────────────────────────
// CREATE — actualiza la caché de la lista
// ─────────────────────────────────────────

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation<Item, Error, CreateItemPayload>({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post<ApiPost>('/posts', itemToApiPayload(payload));
      return { ...payload, id: data.id };
    },
    onSuccess: (created) => {
      queryClient.setQueryData<CatalogPage>(ITEMS_QUERY_KEY, (old) =>
        old ? { ...old, items: [created, ...old.items] } : old,
      );
    },
  });
}

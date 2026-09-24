// src/hooks/useItems.ts
// CRUD de libros con TanStack Query + Axios.
//
// API usada: JSONPlaceholder (/posts). Dos cosas importantes de esta API fake:
//
// 1) NO persiste: acepta POST/PUT y responde con "eco" del payload, pero
//    los datos no quedan guardados en el servidor. Por eso, en lugar de solo
//    invalidar la lista (el refetch traería los datos viejos), actualizamos
//    la caché manualmente con setQueryData y la UI refleja el cambio al
//    instante durante toda la sesión.
//
// 2) Sus posts de ejemplo vienen escritos en LATÍN (es data de relleno).
//    Como nuestro dominio es Editorial, mapeamos cada post a una entrada
//    fija del catálogo en español de "Editorial Luna" usando su id como
//    posición. El id sigue siendo el de la API; el contenido, el nuestro.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '../services/api';
import type { CreateItemPayload, Item, UpdateItemPayload } from '../types';

export const ITEMS_QUERY_KEY = ['items'] as const;

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
      'Novela que se puede leer en varios órdenes; un tablero de ajedrez donde Horacio Oliveira busca su cielo.',
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
      'Tita cocina sus emociones en recetas que afectan a quien las prueba; amor y cocina en siglo XIX.',
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
    name: 'Desencuentros',
    description:
      'Relatos breves donde la rutina y el azar desenmascaran la soledad urbana.',
    author: 'Mario Benedetti',
    year: 1977,
    genre: 'Cuento',
    pages: 152,
    price: 13.5,
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
];

// ─────────────────────────────────────────
// Mapeo entre la API (/posts) y nuestro dominio (libros)
// ─────────────────────────────────────────

// API → dominio: el id lo pone el servidor, el contenido lo pone nuestro
// catálogo en español (el post.id solo decide qué libro semilla le toca).
function apiToItem(post: ApiPost): Item {
  const seed =
    SPANISH_CATALOG[(post.id - 1) % SPANISH_CATALOG.length] ?? SPANISH_CATALOG[0];
  return { id: post.id, ...seed };
}

// dominio → API (lo que viaja en el POST/PUT)
function itemToApiPayload(item: Omit<Item, 'id'>): ApiPost {
  return {
    id: 0, // lo reasigna el servidor
    title: item.name,
    body: item.description ?? '',
    userId: 1,
  };
}

// ─────────────────────────────────────────
// READ — catálogo de libros
// ─────────────────────────────────────────

export function useItems() {
  return useQuery<Item[]>({
    queryKey: ITEMS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get<ApiPost[]>('/posts?_limit=15');
      return data.map(apiToItem);
    },
  });
}

// ─────────────────────────────────────────
// READ — libro individual (para el formulario Edit)
// ─────────────────────────────────────────

export function useItemById(id: number) {
  const queryClient = useQueryClient();

  return useQuery<Item>({
    queryKey: [...ITEMS_QUERY_KEY, id],
    queryFn: () => apiClient.get<ApiPost>(`/posts/${id}`).then((r) => apiToItem(r.data)),
    // Precarga desde la caché del catálogo mientras llega la respuesta.
    // Así el formulario se rellena al instante y con TODOS los campos
    // editoriales (la API fake solo devuelve title/body).
    initialData: () => {
      const list = queryClient.getQueryData<Item[]>(ITEMS_QUERY_KEY);
      const fromList = list?.find((book) => book.id === id);
      if (fromList) return fromList;
      return queryClient.getQueryData<Item>([...ITEMS_QUERY_KEY, id]);
    },
  });
}

// ─────────────────────────────────────────
// CREATE — formulario de creación
// ─────────────────────────────────────────

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation<Item, Error, CreateItemPayload>({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post<ApiPost>('/posts', itemToApiPayload(payload));
      // La respuesta "eco" trae el id nuevo; el resto viene de nuestro payload
      return { ...payload, id: data.id };
    },
    onSuccess: (created) => {
      // Insertamos el libro en la cabecera de la caché del catálogo
      queryClient.setQueryData<Item[]>(ITEMS_QUERY_KEY, (old = []) => [created, ...old]);
    },
  });
}

// ─────────────────────────────────────────
// UPDATE — formulario de edición
// ─────────────────────────────────────────

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation<Item, Error, UpdateItemPayload>({
    mutationFn: async (payload) => {
      await apiClient.put<ApiPost>(`/posts/${payload.id}`, itemToApiPayload(payload));
      return payload;
    },
    onSuccess: (updated) => {
      // Reemplazamos en la lista y en el detalle (caché)
      queryClient.setQueryData<Item[]>(
        ITEMS_QUERY_KEY,
        (old = []) => {
          const exists = old.some((book) => book.id === updated.id);
          return exists
            ? old.map((book) => (book.id === updated.id ? updated : book))
            : [updated, ...old];
        },
      );
      queryClient.setQueryData<Item>([...ITEMS_QUERY_KEY, updated.id], updated);
    },
  });
}

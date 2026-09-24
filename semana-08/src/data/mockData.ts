// src/data/mockData.ts
// Catálogo Editorial Luna para la app autenticada.

import type { Item } from '../types';

export const BOOKS: Item[] = [
  { id: 1, name: 'Cien años de soledad', description: 'La saga de los Buendía en Macondo.', author: 'Gabriel García Márquez', year: 1967, genre: 'Realismo mágico', pages: 417, price: 24.9 },
  { id: 2, name: 'Rayuela', description: 'Novela que se lee en varios órdenes.', author: 'Julio Cortázar', year: 1963, genre: 'Vanguardia', pages: 640, price: 29.5 },
  { id: 3, name: 'Pedro Páramo', description: 'Comala, un pueblo de murmullos.', author: 'Juan Rulfo', year: 1955, genre: 'Novela', pages: 128, price: 15.75 },
  { id: 4, name: 'Ficciones', description: 'Laberintos y bibliotecas infinitas.', author: 'Jorge Luis Borges', year: 1944, genre: 'Cuento', pages: 174, price: 18.0 },
  { id: 5, name: 'La casa de los espíritus', description: 'Cuatro generaciones de los Trueba.', author: 'Isabel Allende', year: 1982, genre: 'Novela', pages: 448, price: 22.4 },
  { id: 6, name: 'El túnel', description: 'La confesión de Juan Pablo Castel.', author: 'Ernesto Sábato', year: 1948, genre: 'Psicológica', pages: 160, price: 14.99 },
  { id: 7, name: 'Los ríos profundos', description: 'Ernesto entre dos mundos en Cusco.', author: 'José María Arguedas', year: 1958, genre: 'Neoindigenista', pages: 272, price: 19.9 },
  { id: 8, name: 'Como agua para chocolate', description: 'Tita cocina sus emociones.', author: 'Laura Esquivel', year: 1989, genre: 'Romance', pages: 256, price: 17.5 },
  { id: 9, name: 'La ciudad y los perros', description: 'La jerarquía en un colegio militar de Lima.', author: 'Mario Vargas Llosa', year: 1963, genre: 'Novela', pages: 512, price: 26.0 },
  { id: 10, name: 'Delirio', description: 'La locura de Lucía en la Bogotá de fin de siglo.', author: 'Laura Restrepo', year: 2004, genre: 'Contemporánea', pages: 228, price: 16.9 },
];

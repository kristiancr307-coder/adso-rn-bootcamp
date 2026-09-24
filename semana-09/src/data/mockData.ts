// src/data/mockData.ts — Catálogo Editorial Luna con progreso de lectura.

import type { Item } from '../types';

export const BOOKS: Item[] = [
  { id: '1', name: 'Cien años de soledad', description: 'La saga de los Buendía en Macondo: realismo mágico al servicio de la memoria latinoamericana.', author: 'Gabriel García Márquez', year: 1967, genre: 'Realismo mágico', pages: 417, price: 24.9, pagesRead: 210 },
  { id: '2', name: 'Rayuela', description: 'Novela que se puede leer en varios órdenes; un tablero donde Horacio Oliveira busca su cielo.', author: 'Julio Cortázar', year: 1963, genre: 'Vanguardia', pages: 640, price: 29.5, pagesRead: 80 },
  { id: '3', name: 'Pedro Páramo', description: 'Juan Preciado llega a Comala buscando a su padre y encuentra un pueblo habitado por murmullos.', author: 'Juan Rulfo', year: 1955, genre: 'Novela', pages: 128, price: 15.75, pagesRead: 128 },
  { id: '4', name: 'Ficciones', description: 'Cuentos de laberintos, bibliotecas infinitas y espejos: la obra cumbre de Borges.', author: 'Jorge Luis Borges', year: 1944, genre: 'Cuento', pages: 174, price: 18.0, pagesRead: 40 },
  { id: '5', name: 'La casa de los espíritus', description: 'Cuatro generaciones de la familia Trueba entre la política, el amor y lo sobrenatural.', author: 'Isabel Allende', year: 1982, genre: 'Novela', pages: 448, price: 22.4, pagesRead: 300 },
  { id: '6', name: 'El túnel', description: 'La confesión obsesiva del pintor Juan Pablo Castel, contada desde la celda de un penal.', author: 'Ernesto Sábato', year: 1948, genre: 'Psicológica', pages: 160, price: 14.99, pagesRead: 12 },
  { id: '7', name: 'Los ríos profundos', description: 'Ernesto, interno en un colegio de Cusco, se debate entre el mundo indígena y el occidental.', author: 'José María Arguedas', year: 1958, genre: 'Neoindigenista', pages: 272, price: 19.9, pagesRead: 190 },
  { id: '8', name: 'Como agua para chocolate', description: 'Tita cocina sus emociones en recetas que afectan a quien las prueba.', author: 'Laura Esquivel', year: 1989, genre: 'Romance', pages: 256, price: 17.5, pagesRead: 256 },
  { id: '9', name: 'La ciudad y los perros', description: 'La violencia y la jerarquía en un colegio militar de Lima.', author: 'Mario Vargas Llosa', year: 1963, genre: 'Novela', pages: 512, price: 26.0, pagesRead: 25 },
  { id: '10', name: 'Delirio', description: 'Aguilar busca entender la locura de su esposa Lucía en la Bogotá de fin de siglo.', author: 'Laura Restrepo', year: 2004, genre: 'Contemporánea', pages: 228, price: 16.9, pagesRead: 150 },
];

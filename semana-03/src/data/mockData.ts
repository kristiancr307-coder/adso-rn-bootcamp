import type { Item } from '../types';

export const ITEMS: Item[] = [
  { id: '1', name: 'Cien Años de Soledad', description: 'La historia de la familia Buendía en el pueblo de Macondo.', author: 'Gabriel García Márquez', year: 1967, genre: 'Realismo mágico', pages: 471, price: 45000 },
  { id: '2', name: 'El Amor en los Tiempos del Cólera', description: 'Un romance que desafía el paso del tiempo.', author: 'Gabriel García Márquez', year: 1985, genre: 'Novela romántica', pages: 348, price: 42000 },
  { id: '3', name: 'La Casa de los Espíritus', description: 'Cuatro generaciones marcadas por el destino y la política.', author: 'Isabel Allende', year: 1982, genre: 'Realismo mágico', pages: 433, price: 39000 },
  { id: '4', name: 'Pedro Páramo', description: 'Un viaje a un pueblo habitado por fantasmas.', author: 'Juan Rulfo', year: 1955, genre: 'Novela', pages: 124, price: 35000 },
  { id: '5', name: 'Rayuela', description: 'Una novela que se puede leer en cualquier orden.', author: 'Julio Cortázar', year: 1963, genre: 'Novela experimental', pages: 736, price: 41000 },
  { id: '6', name: 'Ficciones', description: 'Cuentos que desafían la realidad y el tiempo.', author: 'Jorge Luis Borges', year: 1944, genre: 'Cuento', pages: 203, price: 38000 },
  { id: '7', name: 'La Sombra del Viento', description: 'Un misterio entre libros olvidados de Barcelona.', author: 'Carlos Ruiz Zafón', year: 2001, genre: 'Misterio', pages: 565, price: 44000 },
  { id: '8', name: 'Como Agua para Chocolate', description: 'Amor y cocina en tiempos de revolución.', author: 'Laura Esquivel', year: 1989, genre: 'Realismo mágico', pages: 246, price: 37000 },
];

export const FAVORITES: Item[] = [ITEMS[0], ITEMS[2], ITEMS[4]];
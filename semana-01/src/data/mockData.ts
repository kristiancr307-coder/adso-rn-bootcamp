import { Book } from '../types';

export const MOCK_ITEMS: Book[] = [
  {
    id: '1',
    name: 'Cien Años de Soledad',
    subtitle: 'La historia de la familia Buendía',
    imageUri: 'https://picsum.photos/seed/libro1/300/450',
    author: 'Gabriel García Márquez',
    year: 1967,
    genre: 'Realismo mágico',
    price: 45000,
  },
  {
    id: '2',
    name: 'El Amor en los Tiempos del Cólera',
    subtitle: 'Un romance que desafía el tiempo',
    imageUri: 'https://picsum.photos/seed/libro2/300/450',
    author: 'Gabriel García Márquez',
    year: 1985,
    genre: 'Novela romántica',
    price: 42000,
  },
  {
    id: '3',
    name: 'La Casa de los Espíritus',
    subtitle: 'Cuatro generaciones marcadas por el destino',
    imageUri: 'https://picsum.photos/seed/libro3/300/450',
    author: 'Isabel Allende',
    year: 1982,
    genre: 'Realismo mágico',
    price: 39000,
  },
  {
    id: '4',
    name: 'Pedro Páramo',
    subtitle: 'Un viaje a un pueblo habitado por fantasmas',
    imageUri: 'https://picsum.photos/seed/libro4/300/450',
    author: 'Juan Rulfo',
    year: 1955,
    genre: 'Novela',
    price: 35000,
  },
];
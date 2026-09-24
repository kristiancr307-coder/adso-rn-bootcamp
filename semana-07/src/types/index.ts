// src/types/index.ts
// Modelo del dominio Editorial — catálogo de libros de "Editorial Luna".

export interface Item {
  id: number;
  name: string;
  description: string;
  author: string;
  year: number;
  genre: string;
  pages: number;
  price: number;
}

// Payload para crear un libro nuevo (sin id — lo asigna el servidor)
export type CreateItemPayload = Omit<Item, 'id'>;

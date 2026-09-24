// src/types/index.ts
// Modelo del dominio Editorial — catálogo de libros de "Editorial Luna".
// Mismos 8 campos que venimos usando desde la semana 03/04.

export interface Item {
  // En esta semana la API usa ids numéricos (JSONPlaceholder)
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

// Payload para actualizar (id requerido + campos editables)
export type UpdateItemPayload = Item;

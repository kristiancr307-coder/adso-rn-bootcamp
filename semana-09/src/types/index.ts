// src/types/index.ts
// Modelo del dominio Editorial — con progreso de lectura por libro.

export interface Item {
  id: string;
  name: string;
  description: string;
  author: string;
  year: number;
  genre: string;
  pages: number;
  price: number;
  /** Páginas ya leídas — alimenta la ProgressBar del detalle */
  pagesRead: number;
}

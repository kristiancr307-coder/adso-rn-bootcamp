// src/stores/readingListStore.ts
// "Mi lista de lectura" — Zustand + persist en AsyncStorage (repaso s04+s07).
// Al agregar/quitar, las pantallas disparan LayoutAnimation ANTES de llamar
// a estas acciones para que el cambio de layout quede animado.

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Item } from '../types';

interface ReadingListState {
  items: Item[];
  addItem: (book: Item) => void;
  removeItem: (id: string) => void;
}

export const useReadingListStore = create<ReadingListState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (book) =>
        set((state) =>
          state.items.some((i) => i.id === book.id)
            ? state // sin duplicados
            : { items: [book, ...state.items] },
        ),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
    }),
    {
      name: 'editorial-lista-lectura',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

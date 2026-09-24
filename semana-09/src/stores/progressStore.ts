// src/stores/progressStore.ts
// Progreso de lectura por libro (páginas leídas) — Zustand + persist.
// La ProgressBar del detalle se alimenta de aquí; el botón "+25 páginas"
// actualiza el store y la barra se anima sola al cambiar el valor.

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProgressState {
  pagesByBook: Record<string, number>;
  addPages: (bookId: string, pages: number, maxPages: number) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      pagesByBook: {},

      addPages: (bookId, pages, maxPages) =>
        set((state) => {
          const current = state.pagesByBook[bookId] ?? 0;
          const next = Math.min(current + pages, maxPages);
          return { pagesByBook: { ...state.pagesByBook, [bookId]: next } };
        }),
    }),
    {
      name: 'editorial-progreso-lectura',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

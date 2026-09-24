// src/navigation/types.ts
// Tipado del stack de navegación

export type RootStackParamList = {
  Home:   undefined;
  Detail: { id: string; name: string };
};

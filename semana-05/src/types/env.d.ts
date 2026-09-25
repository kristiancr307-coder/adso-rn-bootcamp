// Declaración mínima del objeto global `process` que Expo inyecta en
// tiempo de compilación (variables de entorno EXPO_PUBLIC_*).
// Evita el error TS2591 sin necesidad de instalar @types/node.
declare const process: {
  env: Record<string, string | undefined>;
};

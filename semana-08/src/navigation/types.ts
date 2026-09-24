// src/navigation/types.ts
// Dos stacks: Auth (público) y App (protegido). El RootNavigator elige
// según isAuthenticated.

export type AuthStackParamList = {
  Login:    undefined;
  Register: undefined;
};

export type AppStackParamList = {
  Home:    undefined;
  Profile: undefined;
};

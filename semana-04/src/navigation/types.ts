export type RootTabParamList = {
  Home: undefined;
  Saved: undefined;
};

export type HomeStackParamList = {
  HomeList: undefined;
  HomeDetail: {
    id: string;
    name: string;
    description: string;
    author: string;
    year: number;
    genre: string;
    pages: number;
    price: number;
  };
};

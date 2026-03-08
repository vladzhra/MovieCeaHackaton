import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type Genre = { id: number; name: string };

export type ProductionCompany = {
  id: number;
  name: string;
  logoPath: string | null;
  originCountry: string | null;
};

export type ProductionCountry = {
  iso_3166_1: string;
  name: string;
};

export type SpokenLanguage = {
  iso_639_1: string;
  name: string;
};

export type Movie = {
  id: number;
  title: string;
  originalTitle: string | null;
  overview: string | null;
  tagline: string | null;
  releaseDate: string | null;
  voteAverage: number | null;
  voteCount: number | null;
  runtime: number | null;
  popularity: number | null;
  status: string | null;
  budget: number | null;
  revenue: number | null;
  imdbId: string | null;
  homepage: string | null;
  originalLanguage: string | null;
  posterPath: string | null;
  backdropPath: string | null;
  video: boolean | null;
  collectionId: number | null;
  collectionName: string | null;
  genres: Genre[];
  productionCompanies: ProductionCompany[];
  productionCountries: ProductionCountry[];
  spokenLanguages: SpokenLanguage[];
};

export type MoviesResponse = {
  total: number;
  page: number;
  limit: number;
  items: Movie[];
};

export type User = {
  id: number;
  email: string;
  isAdmin: boolean;
  createdAt: string;
};

export type Comment = {
  id: number;
  content: string;
  rating: number;
  movieId: number;
  userId: number;
  user: {
    id: number;
    email: string;
    isAdmin: boolean;
  };
  createdAt: string;
  updatedAt: string;
};

export type CreateCommentDto = {
  content: string;
  rating: number;
  movieId: number;
};

export type AuthResponse = {
  access_token: string;
  user: User;
};

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['Movie', 'User', 'Comment'],
  endpoints: () => ({}),
});

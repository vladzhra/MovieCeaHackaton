import { api, Movie, MoviesResponse } from './api';

export const movieApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMovies: builder.query<MoviesResponse, { page: number; limit: number; search?: string }>({
      query: (params) => ({
        url: '/movies',
        params,
      }),
      providesTags: ['Movie'],
    }),
    updateMovie: builder.mutation<Movie, { id: number; data: Partial<Movie> }>({
      query: ({ id, data }) => ({
        url: `/movies/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Movie'],
    }),
  }),
});

export const {
  useGetMoviesQuery,
  useUpdateMovieMutation,
} = movieApi;

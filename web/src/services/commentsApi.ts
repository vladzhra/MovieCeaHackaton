import { api, Comment, CreateCommentDto } from './api';

export const commentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCommentsByMovie: builder.query<Comment[], number>({
      query: (movieId) => ({
        url: `/comments/movie/${movieId}`,
      }),
      providesTags: (result, error, movieId) => [
        { type: 'Comment', id: `MOVIE_${movieId}` },
      ],
    }),
    createComment: builder.mutation<Comment, CreateCommentDto>({
      query: (data) => ({
        url: '/comments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Comment', id: `MOVIE_${arg.movieId}` },
      ],
    }),
    deleteComment: builder.mutation<void, { commentId: number; movieId: number }>({
      query: ({ commentId }) => ({
        url: `/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Comment', id: `MOVIE_${arg.movieId}` },
      ],
    }),
  }),
});

export const {
  useGetCommentsByMovieQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;

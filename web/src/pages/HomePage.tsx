import { useMemo, useRef, useState, FormEvent } from 'react';
import { Box, Typography, Button, styled } from '@mui/material';
import { useGetMoviesQuery } from '../services/movieApi';
import { Movie } from '../services/api';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import Header from '../components/Header';
import SkeletonGrid from '../components/SkeletonGrid';
import Pagination from '../components/Pagination';

const LIMIT = 24;

// ── Styled Components ──────────────────────────────────────

const PageWrapper = styled('main')(({ theme }) => ({
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '32px 24px 80px',
  [theme.breakpoints.down('sm')]: {
    padding: '20px 16px 60px',
  },
}));

const GenreFilter = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginBottom: '32px',
}));

const GenreChip = styled('button')(({ theme }) => ({
  padding: '6px 16px',
  borderRadius: '50px',
  fontSize: '0.8rem',
  fontWeight: 500,
  border: '1px solid var(--border)',
  background: 'var(--bg-glass)',
  color: 'var(--text-secondary)',
  transition: 'all var(--transition-fast)',
  letterSpacing: '0.02em',
  cursor: 'pointer',
  fontFamily: 'inherit',
  '&:hover': {
    borderColor: 'var(--accent)',
    color: 'var(--accent)',
    background: 'rgba(192,132,252,0.08)',
  },
  '&.active': {
    background: 'var(--accent-dim)',
    borderColor: 'var(--accent)',
    color: '#fff',
  },
}));

const SectionHeader = styled(Box)({
  display: 'flex',
  alignItems: 'baseline',
  gap: '12px',
  marginBottom: '20px',
});

const SectionTitle = styled(Typography)({
  fontFamily: 'var(--font-display)',
  fontSize: '1.35rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
});

const SectionCount = styled(Typography)({
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
});

const MoviesGrid = styled('ul')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '24px',
  padding: 0,
  margin: 0,
  listStyle: 'none',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '16px',
  },
  [theme.breakpoints.down('xs')]: {
     gridTemplateColumns: 'repeat(2, 1fr)',
     gap: '12px',
  }
}));

const StateBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '80px 24px',
  textAlign: 'center',
  gap: '16px',
});

const RetryButton = styled(Button)(({ theme }) => ({
  marginTop: '8px',
  padding: '10px 24px',
  borderRadius: '50px',
  background: 'var(--accent-dim)',
  color: '#fff',
  fontWeight: 600,
  fontSize: '0.85rem',
  transition: 'all var(--transition-fast)',
  '&:hover': {
    background: 'var(--accent)',
  },
}));

// ── Component ──────────────────────────────────────────────

const HomePage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isLoading: loading, isError } = useGetMoviesQuery({
    page,
    limit: LIMIT,
    search: search || undefined,
  });

  const movies = useMemo(() => data?.items || [], [data]);
  const total = data?.total || 0;

  const allGenres = useMemo(() => {
    const set = new Set<string>();
    movies.forEach((m: Movie) => m.genres.forEach((g) => set.add(g.name)));
    return Array.from(set).sort();
  }, [movies]);

  const displayedMovies = useMemo(() => {
    if (!selectedGenre) return movies;
    return movies.filter((m: Movie) => m.genres.some(g => g.name === selectedGenre));
  }, [movies, selectedGenre]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      const trimmed = value.trim();
      setSearch(trimmed);
      setPage(1);
      setSelectedGenre(null);
    }, 350);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setSearch(searchInput.trim());
    setPage(1);
    setSelectedGenre(null);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {!selectedMovie && (
        <Header 
          searchInput={searchInput}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
        />
      )}

      <PageWrapper>
        {allGenres.length > 0 && (
          <GenreFilter role="navigation" aria-label="Filter by genre">
            <GenreChip
              className={!selectedGenre ? 'active' : ''}
              onClick={() => setSelectedGenre(null)}
            >
              All
            </GenreChip>
            {allGenres.map((g) => (
              <GenreChip
                key={g}
                className={selectedGenre === g ? 'active' : ''}
                onClick={() => setSelectedGenre(selectedGenre === g ? null : g)}
              >
                {g}
              </GenreChip>
            ))}
          </GenreFilter>
        )}

        <SectionHeader>
          <SectionTitle variant="h1">
            {search ? `Results for "${search}"` : selectedGenre ? selectedGenre : 'Top Rated Films'}
          </SectionTitle>
          {!loading && (
            <SectionCount variant="body2">
              {selectedGenre
                ? `${displayedMovies.length} films`
                : `${total.toLocaleString()} films`}
            </SectionCount>
          )}
        </SectionHeader>

        {loading && <SkeletonGrid />}

        {!loading && isError && (
          <StateBox role="alert">
            <Typography sx={{ fontSize: '3rem', opacity: 0.5 }}>⚠️</Typography>
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Something went wrong</Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>Failed to load movies. Is the API running?</Typography>
            <RetryButton onClick={() => window.location.reload()}>
              Try again
            </RetryButton>
          </StateBox>
        )}

        {!loading && !isError && displayedMovies.length === 0 && (
          <StateBox>
            <Typography sx={{ fontSize: '3rem', opacity: 0.5 }}>🎬</Typography>
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'var(--text-secondary)' }}>No movies found</Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>Try a different search or genre filter.</Typography>
          </StateBox>
        )}

        {!loading && !isError && displayedMovies.length > 0 && (
          <MoviesGrid aria-label="Movies">
            {displayedMovies.map((movie: Movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => setSelectedMovie(movie)}
              />
            ))}
          </MoviesGrid>
        )}

        {!loading && !isError && !selectedGenre && (
          <Pagination
            page={page}
            total={total}
            limit={LIMIT}
            onPage={handlePageChange}
          />
        )}
      </PageWrapper>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onUpdate={(updated) => {
            setSelectedMovie(updated);
          }}
        />
      )}
    </>
  );
};

export default HomePage;

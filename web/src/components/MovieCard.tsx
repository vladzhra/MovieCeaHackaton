import { useState } from 'react';
import { Box, Typography, styled } from '@mui/material';
import { Movie } from '../services/api';

const POSTER_BASE = 'https://image.tmdb.org/t/p/w342';

// ── Styled Components ──────────────────────────────────────

const CardRoot = styled('li')(({ theme }) => ({
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-lg)',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: `transform var(--transition-med), box-shadow var(--transition-med), border-color var(--transition-med)`,
  position: 'relative',
  listStyle: 'none',
  '&:hover': {
    transform: 'translateY(-6px) scale(1.01)',
    boxShadow: 'var(--shadow-card), var(--shadow-glow)',
    borderColor: 'var(--border-hover)',
    '& img': {
      transform: 'scale(1.06)',
    },
  },
}));

const PosterWrap = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  paddingTop: '150%', // 2:3 aspect ratio
  overflow: 'hidden',
  background: 'var(--bg-surface)',
  '& img': {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform var(--transition-slow)',
  },
}));

const PosterPlaceholder = styled(Box)({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #1a1a30, #0f0f20)',
  color: 'var(--text-muted)',
  fontSize: '2.5rem',
});

const PopularBadge = styled('span')({
  position: 'absolute',
  top: '10px',
  left: '10px',
  background: 'linear-gradient(90deg, #c084fc, #9b5de5)',
  color: '#fff',
  fontSize: '0.65rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  padding: '3px 10px',
  borderRadius: '50px',
  boxShadow: '0 2px 12px rgba(192,132,252,0.4)',
});

const RatingBadge = styled(Box)({
  position: 'absolute',
  bottom: '10px',
  right: '10px',
  background: 'rgba(7,7,13,0.85)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(245,197,24,0.3)',
  borderRadius: '8px',
  padding: '4px 8px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: 'var(--accent-gold)',
  '& .star': {
    fontSize: '0.75rem',
  },
});

const CardBody = styled(Box)({
  padding: '14px',
});

const MovieTitle = styled(Typography)({
  fontFamily: 'var(--font-display)',
  fontSize: '0.95rem',
  fontWeight: 600,
  color: 'var(--text-primary)',
  marginBottom: '6px',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  lineHeight: 1.35,
});

const MetaRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '10px',
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
});

const Dot = styled('span')({
  width: '3px',
  height: '3px',
  borderRadius: '50%',
  background: 'var(--text-muted)',
  flexShrink: 0,
});

const GenreList = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '5px',
});

const GenreBadge = styled('span')({
  fontSize: '0.68rem',
  fontWeight: 500,
  padding: '2px 9px',
  borderRadius: '50px',
  border: '1px solid var(--border)',
  color: 'var(--text-muted)',
  background: 'rgba(255,255,255,0.03)',
  letterSpacing: '0.02em',
});

// ── Helpers ────────────────────────────────────────────────

const formatYear = (date: string | null) => {
  if (!date) return 'N/A';
  return new Date(date).getFullYear().toString();
};

const formatRuntime = (minutes: number | null) => {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

// ── Component ──────────────────────────────────────────────

type Props = {
  movie: Movie;
  onClick: () => void;
};

const MovieCard: React.FC<Props> = ({ movie, onClick }) => {
  const [imgError, setImgError] = useState(false);
  const posterUrl = movie.posterPath && !imgError
    ? `${POSTER_BASE}${movie.posterPath}`
    : null;

  const rating = movie.voteAverage ?? 0;
  const year = formatYear(movie.releaseDate);
  const runtime = formatRuntime(movie.runtime);
  const isPopular = (movie.popularity ?? 0) > 50;

  return (
    <CardRoot onClick={onClick} title={movie.title}>
      <PosterWrap>
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`Poster of ${movie.title}`}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <PosterPlaceholder>🎬</PosterPlaceholder>
        )}

        {isPopular && <PopularBadge>✦ Popular</PopularBadge>}

        {rating > 0 && (
          <RatingBadge>
            <span className="star">★</span>
            {rating.toFixed(1)}
          </RatingBadge>
        )}
      </PosterWrap>

      <CardBody>
        <MovieTitle variant="h3">{movie.title}</MovieTitle>
        <MetaRow>
          <span>{year}</span>
          {runtime && (
            <>
              <Dot />
              <span>{runtime}</span>
            </>
          )}
          {movie.voteCount && (
            <>
              <Dot />
              <span>{movie.voteCount.toLocaleString()} votes</span>
            </>
          )}
        </MetaRow>
        {movie.genres.length > 0 && (
          <GenreList>
            {movie.genres.slice(0, 3).map((g) => (
              <GenreBadge key={g.id}>{g.name}</GenreBadge>
            ))}
          </GenreList>
        )}
      </CardBody>
    </CardRoot>
  );
};

export default MovieCard;

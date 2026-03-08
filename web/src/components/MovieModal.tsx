import { useEffect, useState } from 'react';
import { Box, Typography, Button, IconButton, styled } from '@mui/material';
import { Movie } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useUpdateMovieMutation } from '../services/movieApi';
import CommentsSection from './CommentsSection';

const BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280';
const POSTER_BASE   = 'https://image.tmdb.org/t/p/w342';
const LOGO_BASE     = 'https://image.tmdb.org/t/p/w92';

// ── Styled Components ──────────────────────────────────────

const ModalOverlay = styled(Box)(({ theme }) => ({
  position: 'fixed',
  inset: 0,
  zIndex: 200,
  background: 'rgba(0,0,0,0.85)',
  backdropFilter: 'blur(6px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  animation: 'fadeIn var(--transition-fast)',
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
}));

const ModalContainer = styled('article')(({ theme }) => ({
  background: 'var(--bg-modal)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-xl)',
  width: '100%',
  maxWidth: '900px',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: 'var(--shadow-modal)',
  animation: 'slideUp var(--transition-med)',
  position: 'relative',
  '@keyframes slideUp': {
    from: { transform: 'translateY(30px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '16px',
  right: '16px',
  zIndex: 10,
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: 'rgba(0,0,0,0.6)',
  border: '1px solid var(--border)',
  color: 'var(--text-secondary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all var(--transition-fast)',
  '&:hover': {
    background: 'rgba(192,132,252,0.2)',
    borderColor: 'var(--accent)',
    color: 'var(--accent)',
  },
}));

const BackdropWrap = styled(Box)(({ theme }) => ({
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, transparent 30%, var(--bg-modal) 100%)',
    borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
    pointerEvents: 'none',
  },
}));

const BackdropImg = styled('img')({
  width: '100%',
  height: '280px',
  objectFit: 'cover',
  borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
});

const BackdropPlaceholder = styled(Box)({
  width: '100%',
  height: '280px',
  background: 'linear-gradient(135deg, #1a0f35, #0f0f20)',
  borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '3rem',
  color: 'var(--text-muted)',
});

const ModalBody = styled(Box)({
  padding: '0 32px 32px',
});

const HeroSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '28px',
  marginTop: '-80px',
  position: 'relative',
  zIndex: 2,
  marginBottom: '28px',
  [theme.breakpoints.down('sm')]: {
     flexDirection: 'column',
     alignItems: 'center',
     marginTop: '-60px',
     textAlign: 'center',
  }
}));

const ModalPoster = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  width: '140px',
  height: '210px',
  borderRadius: 'var(--radius-md)',
  overflow: 'hidden',
  border: '2px solid var(--border)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  [theme.breakpoints.down('sm')]: {
    width: '110px',
    height: '165px',
  }
}));

const TitleSection = styled(Box)(({ theme }) => ({
  paddingTop: '88px',
  flex: 1,
  [theme.breakpoints.down('sm')]: {
    paddingTop: 0,
  }
}));

const ModalTitle = styled(Typography)({
  fontFamily: 'var(--font-display)',
  fontSize: '1.9rem',
  fontWeight: 800,
  lineHeight: 1.15,
  color: 'var(--text-primary)',
  marginBottom: '6px',
});

const MetaPill = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  fontSize: '0.78rem',
  color: 'var(--text-secondary)',
  background: 'var(--bg-glass)',
  border: '1px solid var(--border)',
  borderRadius: '50px',
  padding: '4px 12px',
  '&.status-pill': {
    borderColor: 'rgba(74,222,128,0.3)',
    color: 'var(--accent-green)',
    background: 'rgba(74,222,128,0.08)',
  }
});

const StarsRow = styled(Box)({
  display: 'flex',
  gap: '2px',
  '& .star-filled': { color: 'var(--accent-gold)' },
  '& .star-half': { color: 'var(--accent-gold)', opacity: 0.6 },
  '& .star-empty': { color: 'var(--text-muted)' },
});

const InfoGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '24px',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  }
}));

const SectionTitle = styled(Typography)({
  fontFamily: 'var(--font-display)',
  fontSize: '0.78rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'var(--text-muted)',
  paddingBottom: '8px',
  borderBottom: '1px solid var(--border)',
  marginBottom: '12px',
});

const FinanceBlock = styled(Box)({
  flex: 1,
  background: 'var(--bg-glass)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  padding: '12px',
});

const GenreBadge = styled('span')({
  padding: '4px 14px',
  borderRadius: '50px',
  fontSize: '0.78rem',
  fontWeight: 500,
  background: 'rgba(192,132,252,0.12)',
  border: '1px solid rgba(192,132,252,0.25)',
  color: 'var(--accent)',
});

// ── Helpers ────────────────────────────────────────────────

const formatDate = (value: string | null) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
};

const formatRuntime = (minutes: number | null) => {
  if (!minutes) return 'N/A';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const formatMoney = (value: number | null) => {
  if (!value || value === 0) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

const formatPopularity = (value: number | null) => {
  if (value === null) return 'N/A';
  return value.toFixed(1);
};

const StarRating: React.FC<{ value: number }> = ({ value }) => {
  const fullStars = Math.floor(value / 2);
  const hasHalf   = value / 2 - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  return (
    <StarsRow>
      {Array.from({ length: fullStars }).map((_, i) => (
        <span key={`f${i}`} className="star-filled">★</span>
      ))}
      {hasHalf && <span className="star-half">★</span>}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <span key={`e${i}`} className="star-empty">★</span>
      ))}
    </StarsRow>
  );
};

// ── Component ──────────────────────────────────────────────

type Props = {
  movie: Movie;
  onClose: () => void;
  onUpdate?: (movie: Movie) => void;
};

const MovieModal: React.FC<Props> = ({ movie, onClose, onUpdate }) => {
  const { isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Movie>>({});
  const [updateMovie, { isLoading: isSaving }] = useUpdateMovieMutation();
  const [backdropError, setBackdropError] = useState(false);
  const [posterError,   setPosterError]   = useState(false);

  const startEditing = () => {
    setEditData({
      title: movie.title,
      overview: movie.overview,
      tagline: movie.tagline,
      status: movie.status,
      runtime: movie.runtime,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    const data = {
      title: editData.title,
      overview: editData.overview,
      tagline: editData.tagline,
      status: editData.status,
      runtime: editData.runtime,
    };

    try {
      const updated = await updateMovie({ id: movie.id, data }).unwrap();
      if (onUpdate) onUpdate(updated);
      setIsEditing(false);
    } catch {
      alert('Failed to update movie');
    }
  };

  const backdropUrl = movie.backdropPath && !backdropError
    ? `${BACKDROP_BASE}${movie.backdropPath}`
    : null;

  const posterUrl = movie.posterPath && !posterError
    ? `${POSTER_BASE}${movie.posterPath}`
    : null;

  const profit = (movie.revenue && movie.budget)
    ? movie.revenue - movie.budget
    : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <ModalOverlay onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <ModalContainer role="dialog" aria-modal="true" aria-label={movie.title}>
        <CloseButton onClick={onClose} aria-label="Close">✕</CloseButton>

        {isAdmin && !isEditing && (
          <Button 
            variant="contained" 
            onClick={startEditing}
            sx={{ position: 'absolute', top: '1rem', right: '4rem', zIndex: 10, borderRadius: '50px' }}
          >
            Edit
          </Button>
        )}

        {isEditing && (
          <Box sx={{ position: 'absolute', top: '1rem', right: '4rem', zIndex: 10, display: 'flex', gap: '0.5rem' }}>
            <Button variant="contained" onClick={handleSave} disabled={isSaving} sx={{ borderRadius: '50px' }}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="contained" onClick={() => setIsEditing(false)} sx={{ borderRadius: '50px', background: '#666', '&:hover': { background: '#555' } }}>
              Cancel
            </Button>
          </Box>
        )}

        {/* ── Backdrop ── */}
        <BackdropWrap>
          {backdropUrl ? (
            <BackdropImg
              src={backdropUrl}
              alt={`Backdrop of ${movie.title}`}
              onError={() => setBackdropError(true)}
            />
          ) : (
            <BackdropPlaceholder>🎬</BackdropPlaceholder>
          )}
        </BackdropWrap>

        <ModalBody>
          <HeroSection>
            <ModalPoster>
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={`Poster of ${movie.title}`}
                  onError={() => setPosterError(true)}
                />
              ) : (
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: 'var(--text-muted)' }}>🎬</Box>
              )}
            </ModalPoster>

            <TitleSection>
              {isEditing ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Title</Typography>
                  <input 
                    value={editData.title || ''} 
                    onChange={e => setEditData({...editData, title: e.target.value})}
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg-glass)', color: '#fff' }}
                  />
                </Box>
              ) : (
                <ModalTitle variant="h2">{movie.title}</ModalTitle>
              )}

              {movie.originalTitle && movie.originalTitle !== movie.title && (
                <Typography variant="body2" sx={{ color: 'var(--text-muted)', fontStyle: 'italic', mb: 1.5 }}>
                  Original: {movie.originalTitle}
                </Typography>
              )}

              {isEditing ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Tagline</Typography>
                  <input 
                    value={editData.tagline || ''} 
                    onChange={e => setEditData({...editData, tagline: e.target.value})}
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg-glass)', color: '#fff' }}
                  />
                </Box>
              ) : (
                movie.tagline && (
                  <Typography variant="body1" sx={{ color: 'var(--accent)', fontStyle: 'italic', mb: 1.5, opacity: 0.9 }}>
                    "{movie.tagline}"
                  </Typography>
                )
              )}

              {(movie.voteAverage ?? 0) > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <StarRating value={movie.voteAverage!} />
                  <Typography variant="h5" sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent-gold)' }}>
                    {movie.voteAverage!.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                    / 10 · {movie.voteCount?.toLocaleString()} votes
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {movie.releaseDate && (
                  <MetaPill>
                    <span>📅</span> {formatDate(movie.releaseDate)}
                  </MetaPill>
                )}
                {movie.runtime && (
                  <MetaPill>
                    <span>⏱</span> {formatRuntime(movie.runtime)}
                  </MetaPill>
                )}
                {movie.originalLanguage && (
                  <MetaPill>
                    <span>🌐</span> {movie.originalLanguage.toUpperCase()}
                  </MetaPill>
                )}
                {movie.status && (
                  <MetaPill className="status-pill">
                    <span>✔</span> {movie.status}
                  </MetaPill>
                )}
                {movie.popularity != null && (
                  <MetaPill>
                    <span>🔥</span> {formatPopularity(movie.popularity)} popularity
                  </MetaPill>
                )}
              </Box>
            </TitleSection>
          </HeroSection>

          {/* ── Overview ── */}
          {isEditing ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Overview</Typography>
              <textarea 
                value={editData.overview || ''} 
                onChange={e => setEditData({...editData, overview: e.target.value})}
                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg-glass)', color: '#fff', minHeight: '100px' }}
              />
            </Box>
          ) : (
            movie.overview && (
              <Typography variant="body1" sx={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.75, mb: 3 }}>
                {movie.overview}
              </Typography>
            )
          )}

          <Box sx={{ height: '1px', background: 'var(--border)', mb: 3 }} />

          {/* ── Genres ── */}
          {movie.genres.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {movie.genres.map((g) => (
                <GenreBadge key={g.id}>{g.name}</GenreBadge>
              ))}
            </Box>
          )}

          {/* ── Details Grid ── */}
          <InfoGrid>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <SectionTitle variant="h4">Production</SectionTitle>
              {movie.productionCompanies.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {movie.productionCompanies.map((company) => (
                    <Box key={company.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {company.logoPath ? (
                        <img
                          style={{ width: 40, height: 28, objectFit: 'contain', filter: 'brightness(0) invert(0.7)' }}
                          src={`${LOGO_BASE}${company.logoPath}`}
                          alt={company.name}
                        />
                      ) : (
                        <Typography sx={{ width: 40 }}>🏢</Typography>
                      )}
                      <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>{company.name}</Typography>
                      {company.originCountry && (
                        <Typography variant="caption" sx={{ color: 'var(--text-muted)', ml: 'auto' }}>
                          {company.originCountry}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <SectionTitle variant="h4">Details</SectionTitle>
              {[
                { label: 'IMDB ID', value: movie.imdbId },
                { label: 'Status', value: movie.status },
                { label: 'Language', value: movie.originalLanguage?.toUpperCase() },
                { label: 'Released', value: formatDate(movie.releaseDate) },
                { label: 'Runtime', value: formatRuntime(movie.runtime) }
              ].map(item => item.value && (
                <Box key={item.label} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--text-muted)', minWidth: 90, textTransform: 'uppercase', pt: 0.2 }}>
                    {item.label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--text-secondary)', flex: 1 }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </InfoGrid>

          {/* ── Financials ── */}
          {((movie.budget && movie.budget > 0) || (movie.revenue && movie.revenue > 0)) && (
            <>
              <Box sx={{ height: '1px', background: 'var(--border)', my: 3 }} />
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <FinanceBlock>
                  <Typography variant="caption" sx={{ color: 'var(--text-muted)', textTransform: 'uppercase', mb: 0.5, display: 'block' }}>Budget</Typography>
                  <Typography variant="h6" sx={{ color: 'var(--accent-green)', fontWeight: 700 }}>{formatMoney(movie.budget)}</Typography>
                </FinanceBlock>
                <FinanceBlock>
                  <Typography variant="caption" sx={{ color: 'var(--text-muted)', textTransform: 'uppercase', mb: 0.5, display: 'block' }}>Box Office</Typography>
                  <Typography variant="h6" sx={{ color: 'var(--accent-green)', fontWeight: 700 }}>{formatMoney(movie.revenue)}</Typography>
                </FinanceBlock>
                {profit !== null && (
                  <FinanceBlock>
                    <Typography variant="caption" sx={{ color: 'var(--text-muted)', textTransform: 'uppercase', mb: 0.5, display: 'block' }}>Profit</Typography>
                    <Typography variant="h6" sx={{ color: profit < 0 ? 'var(--accent-red)' : 'var(--accent-green)', fontWeight: 700 }}>
                      {formatMoney(profit)}
                    </Typography>
                  </FinanceBlock>
                )}
              </Box>
            </>
          )}

          {/* ── Collection ── */}
          {movie.collectionName && (
            <Box sx={{ mt: 3, p: 2, background: 'linear-gradient(90deg, rgba(155,93,229,0.12), rgba(192,132,252,0.06))', border: '1px solid rgba(192,132,252,0.2)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ fontSize: '1.5rem' }}>🎞</Typography>
              <Box>
                <Typography variant="caption" sx={{ color: 'var(--accent-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Part of a collection</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{movie.collectionName}</Typography>
              </Box>
            </Box>
          )}

          {/* ── External Links ── */}
          {(movie.imdbId || movie.homepage) && (
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 3 }}>
              {movie.imdbId && (
                <Button 
                  href={`https://www.imdb.com/title/${movie.imdbId}`} 
                  target="_blank" 
                  variant="outlined"
                  sx={{ borderRadius: '50px', borderColor: 'var(--border)', color: 'var(--text-secondary)', '&:hover': { borderColor: 'var(--accent-gold)', color: 'var(--accent-gold)', background: 'rgba(245,197,24,0.06)' } }}
                >
                  ⭐ View on IMDb
                </Button>
              )}
              {movie.homepage && (
                <Button 
                  href={movie.homepage} 
                  target="_blank" 
                  variant="outlined"
                  sx={{ borderRadius: '50px', borderColor: 'var(--border)', color: 'var(--text-secondary)', '&:hover': { borderColor: 'var(--accent)', color: 'var(--accent)', background: 'rgba(192,132,252,0.08)' } }}
                >
                  🌐 Official Website
                </Button>
              )}
            </Box>
          )}

          {/* ── Comments Section ── */}
          <CommentsSection movieId={movie.id} />
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default MovieModal;

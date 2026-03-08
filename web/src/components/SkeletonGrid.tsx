import { Box, styled, keyframes } from '@mui/material';

const LIMIT = 24;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const Grid = styled('ul')(({ theme }) => ({
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
}));

const SkeletonBase = styled(Box)({
  background: 'linear-gradient(90deg, var(--bg-card) 25%, var(--bg-card-hover) 50%, var(--bg-card) 75%)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.4s infinite`,
  borderRadius: 'var(--radius-lg)',
});

const SkeletonCard = styled('li')({
  borderRadius: 'var(--radius-lg)',
  overflow: 'hidden',
  border: '1px solid var(--border)',
});

const SkeletonPoster = styled(SkeletonBase)({
  width: '100%',
  paddingTop: '150%',
});

const SkeletonBody = styled(Box)({
  padding: '14px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const SkeletonLine = styled(SkeletonBase)({
  height: '14px',
  borderRadius: '4px',
});

const SkeletonGrid: React.FC = () => {
  return (
    <Grid aria-label="Loading movies…">
      {Array.from({ length: LIMIT }).map((_, i) => (
        <SkeletonCard key={i}>
          <SkeletonPoster />
          <SkeletonBody>
            <SkeletonLine style={{ width: '80%' }} />
            <SkeletonLine style={{ width: '50%' }} />
            <SkeletonLine style={{ width: '65%' }} />
          </SkeletonBody>
        </SkeletonCard>
      ))}
    </Grid>
  );
};

export default SkeletonGrid;

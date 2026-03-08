import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Rating,
  IconButton,
  CircularProgress,
  styled,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../context/AuthContext';
import {
  useGetCommentsByMovieQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} from '../services/commentsApi';
import type { Comment } from '../services/api';

const CommentsContainer = styled(Box)({
  marginTop: '2rem',
  paddingTop: '2rem',
  borderTop: '1px solid var(--border)',
});

const SectionHeader = styled(Typography)({
  fontFamily: 'var(--font-display)',
  fontSize: '1.5rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: '1.5rem',
});

const CommentCard = styled(Box)({
  background: 'var(--bg-glass)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  padding: '1rem',
  marginBottom: '1rem',
});

const CommentHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '0.5rem',
});

const UserInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
});

const UserAvatar = styled(Box)({
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, var(--accent), var(--accent-gold))',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: '0.9rem',
  color: '#fff',
});

const CommentForm = styled(Box)({
  background: 'var(--bg-glass)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  padding: '1.5rem',
  marginBottom: '1.5rem',
});

type Props = {
  movieId: number;
};

const CommentsSection: React.FC<Props> = ({ movieId }) => {
  const { user } = useAuth();
  const { data: comments = [], isLoading, error } = useGetCommentsByMovieQuery(movieId);
  const [createComment, { isLoading: isCreating }] = useCreateCommentMutation();
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();
  
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number>(5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || rating === 0) {
      alert('Please provide a comment and rating');
      return;
    }

    try {
      await createComment({
        movieId,
        content: content.trim(),
        rating,
      }).unwrap();
      
      setContent('');
      setRating(5);
    } catch (error) {
      console.error('Failed to create comment:', error);
      alert('Failed to post comment. Please try again.');
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await deleteComment({ commentId, movieId }).unwrap();
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const canDelete = (comment: Comment) => {
    if (!user) return false;
    return user.isAdmin || comment.userId === user.id;
  };

  return (
    <CommentsContainer>
      <SectionHeader>Comments & Ratings</SectionHeader>

      {/* Comment Form */}
      {user ? (
        <CommentForm>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'var(--text-muted)', mb: 0.5 }}>
                Your Rating
              </Typography>
              <Rating
                value={rating}
                onChange={(_, newValue) => setRating(newValue || 0)}
                max={10}
                size="large"
                sx={{ 
                  '& .MuiRating-iconFilled': { color: 'var(--accent-gold)' },
                  '& .MuiRating-iconHover': { color: 'var(--accent-gold)' }
                }}
              />
              <Typography variant="caption" sx={{ color: 'var(--text-secondary)', ml: 1 }}>
                {rating}/10
              </Typography>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Share your thoughts about this movie..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              variant="outlined"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: 'var(--text-primary)',
                  '& fieldset': { borderColor: 'var(--border)' },
                  '&:hover fieldset': { borderColor: 'var(--accent)' },
                  '&.Mui-focused fieldset': { borderColor: 'var(--accent)' },
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isCreating || !content.trim()}
              sx={{ 
                borderRadius: '50px',
                background: 'var(--accent)',
                '&:hover': { background: 'var(--accent-dim)' }
              }}
            >
              {isCreating ? 'Posting...' : 'Post Comment'}
            </Button>
          </form>
        </CommentForm>
      ) : (
        <Box sx={{ 
          mb: 2, 
          p: 2, 
          background: 'var(--bg-glass)', 
          border: '1px solid var(--border)', 
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
            Please log in to post a comment
          </Typography>
        </Box>
      )}

      {/* Comments List */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography variant="body2" sx={{ color: 'var(--accent-red)', textAlign: 'center', py: 2 }}>
          Failed to load comments
        </Typography>
      ) : comments.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 4, 
          color: 'var(--text-muted)',
          background: 'var(--bg-glass)',
          border: '1px dashed var(--border)',
          borderRadius: 'var(--radius-md)'
        }}>
          <Typography variant="body1">No comments yet. Be the first to share your thoughts!</Typography>
        </Box>
      ) : (
        <Box>
          {comments.map((comment) => (
            <CommentCard key={comment.id}>
              <CommentHeader>
                <UserInfo>
                  <UserAvatar>{getInitials(comment.user.email)}</UserAvatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {comment.user.email}
                      {comment.user.isAdmin && (
                        <Box 
                          component="span" 
                          sx={{ 
                            ml: 1, 
                            px: 1, 
                            py: 0.25, 
                            fontSize: '0.7rem', 
                            background: 'var(--accent)', 
                            borderRadius: '4px',
                            fontWeight: 700
                          }}
                        >
                          ADMIN
                        </Box>
                      )}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                      {formatDate(comment.createdAt)}
                    </Typography>
                  </Box>
                </UserInfo>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating 
                    value={comment.rating} 
                    readOnly 
                    max={10} 
                    size="small"
                    sx={{ '& .MuiRating-iconFilled': { color: 'var(--accent-gold)' } }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--accent-gold)' }}>
                    {comment.rating}/10
                  </Typography>
                  
                  {canDelete(comment) && (
                    <IconButton
                      onClick={() => handleDelete(comment.id)}
                      disabled={isDeleting}
                      size="small"
                      sx={{ 
                        color: 'var(--text-muted)',
                        '&:hover': { color: 'var(--accent-red)' }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </CommentHeader>

              <Typography variant="body2" sx={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {comment.content}
              </Typography>
            </CommentCard>
          ))}
        </Box>
      )}
    </CommentsContainer>
  );
};

export default CommentsSection;

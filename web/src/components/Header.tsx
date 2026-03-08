import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  Button, 
  InputBase, 
  Container,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  alpha,
  styled
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Movie as MovieIcon,
  Logout as LogoutIcon,
  Lock as LockIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// ── Styled Components ──────────────────────────────────────

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(11, 11, 14, 0.8)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(212, 175, 55, 0.1)',
  position: 'sticky',
}));

const LogoLink = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  gap: theme.spacing(1),
  marginRight: theme.spacing(2),
}));

const StyledLogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  letterSpacing: '-0.02em',
  background: 'linear-gradient(135deg, #c084fc, #f5c518)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textDecoration: 'none',
  [theme.breakpoints.up('sm')]: {
    display: 'block',
  },
  display: 'none',
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha('#fff', 0.05),
  '&:hover': {
    backgroundColor: alpha('#fff', 0.1),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  border: '1px solid rgba(212, 175, 55, 0.2)',
  transition: 'all 0.3s ease',
  '&:focus-within': {
    borderColor: '#D4AF37',
    boxShadow: '0 0 0 2px rgba(212, 175, 55, 0.1)',
  }
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#D4AF37'
}));

const StyledInputBase = styled(InputBase)((({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
})));

const AdminButton = styled(IconButton)(({ theme }) => ({
  border: '1px solid rgba(212, 175, 55, 0.2)',
  borderRadius: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : `calc(${theme.shape.borderRadius} * 2)`,
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  bgcolor: theme.palette.primary.main, // This won't work in styled like this, needs access to palette
  color: 'black',
  fontWeight: 700,
  width: 32,
  height: 32,
}));

// ── Header Component ───────────────────────────────────────

interface HeaderProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  showSearch?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  searchInput, 
  onSearchChange, 
  onSearchSubmit,
  showSearch = true
}) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <LogoLink onClick={() => navigate('/')}>
            <MovieIcon sx={{ color: '#D4AF37', fontSize: 32 }} />
            <StyledLogoText variant="h6" noWrap>
              Movie<Box component="span" sx={{ WebkitTextFillColor: '#fff', color: '#fff' }}>Cea</Box>
            </StyledLogoText>
          </LogoLink>

          {showSearch ? (
            <Box component="form" onSubmit={onSearchSubmit} sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Discover your next favorite film…"
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchInput}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </Search>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 1 }} />
          )}

          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
            {!showSearch && (
               <Button color="inherit" onClick={() => navigate('/')}>Back to Movies</Button>
            )}
            {isAdmin && (
              <Tooltip title="Manage Users">
                <AdminButton 
                  color="inherit" 
                  onClick={() => navigate('/admin/users')}
                >
                  <AdminIcon />
                </AdminButton>
              </Tooltip>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Account settings">
                <IconButton onClick={handleMenu} sx={{ p: 0.5 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', color: 'black', fontWeight: 700, width: 32, height: 32 }}>
                    {user?.email?.[0].toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 1.5,
                      background: '#16161D',
                      border: '1px solid rgba(212, 175, 55, 0.1)',
                      '& .MuiMenuItem-root': { py: 1.5, px: 2 }
                    }
                  }
                }}
              >
                <Box sx={{ px: 2, py: 1, borderBottom: '1px solid rgba(255,255,255,0.05)', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{user?.email}</Typography>
                  <Typography variant="caption" color="text.secondary">{isAdmin ? 'Administrator' : 'Movie Enthusiast'}</Typography>
                </Box>
                <MenuItem 
                  onClick={() => {
                    handleClose();
                    navigate('/change-password');
                  }}
                >
                  <LockIcon fontSize="small" sx={{ mr: 1, color: '#D4AF37' }} />
                  <Typography color="inherit" variant="body2">Change Password</Typography>
                </MenuItem>
                <Divider sx={{ my: 0.5, borderColor: 'rgba(255,255,255,0.1)' }} />
                <MenuItem onClick={logout}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
                  <Typography color="error.main" variant="body2" sx={{ fontWeight: 600 }}>Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Header;

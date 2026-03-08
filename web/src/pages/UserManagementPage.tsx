import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  IconButton, 
  Chip,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  AdminPanelSettings as AdminIcon, 
  Person as PersonIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { 
  useGetUsersQuery, 
  useUpdateUserMutation, 
  useDeleteUserMutation 
} from '../services/userApi';
import { User } from '../services/api';

const UserManagementPage: React.FC = () => {
  const { data: users = [], isLoading, refetch } = useGetUsersQuery();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const handleToggleAdmin = async (user: User) => {
    try {
      await updateUser({ id: user.id, data: { isAdmin: !user.isAdmin } }).unwrap();
    } catch {
      alert('Failed to update user');
    }
  };

  const openDeleteDialog = (id: number) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete).unwrap();
      } catch {
        alert('Failed to delete user');
      } finally {
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      }
    }
  };

  if (isLoading && users.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your community and administrator privileges
          </Typography>
        </Box>
        <Button 
          startIcon={<RefreshIcon />} 
          variant="outlined" 
          onClick={() => refetch()}
          sx={{ borderRadius: 2 }}
        >
          Refresh
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: 'rgba(212, 175, 55, 0.05)' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Identifier / Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Joined Date</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow 
                key={u.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { background: 'rgba(255,255,255,0.02)' } }}
              >
                <TableCell component="th" scope="row">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        background: 'rgba(212,175,55,0.1)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: 'primary.main'
                      }}
                    >
                      <PersonIcon />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {u.email}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {u.isAdmin ? (
                    <Chip 
                      icon={<SecurityIcon style={{ color: '#D4AF37' }} />} 
                      label="Administrator" 
                      variant="outlined"
                      sx={{ borderColor: 'primary.main', color: 'primary.main', fontWeight: 600 }}
                    />
                  ) : (
                    <Chip 
                      icon={<PersonIcon />} 
                      label="User" 
                      variant="outlined"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title={u.isAdmin ? "Revoke Admin" : "Promote to Admin"}>
                    <IconButton 
                      onClick={() => handleToggleAdmin(u)}
                      color={u.isAdmin ? "warning" : "primary"}
                      sx={{ mr: 1 }}
                    >
                      <AdminIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete User">
                    <IconButton 
                      onClick={() => openDeleteDialog(u.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone and they will lose all access to their account.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="text" color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagementPage;

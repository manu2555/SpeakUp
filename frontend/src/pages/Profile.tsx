import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Avatar,
  Grid,
  Divider,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../hooks';
import { updateProfile } from '../store/slices/authSlice';

interface ProfileFormData {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'confirmPassword' || name === 'newPassword') {
      if (name === 'confirmPassword' && formData.newPassword !== value) {
        setPasswordError(t('auth.passwordMismatch'));
      } else if (name === 'newPassword' && formData.confirmPassword && formData.confirmPassword !== value) {
        setPasswordError(t('auth.passwordMismatch'));
      } else {
        setPasswordError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setPasswordError(t('auth.passwordMismatch'));
      return;
    }

    const updateData = {
      name: formData.name,
      email: formData.email,
      ...(formData.newPassword && {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }),
    };

    const result = await dispatch(updateProfile(updateData));
    if (updateProfile.fulfilled.match(result)) {
      setSuccessMessage(t('profile.updateSuccess'));
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    }
  };

  return (
    <Box 
      sx={{ 
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        bgcolor: 'background.default',
        px: { xs: 2, sm: 3, md: 4 },
        py: 4
      }}
    >
      <Container maxWidth={false}>
        <Box sx={{ 
          maxWidth: 'md',
          mx: 'auto',
          width: '100%'
        }}>
          <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
            <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h4" component="h1" color="primary.main" gutterBottom>
                {t('profile.title')}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                {error}
              </Alert>
            )}

            {successMessage && (
              <Alert severity="success" sx={{ mb: 2, width: '100%' }}>
                {successMessage}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom color="primary.main">
                    {t('profile.personalInfo')}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('auth.name')}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('auth.email')}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom color="primary.main">
                    {t('profile.changePassword')}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('profile.currentPassword')}
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required={!!formData.newPassword}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('profile.newPassword')}
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('profile.confirmPassword')}
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!passwordError}
                    helperText={passwordError}
                    required={!!formData.newPassword}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isLoading || !!passwordError}
                      sx={{ minWidth: 120 }}
                    >
                      {isLoading ? <CircularProgress size={24} /> : t('profile.update')}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Profile; 
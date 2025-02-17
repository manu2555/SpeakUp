import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { register } from '../../store/slices/authSlice';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === 'confirmPassword' || e.target.name === 'password') {
      if (e.target.name === 'confirmPassword' && formData.password !== e.target.value) {
        setPasswordError(t('auth.passwordMismatch'));
      } else if (e.target.name === 'password' && formData.confirmPassword && formData.confirmPassword !== e.target.value) {
        setPasswordError(t('auth.passwordMismatch'));
      } else {
        setPasswordError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordError(t('auth.passwordMismatch'));
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    const result = await dispatch(register(registerData));
    if (register.fulfilled.match(result)) {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          {t('auth.register')}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label={t('auth.name')}
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label={t('auth.email')}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label={t('auth.password')}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label={t('auth.confirmPassword')}
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            margin="normal"
            error={!!passwordError}
            helperText={passwordError}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading || !!passwordError}
          >
            {isLoading ? <CircularProgress size={24} /> : t('auth.register')}
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            {t('auth.haveAccount')}{' '}
            <Link component={RouterLink} to="/login">
              {t('auth.login')}
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register; 
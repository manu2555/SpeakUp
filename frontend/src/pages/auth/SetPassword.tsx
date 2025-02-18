import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { verifyEmail, setPassword } from '../../store/slices/authSlice';

const SetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, verifiedUser } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail(token));
    }
  }, [token, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === 'confirmPassword' && formData.password !== e.target.value) {
      setPasswordError(t('auth.passwordMismatch'));
    } else if (e.target.name === 'password' && formData.confirmPassword && formData.confirmPassword !== e.target.value) {
      setPasswordError(t('auth.passwordMismatch'));
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordError(t('auth.passwordMismatch'));
      return;
    }

    if (!verifiedUser?.id) {
      return;
    }

    const result = await dispatch(setPassword({
      userId: verifiedUser.id,
      password: formData.password,
    }));

    if (setPassword.fulfilled.match(result)) {
      navigate('/dashboard', { replace: true });
    }
  };

  if (!token || !verifiedUser) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            {t('auth.invalidToken')}
          </Typography>
          <Typography variant="body1" align="center">
            {t('auth.verificationLinkExpired')}
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          {t('auth.setPassword')}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="body1" paragraph>
          {t('auth.welcomeSetPassword', { name: verifiedUser.name })}
        </Typography>

        <form onSubmit={handleSubmit}>
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
            {isLoading ? <CircularProgress size={24} /> : t('auth.completeRegistration')}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default SetPassword; 
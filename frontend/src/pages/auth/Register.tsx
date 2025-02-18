import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  Collapse,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { initiateRegistration, clearError } from '../../store/slices/authSlice';

const Register = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
  });

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validateForm = () => {
    const errors = {
      name: '',
      email: '',
    };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = t('errors.required');
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = t('errors.required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t('errors.invalidEmail');
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear field-specific error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any existing error
    dispatch(clearError());

    if (!validateForm()) {
      return;
    }

    const result = await dispatch(initiateRegistration(formData));
    if (initiateRegistration.fulfilled.match(result)) {
      setRegistrationSuccess(true);
    }
  };

  if (registrationSuccess) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default'
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            textAlign: 'center',
            maxWidth: 400,
            width: '90%', // Take up 90% of available width up to maxWidth
            borderRadius: 2,
            bgcolor: 'background.paper',
            mx: 2 // Add horizontal margin for mobile
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              mb: 3,
              fontWeight: 500
            }}
          >
            {t('auth.checkEmail')}
          </Typography>
          <Typography 
            variant="body1" 
            paragraph
            sx={{ mb: 2 }}
          >
            {t('auth.verificationEmailSent', { email: formData.email })}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              mt: 2,
              fontSize: '0.875rem'
            }}
          >
            {t('auth.checkSpam')}
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          {t('auth.register')}
        </Typography>
        
        <Collapse in={!!error}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Collapse>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label={t('auth.name')}
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            margin="normal"
            error={!!formErrors.name}
            helperText={formErrors.name}
            disabled={isLoading}
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
            error={!!formErrors.email}
            helperText={formErrors.email}
            disabled={isLoading}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
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
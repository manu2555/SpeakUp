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
  Grid,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
  Collapse,
} from '@mui/material';
import {
  GroupAdd as GroupAddIcon,
  Feedback as FeedbackIcon,
  Campaign as CampaignIcon,
  VerifiedUser as VerifiedUserIcon,
  Diversity3 as Diversity3Icon,
  Handshake as HandshakeIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { initiateRegistration, clearError } from '../../store/slices/authSlice';
import Logo from '../../components/common/Logo';

const Register = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  const features = [
    {
      icon: <FeedbackIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
      title: t('auth.benefit1Title'),
      description: t('auth.benefit1Desc'),
    },
    {
      icon: <CampaignIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
      title: t('auth.benefit2Title'),
      description: t('auth.benefit2Desc'),
    },
    {
      icon: <GroupAddIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
      title: t('auth.benefit3Title'),
      description: t('auth.benefit3Desc'),
    },
  ];

  const benefits = [
    {
      icon: <VerifiedUserIcon />,
      text: t('auth.trust1'),
    },
    {
      icon: <Diversity3Icon />,
      text: t('auth.trust2'),
    },
    {
      icon: <HandshakeIcon />,
      text: t('auth.trust3'),
    },
  ];

  if (registrationSuccess) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: `linear-gradient(135deg, ${theme.palette.primary.light}20 0%, ${theme.palette.primary.dark}10 100%)`,
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="sm">
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: 'background.paper',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                opacity: 0.1,
              },
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Logo size="large" />
            </Box>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
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
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.light}20 0%, ${theme.palette.primary.dark}10 100%)`,
        overflow: 'hidden',
      }}
    >
      <Container 
        maxWidth={false} 
        sx={{ 
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          px: { xs: 2, sm: 4, md: 6, lg: 8 },
        }}
      >
        <Grid 
          container 
          spacing={4} 
          alignItems="center" 
          sx={{ 
            height: '100%',
            maxHeight: '900px',
          }}
        >
          {/* Left side - Content */}
          {!isMobile && (
            <Grid item md={7} lg={8} sx={{ height: '100%' }}>
              <Box 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  py: 4,
                }}
              >
                {/* Hero Section */}
                <Box>
                  <Typography 
                    variant="h2" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 800,
                      fontSize: { md: '3rem', lg: '3.75rem' },
                      lineHeight: 1.2,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 3,
                    }}
                  >
                    {t('auth.registerTagline')}
                  </Typography>
                  <Typography 
                    variant="h5" 
                    color="text.secondary"
                    sx={{ 
                      maxWidth: '80%',
                      mb: 6,
                      fontSize: { md: '1.25rem', lg: '1.5rem' },
                      lineHeight: 1.6,
                    }}
                  >
                    {t('auth.registerDescription')}
                  </Typography>
                </Box>

                {/* Features Grid */}
                <Grid container spacing={4} sx={{ mb: 6 }}>
                  {features.map((feature, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          height: '100%',
                          borderRadius: 2,
                          background: theme.palette.background.paper,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: theme.shadows[4],
                            bgcolor: theme.palette.primary.light + '10',
                          },
                        }}
                      >
                        <Box 
                          sx={{ 
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                          }}
                        >
                          {feature.icon}
                          <Typography variant="h6">
                            {feature.title}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                {/* Benefits Section */}
                <Box>
                  <Divider />
                  <Stack
                    direction="row"
                    spacing={4}
                    justifyContent="space-around"
                    sx={{
                      mt: 3,
                      py: 2,
                    }}
                  >
                    {benefits.map((benefit, index) => (
                      <Stack
                        key={index}
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                          color: 'text.secondary',
                          '&:hover': {
                            color: 'primary.main',
                          },
                          transition: 'color 0.2s ease',
                        }}
                      >
                        {benefit.icon}
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {benefit.text}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Grid>
          )}

          {/* Right side - Register Form */}
          <Grid 
            item 
            xs={12} 
            md={5} 
            lg={4} 
            sx={{ 
              height: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4,
                width: '100%',
                maxWidth: 480,
                borderRadius: 2,
                background: theme.palette.background.paper,
                backdropFilter: 'blur(10px)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  opacity: 0.1,
                },
              }}
            >
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                  <Logo size="large" />
                </Box>
                <Typography 
                  variant="h5" 
                  component="h1" 
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
          {t('auth.register')}
        </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('auth.joinCommunity')}
                </Typography>
              </Box>
        
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
                  sx={{ 
                    mt: 3, 
                    mb: 2,
                    height: 48,
                  }}
                  disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : t('auth.register')}
          </Button>
        </form>

              <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2">
            {t('auth.haveAccount')}{' '}
                  <Button
                    component={RouterLink}
                    to="/login"
                    color="primary"
                    variant="text"
                    sx={{ 
                      fontWeight: 500,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        textDecoration: 'underline',
                      },
                    }}
                  >
              {t('auth.login')}
                  </Button>
          </Typography>
        </Box>
      </Paper>
          </Grid>
        </Grid>
    </Container>
    </Box>
  );
};

export default Register; 
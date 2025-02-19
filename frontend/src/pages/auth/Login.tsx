import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
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
} from '@mui/material';
import {
  Comment as CommentIcon,
  TrackChanges as TrackChangesIcon,
  Share as ShareIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Public as PublicIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { login, clearError } from '../../store/slices/authSlice';
import Logo from '../../components/common/Logo';

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(login(formData));
  };

  const features = [
    {
      icon: <CommentIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
      title: t('auth.feature1Title'),
      description: t('auth.feature1Desc'),
    },
    {
      icon: <TrackChangesIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
      title: t('auth.feature2Title'),
      description: t('auth.feature2Desc'),
    },
    {
      icon: <ShareIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
      title: t('auth.feature3Title'),
      description: t('auth.feature3Desc'),
    },
  ];

  const benefits = [
    {
      icon: <SecurityIcon />,
      text: t('auth.benefit1'),
    },
    {
      icon: <SpeedIcon />,
      text: t('auth.benefit2'),
    },
    {
      icon: <PublicIcon />,
      text: t('auth.benefit3'),
    },
  ];

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
                    {t('auth.tagline')}
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
                    {t('auth.description')}
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

          {/* Right side - Login Form */}
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
                  {t('auth.login')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('auth.welcomeBack')}
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label={t('auth.email')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  margin="normal"
                  disabled={isLoading}
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
                  {isLoading ? <CircularProgress size={24} /> : t('auth.login')}
                </Button>
              </form>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2">
                  {t('auth.noAccount')}{' '}
                  <Link 
                    component={RouterLink} 
                    to="/register" 
                    color="primary"
                    sx={{ 
                      fontWeight: 500,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {t('auth.register')}
                  </Link>
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login; 
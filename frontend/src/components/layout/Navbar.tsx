import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Translate as TranslateIcon,
  History as HistoryIcon,
  Add as AddIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import Logo from '../common/Logo';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { mode, toggleTheme } = useTheme();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleOpenLangMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLang(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleCloseLangMenu = () => {
    setAnchorElLang(null);
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    handleCloseLangMenu();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        backgroundColor: mode === 'dark' ? '#1B262C' : '#FFFFFF',
        borderBottom: '1px solid',
        borderColor: mode === 'dark' ? 'rgba(64, 224, 208, 0.1)' : 'rgba(64, 224, 208, 0.2)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop Logo */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 4 }}>
            <RouterLink to="/" style={{ textDecoration: 'none' }}>
              <Logo size="medium" />
            </RouterLink>
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: 'primary.main' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem component={RouterLink} to="/dashboard" onClick={handleCloseNavMenu}>
                <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography color="primary.main">{t('common.dashboard')}</Typography>
              </MenuItem>
              <MenuItem component={RouterLink} to="/feedback" onClick={handleCloseNavMenu}>
                <AddIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography color="primary.main">{t('feedback.submit')}</Typography>
              </MenuItem>
            </Menu>
          </Box>

          {/* Mobile Logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1 }}>
            <RouterLink to="/" style={{ textDecoration: 'none' }}>
              <Logo size="small" />
            </RouterLink>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button
              component={RouterLink}
              to="/dashboard"
              startIcon={<HistoryIcon />}
              sx={{ color: 'text.primary' }}
            >
              {t('common.dashboard')}
            </Button>
            <Button
              component={RouterLink}
              to="/feedback"
              startIcon={<AddIcon />}
              sx={{ color: 'text.primary' }}
            >
              {t('feedback.submit')}
            </Button>
          </Box>

          {/* Right Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title={mode === 'dark' ? t('common.lightMode') : t('common.darkMode')}>
              <IconButton onClick={toggleTheme} sx={{ color: 'primary.main' }}>
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title={t('common.language')}>
              <IconButton onClick={handleOpenLangMenu} sx={{ color: 'primary.main' }}>
                <TranslateIcon />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="language-menu"
              anchorEl={anchorElLang}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElLang)}
              onClose={handleCloseLangMenu}
            >
              <MenuItem onClick={() => handleLanguageChange('en')}>English</MenuItem>
              <MenuItem onClick={() => handleLanguageChange('hi')}>हिंदी</MenuItem>
            </Menu>

            {user ? (
              <>
                <Tooltip title={t('common.profile')}>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>{user.name[0]}</Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t('common.signedInAs')}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {user.name}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem component={RouterLink} to="/profile" onClick={handleCloseUserMenu}>
                    {t('profile.title')}
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    {t('auth.logout')}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                component={RouterLink}
                to="/login"
                sx={{ 
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                {t('auth.login')}
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 
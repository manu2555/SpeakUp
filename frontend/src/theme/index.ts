import { createTheme, Theme } from '@mui/material/styles';

// Common theme settings
const getDesignTokens = (mode: 'light' | 'dark'): Theme => ({
  palette: {
    mode,
    common: {
      black: '#000000',
      white: '#FFFFFF',
    },
    primary: {
      main: '#40E0D0', // Turquoise
      light: '#7FFFD4', // Aquamarine
      dark: '#20B2AA', // Light Sea Green
      contrastText: mode === 'dark' ? '#1B262C' : '#FFFFFF',
    },
    secondary: {
      main: '#4169E1', // Royal Blue
      light: '#6495ED', // Cornflower Blue
      dark: '#1E90FF', // Dodger Blue
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#FF4444',
      light: '#FF6B6B',
      dark: '#CC0000',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FFD700', // Gold
      light: '#FFEB3B',
      dark: '#FFA000',
      contrastText: '#1B262C',
    },
    info: {
      main: '#0288D1',
      light: '#03A9F4',
      dark: '#01579B',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
      contrastText: '#FFFFFF',
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#F5F5F5',
      A200: '#EEEEEE',
      A400: '#BDBDBD',
      A700: '#616161',
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
    background: {
      default: mode === 'dark' ? '#1B262C' : '#F8FAFC',
      paper: mode === 'dark' ? '#222E3C' : '#FFFFFF',
    },
    text: {
      primary: mode === 'dark' ? '#FFFFFF' : '#1B262C',
      secondary: mode === 'dark' ? '#BBE1FA' : '#4169E1',
      disabled: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.38)',
    },
    divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    action: {
      active: mode === 'dark' ? '#FFFFFF' : '#1B262C',
      hover: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
      selected: mode === 'dark' ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.08)',
      disabled: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)',
      disabledBackground: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
      focus: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    },
  },
  typography: {
    htmlFontSize: 16,
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      color: mode === 'dark' ? '#FFFFFF' : '#1B262C',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: mode === 'dark' ? '#FFFFFF' : '#1B262C',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: mode === 'dark' ? '#FFFFFF' : '#1B262C',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: mode === 'dark' ? '#FFFFFF' : '#1B262C',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: mode === 'dark' ? '#FFFFFF' : '#1B262C',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.6,
      color: mode === 'dark' ? '#FFFFFF' : '#1B262C',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.75,
      color: mode === 'dark' ? '#BBE1FA' : '#4169E1',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
      color: mode === 'dark' ? '#BBE1FA' : '#4169E1',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: mode === 'dark' ? '#FFFFFF' : '#1B262C',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.43,
      color: mode === 'dark' ? '#BBE1FA' : '#4169E1',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.75,
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.66,
      color: mode === 'dark' ? '#BBE1FA' : '#4169E1',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: 2.66,
      textTransform: 'uppercase',
      color: mode === 'dark' ? '#BBE1FA' : '#4169E1',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          padding: '8px 16px',
          fontSize: '0.875rem',
          fontWeight: 500,
        },
        contained: {
          background: 'linear-gradient(45deg, #40E0D0 30%, #7FFFD4 90%)',
          color: mode === 'dark' ? '#1B262C' : '#1B262C',
          boxShadow: '0 3px 5px 2px rgba(64, 224, 208, .3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #20B2AA 30%, #40E0D0 90%)',
            boxShadow: '0 3px 5px 2px rgba(64, 224, 208, .5)',
          },
        },
        outlined: {
          borderColor: '#40E0D0',
          color: mode === 'dark' ? '#40E0D0' : '#20B2AA',
          '&:hover': {
            borderColor: '#7FFFD4',
            backgroundColor: 'rgba(64, 224, 208, 0.08)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            color: mode === 'dark' ? '#FFFFFF' : '#1B262C',
            '& fieldset': {
              borderColor: mode === 'dark' ? 'rgba(64, 224, 208, 0.2)' : 'rgba(64, 224, 208, 0.4)',
            },
            '&:hover fieldset': {
              borderColor: '#40E0D0',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#40E0D0',
            },
          },
          '& .MuiInputLabel-root': {
            color: mode === 'dark' ? '#BBE1FA' : '#4169E1',
            '&.Mui-focused': {
              color: '#40E0D0',
            },
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: mode === 'dark' ? '#FFFFFF' : '#1B262C',
        },
        input: {
          '&::placeholder': {
            color: mode === 'dark' ? '#BBE1FA' : '#4169E1',
            opacity: 0.7,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: mode === 'dark' ? '#BBE1FA' : '#4169E1',
          '&.Mui-focused': {
            color: '#40E0D0',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: mode === 'dark' ? '#BBE1FA' : '#4169E1',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: mode === 'dark' ? '#FFFFFF' : '#1B262C',
          '&:hover': {
            backgroundColor: 'rgba(64, 224, 208, 0.08)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(64, 224, 208, 0.16)',
            '&:hover': {
              backgroundColor: 'rgba(64, 224, 208, 0.24)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? '#222E3C' : '#FFFFFF',
          borderRadius: 16,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${mode === 'dark' ? 'rgba(64, 224, 208, 0.1)' : 'rgba(64, 224, 208, 0.2)'}`,
          '&:hover': {
            boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)',
            border: `1px solid ${mode === 'dark' ? 'rgba(64, 224, 208, 0.2)' : 'rgba(64, 224, 208, 0.3)'}`,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
          backgroundColor: mode === 'dark' ? '#222E3C' : '#F8FAFC',
          color: mode === 'dark' ? '#FFFFFF' : '#1B262C',
        },
        filled: {
          '&.MuiChip-colorPrimary': {
            background: 'linear-gradient(45deg, #40E0D0 30%, #7FFFD4 90%)',
            color: '#1B262C',
          },
          '&.MuiChip-colorSecondary': {
            background: 'linear-gradient(45deg, #4169E1 30%, #6495ED 90%)',
            color: '#FFFFFF',
          },
        },
        outlined: {
          borderColor: '#40E0D0',
          color: mode === 'dark' ? '#40E0D0' : '#20B2AA',
          '&:hover': {
            backgroundColor: 'rgba(64, 224, 208, 0.08)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? '#222E3C' : '#FFFFFF',
          borderRadius: 16,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: mode === 'dark' ? '1px solid rgba(64, 224, 208, 0.1)' : '1px solid rgba(64, 224, 208, 0.2)',
          color: mode === 'dark' ? '#FFFFFF' : '#1B262C',
        },
        head: {
          fontWeight: 600,
          backgroundColor: mode === 'dark' ? '#1B262C' : '#F8FAFC',
          color: mode === 'dark' ? '#BBE1FA' : '#4169E1',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: mode === 'dark' ? 'rgba(64, 224, 208, 0.08)' : 'rgba(64, 224, 208, 0.04)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? '#1B262C' : '#FFFFFF',
          borderBottom: `1px solid ${mode === 'dark' ? 'rgba(64, 224, 208, 0.1)' : 'rgba(64, 224, 208, 0.2)'}`,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: mode === 'dark' ? '#40E0D0' : '#20B2AA',
          '&:hover': {
            backgroundColor: 'rgba(64, 224, 208, 0.08)',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: mode === 'dark' ? '#FFFFFF' : '#1B262C',
        },
      },
    },
  },
});

export const darkTheme = createTheme(getDesignTokens('dark'));
export const lightTheme = createTheme(getDesignTokens('light'));

export default darkTheme; 
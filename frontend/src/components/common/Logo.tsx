import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

const Logo = ({ size = 'medium' }: LogoProps) => {
  const theme = useTheme();
  
  // Define sizes for different variants
  const sizes = {
    small: {
      height: 32,
      fontSize: '1.2rem',
      iconSize: 40,
    },
    medium: {
      height: 40,
      fontSize: '1.75rem',
      iconSize: 48,
    },
    large: {
      height: 48,
      fontSize: '2.25rem',
      iconSize: 64,
    },
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: sizes[size].iconSize,
          width: sizes[size].iconSize * 1.2,
          filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.15))',
        }}
      >
        {/* Background chat bubble */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '15%',
            right: '5%',
            width: '60%',
            height: '60%',
            borderRadius: '12px',
            transform: 'rotate(-10deg)',
            background: theme.palette.warning.main,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            '&::before': {
              content: '""',
              position: 'absolute',
              bottom: '-20%',
              right: '20%',
              width: '30%',
              height: '30%',
              background: theme.palette.warning.main,
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              transform: 'rotate(-45deg)',
            },
          }}
        />
        
        {/* Foreground chat bubble */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '70%',
            height: '70%',
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            boxShadow: `0 6px 12px ${theme.palette.primary.main}40`,
            '&::before': {
              content: '""',
              position: 'absolute',
              bottom: '-15%',
              left: '20%',
              width: '30%',
              height: '30%',
              background: theme.palette.primary.main,
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              transform: 'rotate(45deg)',
            },
            // Chat bubble lines
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '60%',
              height: '60%',
              backgroundImage: `
                linear-gradient(${theme.palette.primary.light}, ${theme.palette.primary.light}),
                linear-gradient(${theme.palette.primary.light}, ${theme.palette.primary.light}),
                linear-gradient(${theme.palette.primary.light}, ${theme.palette.primary.light})
              `,
              backgroundSize: '100% 2px, 100% 2px, 100% 2px',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '0 20%, 0 50%, 0 80%',
              opacity: 0.7,
            },
          }}
        />
      </Box>
      <Typography
        variant="h4"
        component="span"
        sx={{
          fontSize: sizes[size].fontSize,
          fontWeight: 800,
          letterSpacing: '-0.5px',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -4,
            left: 0,
            width: '100%',
            height: 2,
            background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}40, transparent)`,
            borderRadius: 2,
          }
        }}
      >
        SpeakUp
      </Typography>
    </Box>
  );
};

export default Logo; 
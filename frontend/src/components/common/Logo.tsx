import { Box, Typography } from '@mui/material';
import { Forum as ForumIcon } from '@mui/icons-material';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const Logo = ({ size = 'medium', showText = true }: LogoProps) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { icon: 24, text: '1.25rem' };
      case 'large':
        return { icon: 48, text: '2rem' };
      default:
        return { icon: 32, text: '1.5rem' };
    }
  };

  const dimensions = getSize();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: dimensions.icon + 16,
          height: dimensions.icon + 16,
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #40E0D0 0%, #4169E1 100%)',
          boxShadow: '0 4px 10px rgba(64, 224, 208, 0.3)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)',
          }
        }}
      >
        <ForumIcon
          sx={{
            fontSize: dimensions.icon,
            color: '#FFFFFF',
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
          }}
        />
      </Box>
      {showText && (
        <Typography
          variant="h6"
          sx={{
            fontSize: dimensions.text,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #40E0D0 0%, #4169E1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          Web App
        </Typography>
      )}
    </Box>
  );
};

export default Logo; 
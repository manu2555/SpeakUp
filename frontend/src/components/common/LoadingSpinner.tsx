import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner = ({ message, fullScreen = false }: LoadingSpinnerProps) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullScreen ? '100vh' : '200px',
        width: '100%',
      }}
    >
      <CircularProgress size={40} />
      {message && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner; 
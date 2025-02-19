import { Box, Typography, Paper, useTheme } from '@mui/material';
import CountUp from 'react-countup';

interface AnimatedCounterProps {
  value: number;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  duration?: number;
}

const AnimatedCounter = ({ 
  value, 
  label, 
  icon, 
  color,
  duration = 2.5 
}: AnimatedCounterProps) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        borderRadius: 2,
        bgcolor: color || theme.palette.primary.light + '20',
        borderLeft: 6,
        borderColor: color || theme.palette.primary.main,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {icon && (
          <Box sx={{ color: color || theme.palette.primary.main }}>
            {icon}
          </Box>
        )}
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h4" 
            component="div"
            sx={{ 
              fontWeight: 700,
              color: color || theme.palette.primary.main,
              mb: 0.5
            }}
          >
            <CountUp 
              end={value} 
              duration={duration}
              separator=","
              useEasing={true}
            />
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            {label}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default AnimatedCounter; 
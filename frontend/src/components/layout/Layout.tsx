import { ReactNode } from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      width: '100vw',
      overflow: 'hidden'
    }}>
      <Navbar />
      <Box 
        component="main" 
        sx={{ 
          flex: 1,
          width: '100%',
          bgcolor: 'background.default'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 
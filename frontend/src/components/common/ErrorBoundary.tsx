import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { withTranslation, WithTranslation } from 'react-i18next';

interface Props extends WithTranslation {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    const { t } = this.props;

    if (this.state.hasError) {
      return (
        <Container maxWidth="sm">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              {t('errors.somethingWentWrong')}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {t('errors.tryReloading')}
            </Typography>
            {process.env.NODE_ENV === 'development' && (
              <Typography
                variant="body2"
                color="error"
                sx={{ mb: 2, maxWidth: '100%', overflow: 'auto' }}
              >
                {this.state.error?.toString()}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleReload}
            >
              {t('errors.reload')}
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary); 
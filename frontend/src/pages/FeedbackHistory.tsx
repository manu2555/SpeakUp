import { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Collapse,
  Typography,
  Paper,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Alert,
  Button,
  Grid,
  Card,
  CardContent,
  Tooltip,
  Container,
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  Feedback as FeedbackIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getFeedbacks } from '../store/slices/feedbackSlice';
import { Feedback } from '../types';

interface RowProps {
  feedback: Feedback;
  isEvenRow: boolean;
}

const Row = ({ feedback, isEvenRow }: RowProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getTypeChipColor = (type: string) => {
    switch (type) {
      case 'COMPLAINT':
        return {
          bgcolor: '#BBE1FA',
          color: '#1B262C'
        };
      case 'SUGGESTION':
        return {
          bgcolor: '#BBE1FA',
          color: '#0F4C75'
        };
      case 'ENQUIRE':
        return {
          bgcolor: '#BBE1FA',
          color: '#3282B8'
        };
      default:
        return {
          bgcolor: '#BBE1FA',
          color: '#1B262C'
        };
    }
  };

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          bgcolor: '#BBE1FA',
          color: '#1B262C'
        };
      case 'IN_PROGRESS':
        return {
          bgcolor: '#BBE1FA',
          color: '#0F4C75'
        };
      case 'RESOLVED':
        return {
          bgcolor: '#BBE1FA',
          color: '#3282B8'
        };
      case 'REJECTED':
        return {
          bgcolor: '#BBE1FA',
          color: '#1B262C'
        };
      default:
        return {
          bgcolor: '#BBE1FA',
          color: '#1B262C'
        };
    }
  };

  return (
    <>
      <TableRow 
        sx={{ 
          '& > *': { borderBottom: 'unset' },
          backgroundColor: isEvenRow ? 'rgba(0, 0, 0, 0.02)' : 'inherit',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        <TableCell padding="checkbox">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{ 
              transition: 'transform 0.2s',
              transform: open ? 'rotate(-180deg)' : 'rotate(0)',
            }}
          >
            <KeyboardArrowDownIcon />
          </IconButton>
        </TableCell>
        <TableCell 
          component="th" 
          scope="row"
          sx={{
            maxWidth: { xs: 120, sm: 200, md: 300 },
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {feedback.subject}
        </TableCell>
        <TableCell>
          <Chip
            label={t(`feedback.types.${feedback.type}`)}
            sx={{ 
              minWidth: 90,
              bgcolor: getTypeChipColor(feedback.type).bgcolor,
              color: getTypeChipColor(feedback.type).color,
              '&:hover': {
                bgcolor: getTypeChipColor(feedback.type).bgcolor,
                opacity: 0.9
              }
            }}
            size={isMobile ? "small" : "medium"}
          />
        </TableCell>
        <TableCell>
          <Chip
            label={t(`departments.${feedback.department.toLowerCase()}`)}
            variant="outlined"
            sx={{ 
              minWidth: 100,
              borderColor: '#3282B8',
              color: '#3282B8',
              '&:hover': {
                borderColor: '#0F4C75',
                color: '#0F4C75'
              }
            }}
            size={isMobile ? "small" : "medium"}
          />
        </TableCell>
        <TableCell>
          <Chip
            label={t(`agencies.${feedback.department.toLowerCase()}.${feedback.agency.toLowerCase()}`)}
            variant="outlined"
            sx={{ 
              minWidth: 100,
              borderColor: '#3282B8',
              color: '#3282B8',
              '&:hover': {
                borderColor: '#0F4C75',
                color: '#0F4C75'
              }
            }}
            size={isMobile ? "small" : "medium"}
          />
        </TableCell>
        <TableCell>
          <Chip
            label={t(`feedback.statuses.${feedback.status}`)}
            sx={{ 
              minWidth: 90,
              bgcolor: getStatusChipColor(feedback.status).bgcolor,
              color: getStatusChipColor(feedback.status).color,
              '&:hover': {
                bgcolor: getStatusChipColor(feedback.status).bgcolor,
                opacity: 0.9
              }
            }}
            size={isMobile ? "small" : "medium"}
          />
        </TableCell>
        <TableCell>
          {feedback.created_at ? new Date(feedback.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) : 'N/A'}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ 
              margin: 2,
              padding: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              borderRadius: 1,
            }}>
              <Typography variant="h6" gutterBottom component="div" color="primary">
                {t('feedback.details')}
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {feedback.description}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const FeedbackHistory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { feedbacks, isLoading } = useAppSelector((state) => state.feedback);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    dispatch(getFeedbacks());
  }, [dispatch]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getFeedbackStats = () => {
    const stats = {
      total: feedbacks.length,
      pending: feedbacks.filter((f: Feedback) => f.status === 'PENDING').length,
      inProgress: feedbacks.filter((f: Feedback) => f.status === 'IN_PROGRESS').length,
      resolved: feedbacks.filter((f: Feedback) => f.status === 'RESOLVED').length,
      complaints: feedbacks.filter((f: Feedback) => f.type === 'COMPLAINT').length,
      suggestions: feedbacks.filter((f: Feedback) => f.type === 'SUGGESTION').length,
      enquiries: feedbacks.filter((f: Feedback) => f.type === 'ENQUIRE').length,
    };
    return stats;
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const stats = getFeedbackStats();

  return (
    <Box 
      sx={{ 
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        bgcolor: 'background.default',
        px: { xs: 2, sm: 3, md: 4 },
        py: 4
      }}
    >
      <Container maxWidth={false}>
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 },
          mb: 4,
          width: '100%'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            width: { xs: '100%', sm: 'auto' }
          }}>
            <Typography 
              variant="h5" 
              component="h1" 
              color="primary.main"
              sx={{ 
                fontSize: { xs: '1.2rem', sm: '1.4rem' },
                flex: { xs: 1, sm: 'none' }
              }}
            >
              {t('common.dashboard')}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/feedback')}
            sx={{ 
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            {t('feedback.submitNew')}
          </Button>
        </Box>

        {/* Stats and Overview Section */}
        <Grid container spacing={3} sx={{ mb: 3, width: '100%' }}>
          {/* Total Stats */}
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ 
              bgcolor: '#BBE1FA',
              height: '100%',
              width: '100%'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BarChartIcon sx={{ color: '#1B262C' }} />
                  <Typography variant="h6" sx={{ color: '#1B262C' }}>
                    {t('common.total')}
                  </Typography>
                  <Typography variant="h4" sx={{ ml: 'auto', color: '#1B262C', fontWeight: 600 }}>
                    {stats.total}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Type Distribution */}
          {[
            { type: 'COMPLAINT', count: stats.complaints, color: '#1B262C' },
            { type: 'SUGGESTION', count: stats.suggestions, color: '#1B262C' },
            { type: 'ENQUIRE', count: stats.enquiries, color: '#1B262C' }
          ].map((item) => (
            <Grid item xs={12} sm={6} lg={3} key={item.type}>
              <Card sx={{ 
                bgcolor: '#BBE1FA',
                height: '100%',
                width: '100%'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500, color: item.color }}>
                      {t(`feedback.types.${item.type}`)}
                    </Typography>
                    <Typography variant="h5" sx={{ ml: 'auto', fontWeight: 600 }}>
                      {item.count}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Status Overview */}
        <Grid container spacing={3} sx={{ mb: 3, width: '100%' }}>
          {[
            { status: 'PENDING', count: stats.pending, color: '#1B262C', bgcolor: '#BBE1FA' },
            { status: 'IN_PROGRESS', count: stats.inProgress, color: '#0F4C75', bgcolor: '#BBE1FA' },
            { status: 'RESOLVED', count: stats.resolved, color: '#3282B8', bgcolor: '#BBE1FA' }
          ].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.status}>
              <Card sx={{ 
                height: '100%',
                width: '100%',
                bgcolor: item.bgcolor,
                borderLeft: 6,
                borderColor: item.color
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ color: item.color, fontWeight: 500 }}>
                      {t(`feedback.statuses.${item.status}`)}
                    </Typography>
                    <Typography variant="h5" sx={{ ml: 'auto', color: item.color, fontWeight: 600 }}>
                      {item.count}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Table Section */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: 1,
            borderColor: 'divider',
            width: '100%'
          }}>
            <Typography variant="h6" color="primary.main">
              {t('feedback.list')}
            </Typography>
            <Tooltip title={t('common.filter')}>
              <IconButton color="primary" size="small">
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <TableContainer sx={{ maxHeight: 'calc(100vh - 500px)', width: '100%' }}>
            <Table stickyHeader size="small" sx={{ width: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" sx={{ width: 40 }} />
                  <TableCell sx={{ width: '25%' }}>{t('feedback.subject')}</TableCell>
                  <TableCell sx={{ width: '15%' }}>{t('feedback.type')}</TableCell>
                  <TableCell sx={{ width: '15%' }}>{t('feedback.department')}</TableCell>
                  <TableCell sx={{ width: '15%' }}>{t('feedback.agency')}</TableCell>
                  <TableCell sx={{ width: '15%' }}>{t('feedback.statusLabel')}</TableCell>
                  <TableCell sx={{ width: '15%' }}>{t('feedback.date')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? feedbacks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : feedbacks
                ).map((feedback: Feedback, index: number) => (
                  <Row 
                    key={feedback.id} 
                    feedback={feedback} 
                    isEvenRow={index % 2 === 0}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={feedbacks.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={t('common.rowsPerPage')}
            sx={{ width: '100%' }}
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default FeedbackHistory;
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
  Link,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Snackbar,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  Feedback as FeedbackIcon,
  AttachFile as AttachFileIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Share as ShareIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getFeedbacks, deleteFeedback } from '../store/slices/feedbackSlice';
import { Feedback } from '../types';

interface RowProps {
  feedback: Feedback;
  isEvenRow: boolean;
}

const Row = ({ feedback, isEvenRow }: RowProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [shareMenuAnchor, setShareMenuAnchor] = useState<null | HTMLElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
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
          color: '#1B262C'
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

  const getDepartmentName = (department: string) => {
    return t(`feedback.departments.${department.toLowerCase()}`);
  };

  const getAgencyName = (department: string, agencyCode: string) => {
    return t(`feedback.agencies.${department.toLowerCase()}.${agencyCode.toLowerCase()}`);
  };

  const getFileUrl = (fileName: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8888';
    return `${apiUrl}/uploads/${fileName}`;
  };

  const handleEdit = () => {
    navigate(`/feedback/edit/${feedback.id}`, { state: { feedback } });
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteFeedback(feedback.id)).unwrap();
      setSnackbarMessage(t('feedback.deleteSuccess'));
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage(t('feedback.deleteError'));
      setSnackbarOpen(true);
    }
    setDeleteDialogOpen(false);
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(feedback.subject);
    const body = encodeURIComponent(`
${feedback.description}

---
${t('feedback.emailFooter')}
${t('feedback.emailSignature')}
    `);
    
    let mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    
    // Add attachments if present
    if (feedback.file_paths && feedback.file_paths.length > 0) {
      const attachments = feedback.file_paths.map(path => getFileUrl(path)).join(',');
      mailtoLink += `&attachment=${encodeURIComponent(attachments)}`;
    }
    
    window.location.href = mailtoLink;
    setEmailDialogOpen(false);
  };

  const handleSocialShare = (platform: string) => {
    const url = window.location.href;
    const text = encodeURIComponent(`${feedback.subject} - ${feedback.description}`);
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShareMenuAnchor(null);
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
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
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
          {getDepartmentName(feedback.department)}
        </TableCell>
        <TableCell>
          {getAgencyName(feedback.department, feedback.agency)}
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
        <TableCell>
          {feedback.file_paths && feedback.file_paths.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip
                icon={<AttachFileIcon />}
                label={`${feedback.file_paths.length} ${feedback.file_paths.length === 1 ? t('feedback.document') : t('feedback.documents')}`}
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => setOpen(!open)}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              />
            </Box>
          )}
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={t('common.edit')}>
              <IconButton size="small" onClick={handleEdit} color="primary">
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('common.delete')}>
              <IconButton size="small" onClick={() => setDeleteDialogOpen(true)} color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('common.email')}>
              <IconButton size="small" onClick={() => setEmailDialogOpen(true)} color="primary">
                <EmailIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('common.share')}>
              <IconButton size="small" onClick={(e) => setShareMenuAnchor(e.currentTarget)} color="primary">
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
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
              {feedback.file_paths && feedback.file_paths.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom component="div" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachFileIcon fontSize="small" />
                    {t('feedback.documents')}
                  </Typography>
                  <Grid container spacing={1}>
                    {feedback.file_paths.map((filePath, index) => {
                      const fileName = filePath.split('/').pop() || `${t('feedback.document')} ${index + 1}`;
                      const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
                      const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExt);
                      
                      return (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Paper
                            sx={{
                              p: 1,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              bgcolor: 'background.paper',
                              '&:hover': {
                                bgcolor: 'action.hover'
                              }
                            }}
                          >
                            <AttachFileIcon fontSize="small" color="primary" />
                            <Link
                              href={getFileUrl(filePath)}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                textDecoration: 'none',
                                color: 'primary.main',
                                flex: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                '&:hover': {
                                  textDecoration: 'underline'
                                }
                              }}
                            >
                              {fileName}
                            </Link>
                            {isImage && (
                              <Tooltip title={t('feedback.preview')}>
                                <IconButton
                                  size="small"
                                  onClick={() => window.open(getFileUrl(filePath), '_blank')}
                                >
                                  <img 
                                    src={getFileUrl(filePath)} 
                                    alt={fileName}
                                    style={{ 
                                      width: 20, 
                                      height: 20, 
                                      objectFit: 'cover',
                                      borderRadius: 2
                                    }} 
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          {t('feedback.deleteConfirmTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('feedback.deleteConfirmMessage')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Email Share Dialog */}
      <Dialog
        open={emailDialogOpen}
        onClose={() => setEmailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{t('feedback.emailShareTitle')}</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {t('feedback.emailSubject')}
            </Typography>
            <Typography variant="body1">{feedback.subject}</Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {t('feedback.emailBody')}
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {feedback.description}
            </Typography>
          </Box>
          {feedback.file_paths && feedback.file_paths.length > 0 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                {t('feedback.attachments')}
              </Typography>
              <List>
                {feedback.file_paths.map((path, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <AttachFileIcon />
                    </ListItemIcon>
                    <ListItemText primary={path.split('/').pop()} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleEmailShare} color="primary" variant="contained">
            {t('common.send')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Social Share Menu */}
      <Menu
        anchorEl={shareMenuAnchor}
        open={Boolean(shareMenuAnchor)}
        onClose={() => setShareMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleSocialShare('facebook')}>
          <ListItemIcon>
            <FacebookIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Facebook" />
        </MenuItem>
        <MenuItem onClick={() => handleSocialShare('twitter')}>
          <ListItemIcon>
            <TwitterIcon sx={{ color: '#1DA1F2' }} />
          </ListItemIcon>
          <ListItemText primary="Twitter" />
        </MenuItem>
        <MenuItem onClick={() => handleSocialShare('linkedin')}>
          <ListItemIcon>
            <LinkedInIcon sx={{ color: '#0A66C2' }} />
          </ListItemIcon>
          <ListItemText primary="LinkedIn" />
        </MenuItem>
        <MenuItem onClick={() => handleSocialShare('whatsapp')}>
          <ListItemIcon>
            <WhatsAppIcon sx={{ color: '#25D366' }} />
          </ListItemIcon>
          <ListItemText primary="WhatsApp" />
        </MenuItem>
      </Menu>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
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
          {[
            { 
              type: 'TOTAL',
              count: stats.total,
              color: '#0F4C75', 
              bgColor: '#F0F9FF',
              borderColor: '#3282B8',
              icon: <BarChartIcon />
            },
            { 
              type: 'COMPLAINT', 
              count: stats.complaints, 
              color: '#0F4C75', 
              bgColor: '#F0F9FF',
              borderColor: '#3282B8',
              icon: <FeedbackIcon />
            },
            { 
              type: 'SUGGESTION', 
              count: stats.suggestions, 
              color: '#0F4C75', 
              bgColor: '#F0F9FF',
              borderColor: '#3282B8',
              icon: <FeedbackIcon />
            },
            { 
              type: 'ENQUIRE', 
              count: stats.enquiries, 
              color: '#0F4C75', 
              bgColor: '#F0F9FF',
              borderColor: '#3282B8',
              icon: <FeedbackIcon />
            }
          ].map((item) => (
            <Grid item xs={12} sm={6} lg={3} key={item.type}>
              <Card sx={{ 
                bgcolor: item.bgColor,
                height: '100%',
                width: '100%',
                boxShadow: 2,
                borderLeft: 6,
                borderColor: item.borderColor,
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    p: 1
                  }}>
                    <Box sx={{ color: item.color }}>
                      {item.icon}
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        color: item.color,
                        flex: 1
                      }}
                    >
                      {item.type === 'TOTAL' ? t('common.total') : t(`feedback.types.${item.type}`)}
                    </Typography>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700,
                        color: item.color,
                        ml: 2
                      }}
                    >
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
                  <TableCell sx={{ width: '20%' }}>{t('feedback.subject')}</TableCell>
                  <TableCell sx={{ width: '10%' }}>{t('feedback.type')}</TableCell>
                  <TableCell sx={{ width: '10%' }}>{t('feedback.department')}</TableCell>
                  <TableCell sx={{ width: '15%' }}>{t('feedback.agency')}</TableCell>
                  <TableCell sx={{ width: '10%' }}>{t('feedback.statusLabel')}</TableCell>
                  <TableCell sx={{ width: '15%' }}>{t('feedback.date')}</TableCell>
                  <TableCell sx={{ width: '10%' }}>{t('feedback.documents')}</TableCell>
                  <TableCell sx={{ width: '10%' }}>{t('common.actions')}</TableCell>
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
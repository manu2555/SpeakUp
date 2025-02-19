import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  useTheme,
  useMediaQuery,
  Grid,
  Input,
  FormHelperText,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../hooks';
import { createFeedback } from '../store/slices/feedbackSlice';
import { getAgencies } from '../store/slices/agencySlice';

interface FeedbackFormData {
  type: string;
  department: string;
  agency: string;
  subject: string;
  description: string;
}

interface Agency {
  code: string;
  name: string;
}

const FeedbackForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading: feedbackLoading, error } = useAppSelector((state) => state.feedback);
  const { agencies, isLoading: agenciesLoading } = useAppSelector((state) => state.agencies);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState<FeedbackFormData>({
    type: '',
    department: '',
    agency: '',
    subject: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDepartmentChange = (e: SelectChangeEvent) => {
    const department = e.target.value;
    setFormData((prev) => ({
      ...prev,
      department,
      agency: '', // Reset agency when department changes
    }));
    // Fetch agencies for the selected department
    dispatch(getAgencies(department.toLowerCase()));
  };

  const getAgenciesForDepartment = () => {
    if (!formData.department) return [];
    return agencies.map((agency: Agency) => ({
      value: agency.code,
      label: agency.name
    }));
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFiles = (selectedFiles: File[]) => {
    if (selectedFiles.length > 5) {
      setFileError(t('feedback.fileLimitExceeded'));
      return;
    }
    const validFiles = selectedFiles.filter(file => {
      const isValidType = ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5 MB
      return isValidType && isValidSize;
    });
    if (validFiles.length !== selectedFiles.length) {
      setFileError(t('feedback.invalidFile'));
    } else {
      setFileError(null);
    }
    setFiles(validFiles);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setFileError(null);
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') return <PdfIcon color="primary" />;
    if (file.type.startsWith('image/')) return <ImageIcon color="primary" />;
    return <FileIcon color="primary" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Prepare form data with files
    const formDataWithFiles = new FormData();
    formDataWithFiles.append('type', formData.type);
    formDataWithFiles.append('department', formData.department);
    formDataWithFiles.append('agency', formData.agency);
    formDataWithFiles.append('subject', formData.subject);
    formDataWithFiles.append('description', formData.description);
    
    // Append files with the same field name
    files.forEach((file) => {
      formDataWithFiles.append('files', file);
    });

    try {
      const result = await dispatch(createFeedback(formDataWithFiles));
      if (createFeedback.fulfilled.match(result)) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Feedback submission failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const feedbackTypes = [
    { value: 'COMPLAINT', label: t('feedback.types.COMPLAINT') },
    { value: 'SUGGESTION', label: t('feedback.types.SUGGESTION') },
    { value: 'ENQUIRE', label: t('feedback.types.ENQUIRE') },
  ];

  const departments = [
    { value: 'banks', label: t('feedback.departments.banks') },
    { value: 'airlines', label: t('feedback.departments.airlines') },
    { value: 'telecoms', label: t('feedback.departments.telecoms') },
    { value: 'healthcare', label: t('feedback.departments.healthcare') },
    { value: 'government', label: t('feedback.departments.government') },
    { value: 'finance', label: t('feedback.departments.finance') },
    { value: 'entertainment', label: t('feedback.departments.entertainment') },
    { value: 'railways', label: t('feedback.departments.railways') },
  ];

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
        <Box sx={{ 
          maxWidth: 'md',
          mx: 'auto',
          width: '100%'
        }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              component="h1"
              color="primary.main"
            >
              {t('feedback.submitNew')}
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="type-label">{t('feedback.type')}</InputLabel>
                  <Select
                    labelId="type-label"
                    name="type"
                    value={formData.type}
                    label={t('feedback.type')}
                    onChange={handleSelectChange}
                    required
                    disabled={submitting}
                  >
                    {feedbackTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="department-label">{t('feedback.department')}</InputLabel>
                  <Select
                    labelId="department-label"
                    name="department"
                    value={formData.department}
                    label={t('feedback.department')}
                    onChange={handleDepartmentChange}
                    required
                    disabled={submitting}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="agency-label">{t('feedback.agency')}</InputLabel>
                  <Select
                    labelId="agency-label"
                    name="agency"
                    value={formData.agency}
                    label={t('feedback.agency')}
                    onChange={handleSelectChange}
                    required
                    disabled={!formData.department || submitting || agenciesLoading}
                  >
                    {getAgenciesForDepartment().map((agency: { value: string; label: string }) => (
                      <MenuItem key={agency.value} value={agency.value}>
                        {agency.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('feedback.subject')}
                  name="subject"
                  value={formData.subject}
                  onChange={handleTextFieldChange}
                  required
                  variant="outlined"
                  disabled={submitting}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('feedback.description')}
                  name="description"
                  value={formData.description}
                  onChange={handleTextFieldChange}
                  required
                  multiline
                  rows={4}
                  variant="outlined"
                  disabled={submitting}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography 
                  variant="subtitle1" 
                  color="text.primary" 
                  sx={{ 
                    mb: 1,
                    fontWeight: 500 
                  }}
                >
                  {t('feedback.uploadDocuments')}
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    border: '2px dashed',
                    borderColor: theme.palette.primary.main,
                    borderRadius: 1,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: theme.palette.primary.dark,
                      bgcolor: 'action.hover',
                    },
                  }}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                      p: 3,
                    }}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <label htmlFor="file-upload" style={{ width: '100%', textAlign: 'center' }}>
                      <CloudUploadIcon
                        sx={{
                          fontSize: 48,
                          color: theme.palette.primary.main,
                          mb: 1,
                        }}
                      />
                      <Typography 
                        variant="body1" 
                        color="text.secondary" 
                        align="center" 
                        sx={{ mb: 2 }}
                      >
                        {t('feedback.fileUploadHint')}
                      </Typography>
                      <Button
                        variant="contained"
                        component="span"
                        disabled={submitting}
                        startIcon={<CloudUploadIcon />}
                      >
                        {t('feedback.chooseFiles')}
                      </Button>
                    </label>
                  </Box>
                </Paper>

                {fileError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {fileError}
                  </Alert>
                )}

                {files.length > 0 && (
                  <Paper variant="outlined" sx={{ mt: 2 }}>
                    <List sx={{ py: 0 }}>
                      {files.map((file, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            borderBottom: index < files.length - 1 ? '1px solid' : 'none',
                            borderColor: 'divider',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                            {getFileIcon(file)}
                            <ListItemText
                              primary={file.name}
                              secondary={formatFileSize(file.size)}
                              sx={{
                                '& .MuiListItemText-primary': {
                                  fontWeight: 500,
                                },
                              }}
                            />
                          </Box>
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              onClick={() => removeFile(index)}
                              disabled={submitting}
                              color="error"
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                )}
              </Grid>

              <Grid item xs={12}>
                <Box 
                  sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                    mt: 2
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    disabled={submitting}
                    sx={{ minWidth: 120 }}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                    sx={{ minWidth: 120 }}
                  >
                    {submitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      t('common.submit')
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default FeedbackForm; 
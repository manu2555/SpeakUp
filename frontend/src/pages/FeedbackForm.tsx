import { useState } from 'react';
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
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../hooks';
import { createFeedback } from '../store/slices/feedbackSlice';

interface FeedbackFormData {
  type: string;
  department: string;
  agency: string;
  subject: string;
  description: string;
}

const FeedbackForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.feedback);
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
  };

  const getAgenciesForDepartment = () => {
    if (!formData.department) return [];
    
    const departmentKey = formData.department.toLowerCase();
    const agencies = t(`agencies.${departmentKey}`, { returnObjects: true }) as Record<string, string>;
    
    return Object.entries(agencies).map(([value, label]) => ({
      value: value.toUpperCase(),
      label
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const result = await dispatch(createFeedback(formData));
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
    { value: 'BANKS', label: t('departments.banks') },
    { value: 'AIRLINES', label: t('departments.airlines') },
    { value: 'TELECOMS', label: t('departments.telecoms') },
    { value: 'HEALTHCARE', label: t('departments.healthcare') },
    { value: 'GOVERNMENT', label: t('departments.government') },
    { value: 'FINANCE', label: t('departments.finance') },
    { value: 'ENTERTAINMENT', label: t('departments.entertainment') },
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
                  <InputLabel id="agency-label">Agency</InputLabel>
                  <Select
                    labelId="agency-label"
                    name="agency"
                    value={formData.agency}
                    label="Agency"
                    onChange={handleSelectChange}
                    required
                    disabled={!formData.department || submitting}
                  >
                    {getAgenciesForDepartment().map((agency) => (
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
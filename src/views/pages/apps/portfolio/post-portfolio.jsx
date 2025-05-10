import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  Alert
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useGetCategories } from '../../../../api/category';
import { useGetClients } from '../../../../api/client';
import axios from 'axios';
import { createPortfolio } from '../../../../api/portfolio';
import { useGetTags } from '../../../../api/tag';
import MainCard from '../../../../ui-component/MainCard';

const PostPortfolioPage = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category_id: '',
    client_id: '',
    start_date: '',
    end_date: '',
    budget: '',
    live_url: '',
    repo_url: '',
    technologies: [],
    status: 'In Progress',
    portfolio_image: null,
    tag_ids: []
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { categories } = useGetCategories();
  const { clients } = useGetClients();
  const navigate = useNavigate();
  const { tags } = useGetTags();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const handleFileChange = (e) => {
    setForm((prev) => ({
      ...prev,
      portfolio_image: e.target.files[0]
    }));
  };

  const handleSubmit = async () => {
    const requiredFields = ['title', 'description', 'category_id', 'client_id', 'technologies', 'portfolio_image'];
    const missingFields = requiredFields.filter((field) => !form[field]);

    if (missingFields.length > 0) {
      setError('Please fill all required fields');
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'technologies') {
        formData.append('technologies', JSON.stringify(value));
      } else if (key === 'portfolio_image' && value) {
        formData.append('portfolio_image', value);
      } else if (key === 'tag_ids') {
        value.forEach((id) => {
          formData.append('tag_ids[]', id);
        });
      } else {
        formData.append(key, value);
      }
    });

    try {
      setLoading(true);
      const response = await createPortfolio(formData);

      if (response.data.status) {
        setSuccess('Portfolio Created Successfully');
        setTimeout(() => {
          navigate('/portfolios');
        }, 2000);
      }
    } catch (error) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainCard title="Post New Portfolio">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <label htmlFor="portfolio-image-upload">
            <input accept="image/*" id="portfolio-image-upload" type="file" hidden onChange={handleFileChange} />
            <Box
              component="span"
              sx={{
                width: '100%',
                height: 164,
                border: '2px dashed #90CAF9',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: '#f5faff',
                transition: '0.3s',
                '&:hover': {
                  backgroundColor: '#e3f2fd'
                }
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <CloudUpload color="primary" fontSize="large" />
                <Typography color="textSecondary" sx={{ fontSize: 18 }}>
                  Upload Portfolio Image <span style={{ color: 'red' }}>*</span>
                </Typography>
                {form.portfolio_image && (
                  <Typography color="textPrimary" ml={2}>
                    {form.portfolio_image.name}
                  </Typography>
                )}
              </Box>
            </Box>
          </label>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField fullWidth label={'Title *'} name="title" value={form.title} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Description *"
            name="description"
            value={form.description}
            onChange={handleChange}
            multiline
            rows={4}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            multiple
            id="tags-autocomplete"
            options={tags}
            getOptionLabel={(option) => option.tag_name}
            value={tags.filter((tag) => form.tag_ids?.includes(tag.tag_id))}
            onChange={(event, newValue) => {
              setForm((prev) => ({
                ...prev,
                tag_ids: newValue.map((tag) => tag.tag_id)
              }));
            }}
            isOptionEqualToValue={(option, value) => option.tag_id === value.tag_id}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip variant="outlined" label={option.tag_name} {...getTagProps({ index })} key={option.tag_id} />
              ))
            }
            filterOptions={(options, state) => {
              const filtered = options.filter((option) => option.tag_name.toLowerCase().includes(state.inputValue.toLowerCase()));
              return filtered.slice(0, 5);
            }}
            renderInput={(params) => <TextField {...params} variant="outlined" label="Tags" placeholder="Select tags" />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <Autocomplete
              disablePortal
              value={categories.find((cat) => cat.category_id === form.category_id) || null}
              onChange={(event, newValue) => handleChange({ target: { name: 'category_id', value: newValue?.category_id } })}
              options={categories}
              getOptionLabel={(option) => option.category_name}
              isOptionEqualToValue={(option, value) => option.category_id === value.category_id}
              renderInput={(params) => <TextField {...params} label="Category *" />}
              filterOptions={(options, state) => {
                const filtered = options.filter((option) => option.category_name.toLowerCase().includes(state.inputValue.toLowerCase()));
                return filtered.slice(0, 5);
              }}
              sx={{ width: '100%' }}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Client *</InputLabel>
            <Select name="client_id" value={form.client_id} onChange={handleChange} label="Client">
              {clients.map((client) => (
                <MenuItem key={client.client_id} value={client.client_id}>
                  {client.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Start Date"
            name="start_date"
            type="date"
            value={form.start_date}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="End Date"
            name="end_date"
            type="date"
            value={form.end_date}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Budget" name="budget" value={form.budget} onChange={handleChange} type="text" />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Live URL" name="live_url" value={form.live_url} onChange={handleChange} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Repo URL" name="repo_url" value={form.repo_url} onChange={handleChange} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            multiple
            freeSolo
            id="technologies-autocomplete"
            options={[]}
            value={form.technologies}
            onChange={(event, newValue) => {
              setForm((prev) => ({
                ...prev,
                technologies: newValue
              }));
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} key={index} />)
            }
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Technologies *" placeholder="Enter and press Enter" />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select name="status" value={form.status} onChange={handleChange} label="Status">
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Draft">Draft</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {error && (
          <Alert sx={{ marginTop: 1 }} severity="error">
            {error}
          </Alert>
        )}

        {success && (
          <Alert sx={{ marginTop: 1 }} severity="success">
            {success}
          </Alert>
        )}

        <Grid item xs={12}>
          <Button variant="contained" sx={{ bgcolor: 'blue' }} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Posting...' : 'Post Portfolio'}
          </Button>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default PostPortfolioPage;

import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Autocomplete,
  Alert
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { CloudUpload } from '@mui/icons-material';
import { useGetTags } from '../../../../api/tag';
import { useGetCategories } from '../../../../api/category';
import useAuth from '../../../../hooks/useAuth';
import { createBlog } from '../../../../api/blog';
import MainCard from '../../../../ui-component/MainCard';

const Input = styled('input')({
  display: 'none'
});

const PostBlogPage = () => {
  const [form, setForm] = useState({
    author_id: '',
    status: 'Published',
    title: '',
    content: '',
    slug: '',
    category_id: '',
    tag_ids: []
  });

  const [blogImage, setBlogImage] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categories } = useGetCategories();
  const { tags } = useGetTags();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  useEffect(() => {
    setForm((prev) => ({ ...prev, author_id: user.user_id }));
  }, [user]);

  const handleFileChange = (e) => {
    setBlogImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key === 'tag_ids') {
        value.forEach((tag) => formData.append('tag_ids[]', tag));
      } else {
        formData.append(key, value);
      }
    });
    if (!blogImage) {
      setError(`Blog Image is required, Please Upload`);
      return;
    }
    formData.append('blog_image', blogImage);

    const requiredFields = ['title', 'content', 'status', 'category_id', 'tag_ids'];
    const missingFields = requiredFields.filter((field) => !form[field] || (Array.isArray(form[field]) && form[field].length === 0));

    if (missingFields.length > 0) {
      setError(`Please fill all required fields`);
      setLoading(false);
      setTimeout(() => {
        setError('');
      }, 2000);
      return;
    }
    try {
      setLoading(true);
      const response = await createBlog(formData);

      if (response.success) {
        setSuccess('Blog Posted Successfully');
        setTimeout(() => {
          navigate('/blogs');
        }, 2000);
      }
    } catch (err) {
      setError(error.error || error.message || 'Something want wrong, Please try again later');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  // Filter categories based on search query
  // const filteredCategories = categories.filter((cat) => cat.category_name.toLowerCase().includes(search.toLowerCase())).slice(0, 5); // Limit to 5 results
  return (
    <MainCard title="Post New Blog">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <label htmlFor="blog-image-upload">
            <Input accept="image/*" id="blog-image-upload" type="file" onChange={handleFileChange} />
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
                  Upload Blog Image *
                </Typography>
                {blogImage && (
                  <Typography color="textPrimary" ml={2}>
                    {blogImage.name}
                  </Typography>
                )}
              </Box>
            </Box>
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              Image must be 1MB or less.
            </Typography>
          </label>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Title *" name="title" value={form.title} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Slug" name="slug" value={form.slug} onChange={handleChange} />
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
            renderInput={(params) => <TextField {...params} variant="outlined" label="Tags *" placeholder="Select tags" />}
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
              // Limit search results to top 5
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
            <InputLabel>Status</InputLabel>
            <Select name="status" value={form.status} label="Status" onChange={handleChange}>
              <MenuItem value="Published">Published</MenuItem>
              <MenuItem value="Draft">Draft</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField fullWidth label="Content *" name="content" value={form.content} onChange={handleChange} multiline minRows={4} />
        </Grid>

        {success && (
          <Alert sx={{ marginTop: 1 }} severity="success">
            {success}
          </Alert>
        )}
        {error && (
          <Alert sx={{ marginTop: 1 }} severity="error">
            {error}
          </Alert>
        )}

        <Grid item xs={12}>
          <Button variant="contained" sx={{ bgcolor: 'blue' }} onClick={handleSubmit} disabled={loading || success}>
            {loading ? 'Posting...' : 'Post Blog'}
          </Button>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default PostBlogPage;

import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, Button, Card, CardMedia, CardContent, Typography, IconButton, Avatar } from '@mui/material';
import { Add, ArrowForward } from '@mui/icons-material';
import { IconCalendarWeek, IconTrash, IconEdit, IconEyeDotted } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router';
import { useGetAdminBlogs } from '../../../../api/blog';
import AlertBlogDelete from '../../../../components/blog/AlertBlogDelete';
import NoData from '../../../errors/noData';
import AnimateButton from '../../../../ui-component/extended/AnimateButton';

const BlogListPage = () => {
  const [search, setSearch] = useState('');
  const { blogs, loading } = useGetAdminBlogs();
  const navigate = useNavigate();

  const [blogDeleteId, setBlogDeleteId] = useState('');

  const filteredBlogs = blogs.filter((blog) => blog.title.toLowerCase().includes(search.toLowerCase()));

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(!open);
  };
  return (
    <Box p={3}>
      {/* Top Bar */}
      <Box display="flex" justifyContent="space-between" mb={4}>
        <TextField
          label="Search Blogs"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ width: '50%' }}
        />
        <AnimateButton>
          <Button color="secondary" size="large" startIcon={<Add />} onClick={() => navigate('/post-blog')} variant="contained">
            Post New Blog
          </Button>
        </AnimateButton>
      </Box>

      <Grid container spacing={3}>
        {filteredBlogs.map((blog, index) => (
          // <Grid item xs={12} sm={6} md={4} key={blog.id}>
          //   <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 0 }}>
          //     <CardMedia
          //       component="img"
          //       height="300"
          //       image={`${import.meta.env.VITE_APP_BASE_URL}/public/uploads/images/blog/${blog.image_url}`}
          //       alt={blog.title}
          //     />
          //     <Box
          //       sx={{
          //         borderTopRightRadius: 5,
          //         textAlign: 'center',
          //         bgcolor: 'white',
          //         position: 'relative',
          //         display: 'flex',
          //         justifyContent: 'space-around',
          //         flex: 'row',
          //         gap: 0.2,
          //         left: 0,
          //         bottom: 33,
          //         zIndex: 1,
          //         width: 150,
          //         height: 35,
          //         pt: 1
          //       }}
          //     >
          //       <IconCalendarWeek size={18} color="#FF704A" />
          //       <Typography>
          //         {new Date(blog.created_at).toLocaleDateString('en-GB', {
          //           day: 'numeric',
          //           month: 'long',
          //           year: 'numeric'
          //         })}
          //       </Typography>
          //     </Box>

          //     <CardContent>
          //       <Box
          //         sx={{
          //           display: 'flex',
          //           flex: 'row',
          //           justifyContent: 'space-between',
          //           alignItems: 'center'
          //         }}
          //       >
          //         <Typography sx={{ fontSize: 19 }} variant="h3" noWrap>
          //           <Link style={{ textDecoration: 'none', color: '#080A3C' }}>{blog.title}</Link>
          //         </Typography>
          //       </Box>

          //       <Box display="flex" justifyContent="space-between" alignItems="center" className="post-info" marginTop={3}>
          //         <Box display="flex" alignItems="center" className="post-by">
          //           <Avatar
          //             alt="Author Avatar"
          //             src={`https://avatar.iran.liara.run/username?username=${blog.author_name} `}
          //             sx={{ width: 45, height: 45, marginRight: 2 }}
          //           />
          //           <Typography variant="h6">{blog.author_name}</Typography>
          //         </Box>

          //         <Box className="details-btn">
          //           <a href={`https://bahtaexpress.com/blog/details/${blog.post_id}`} passHref>
          //             <IconButton component="a">
          //               <ArrowForward />
          //             </IconButton>
          //           </a>
          //         </Box>
          //       </Box>
          //       <Box display="flex" justifyContent="flex-start" mt={2} gap={1}>
          //         <a href={`https://bahtaexpress.com/blog/details/${blog.post_id}`}>
          //           <IconButton color="primary" aria-label="view blog">
          //             <IconEyeDotted />
          //           </IconButton>
          //         </a>

          //         <IconButton
          //           color="secondary"
          //           aria-label="edit blog"
          //           onClick={(e) => {
          //             e.stopPropagation();
          //             navigate(`/edit-blog/${blog.post_id}`);
          //           }}
          //         >
          //           <IconEdit />
          //         </IconButton>
          //         <IconButton
          //           onClick={(e) => {
          //             e.stopPropagation();
          //             handleClose();
          //             setBlogDeleteId(blog.blog_id);
          //           }}
          //           color="error"
          //           aria-label="delete blog"
          //         >
          //           <IconTrash />
          //         </IconButton>
          //       </Box>
          //     </CardContent>
          //   </Card>
          // </Grid>
          <Grid item xs={12} md={4} key={index}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                background: 'linear-gradient(to bottom,rgb(255, 255, 255),rgb(237, 238, 240))',
                border: '0.5px solid #E5E7EB',
                borderRadius: 3,
                boxShadow: 1,

                borderColor: '#E5E7EB'
                //
              }}
            >
              <CardMedia
                component="img"
                image={`${import.meta.env.VITE_APP_BASE_URL}/public/uploads/images/blog/${blog.image_url}`}
                alt={blog.title}
                sx={{ borderRadius: 2, mb: 2, objectFit: 'cover', p: 2 }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h4" component="h3" gutterBottom>
                  {blog.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {blog.excerpt}...
                </Typography>
              </CardContent>
              <Box px={2} pb={2} display="flex" justifyContent="start">
                <a
                  href={`https://bahtaexpress.com/blog/detail/${blog.post_id}`}
                  rel="noreferrer"
                  underline="none"
                  color="#FF5823"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: '#FF5823',
                    cursor: 'pointer'
                  }}
                >
                  Read Full Article
                  <svg
                    style={{ marginLeft: 4 }}
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </Box>
              <Box display="flex" justifyContent="space-around" mt={2} gap={1}>
                <a href={`https://bahtaexpress.com/blog/detail/${blog.post_id}`}>
                  <IconButton color="primary" aria-label="view blog">
                    <IconEyeDotted />
                  </IconButton>
                </a>
                <IconButton
                  color="secondary"
                  aria-label="edit blog"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/edit-blog/${blog.post_id}`);
                  }}
                >
                  <IconEdit />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                    setBlogDeleteId(blog.blog_id);
                  }}
                  color="error"
                  aria-label="delete blog"
                >
                  <IconTrash />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}

        {!loading && blogs.length === 0 && <NoData length={blogs.length} loading={loading} message="No Records Found" />}

        <AlertBlogDelete id={Number(blogDeleteId)} title={blogDeleteId} open={open} handleClose={handleClose} />
      </Grid>
    </Box>
  );
};

export default BlogListPage;

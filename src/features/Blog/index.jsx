'use client';

import { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  IconButton,
  Fade,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Favorite, FavoriteBorder, Close } from '@mui/icons-material';
import { useGetBlogsQuery } from 'hookApi/blogApi';

const BlogPage = () => {
  const { data, isLoading } = useGetBlogsQuery();
  const [selectedPost, setSelectedPost] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.up('md'));

  const handleOpenDialog = (post) => {
    setSelectedPost(post);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPost(null);
  };

  const handleLike = (postId) => {
    const newLikedPosts = new Set(likedPosts);
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    setLikedPosts(newLikedPosts);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Blog Thời Trang
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 300 }}>
          Khám phá những xu hướng thời trang mới nhất
        </Typography>
      </Box>

      {/* Blog Posts Grid */}
      {data?.data && data.data.length > 0 ? (
        <Grid container spacing={4}>
          {data.data.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="240"
                  image={post?.image || '/Blog/chup-trai-quan-ao-1-scaled.jpg'}
                  alt={post.title}
                  sx={{
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography
                    variant="h6"
                    component="h2"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      lineHeight: 1.3,
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {post.title}
                  </Typography>
                  {/* <Typography
                    variant="body2"
                    color="text.secondary"
                    paragraph
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.6,
                      mb: 3,
                    }}
                  >
                    {post.content.substring(0, 120)}...
                  </Typography> */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                    <Button
                      variant="contained"
                      onClick={() => handleOpenDialog(post)}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                      }}
                    >
                      Đọc thêm
                    </Button>
                    <IconButton
                      onClick={() => handleLike(post.id)}
                      color={likedPosts.has(post.id) ? 'error' : 'default'}
                      sx={{
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      {likedPosts.has(post.id) ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          Hiện đang không có bài viết nào.
        </Typography>
      )}

      {/* Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={fullScreen} // thêm dòng này
        scroll="paper"
        TransitionComponent={Fade}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            maxHeight: '90vh',
          },
        }}
      >
        {selectedPost && (
          <>
            <DialogTitle sx={{ p: 0, position: 'relative' }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 200, // giảm chiều cao
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box
                  component="img"
                  src={selectedPost.image || '/Blog/istockphoto-533833660-612x612.jpg'}
                  alt={selectedPost.title}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
                <IconButton
                  onClick={handleCloseDialog}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                  }}
                >
                  <Close />
                </IconButton>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    color: 'white',
                    p: 2,
                  }}
                >
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
                    {selectedPost.title}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  fontSize: '1.1rem',
                  color: 'text.primary',
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
              </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <IconButton
                  onClick={() => handleLike(selectedPost.id)}
                  color={likedPosts.has(selectedPost.id) ? 'error' : 'default'}
                  sx={{
                    transform: 'scale(1.2)',
                    '&:hover': {
                      transform: 'scale(1.3)',
                    },
                  }}
                >
                  {likedPosts.has(selectedPost.id) ? <Favorite /> : <FavoriteBorder />}
                </IconButton>

                <Button
                  onClick={handleCloseDialog}
                  variant="contained"
                  size="large"
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 4,
                  }}
                >
                  Đóng
                </Button>
              </Box>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default BlogPage;

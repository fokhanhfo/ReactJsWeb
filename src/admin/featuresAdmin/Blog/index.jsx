'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  IconButton,
  Alert,
  Snackbar,
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { useAddBlogMutation, useDeleteBlogMutation, useGetBlogsQuery, useUpdateBlogMutation } from 'hookApi/blogApi';
import { createChat } from '@n8n/chat';

const BlogManagement = () => {
  useEffect(() => {
    const initChat = async () => {
      try {
        await createChat({
          webhookUrl: 'http://localhost:5678/webhook/6ac1e069-d4b5-479b-867a-bee502647148/chat',
          webhookConfig: {
            method: 'POST',
            headers: {},
          },
          target: '#n8n-chat',
          mode: 'window',
          chatInputKey: 'chatInput',
          chatSessionKey: 'sessionId',
          loadPreviousSession: true,
          metadata: {},
          showWelcomeScreen: false,
          defaultLanguage: 'vi',
          initialMessages: [
            '👋 Xin chào!',
            'Bạn muốn tạo bài viết cho sản phẩm nào không hay chỉ là bài viết về thời trang!',
          ],
          i18n: {
            vi: {
              title: '👋 Xin chào!',
              subtitle: 'Cửa hàng Hoàng Hải sẵn sàng phục vụ 24/7.',
              footer: '',
              getStarted: 'Bắt đầu trò chuyện',
              inputPlaceholder: 'Nhập tin nhắn...',
            },
          },
        });
      } catch (error) {
        console.error('Error creating chat:', error);
      }
    };

    initChat();
  }, []);
  const { data, isLoading } = useGetBlogsQuery();
  const [deleteBlog] = useDeleteBlogMutation();
  const [addBlog] = useAddBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: 'Xu hướng thời trang Thu Đông 2024',
      content:
        'Mùa Thu Đông 2024 đang đến gần và cùng với đó là những xu hướng thời trang mới đầy thú vị. Năm nay, các nhà thiết kế tập trung vào việc kết hợp giữa sự thoải mái và phong cách, tạo ra những bộ trang phục vừa ấm áp vừa thời trang.',
      createdAt: '2024-11-15',
    },
    {
      id: 2,
      title: 'Cách phối đồ công sở chuyên nghiệp',
      content:
        'Trang phục công sở không chỉ thể hiện sự chuyên nghiệp mà còn giúp bạn tự tin hơn trong công việc. Việc lựa chọn và phối đồ công sở phù hợp là một nghệ thuật đòi hỏi sự tinh tế và hiểu biết về thời trang.',
      createdAt: '2024-11-12',
    },
    {
      id: 3,
      title: 'Top 10 món phụ kiện không thể thiếu',
      content:
        'Phụ kiện đóng vai trò quan trọng trong việc hoàn thiện một outfit. Chúng không chỉ giúp tăng tính thẩm mỹ mà còn thể hiện phong cách cá nhân của người mặc.',
      createdAt: '2024-11-10',
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentBlog, setCurrentBlog] = useState({
    id: null,
    title: '',
    content: '',
  });
  const [viewBlog, setViewBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [errors, setErrors] = useState({
    title: '',
    content: '',
  });

  const handleOpenDialog = (blog = null) => {
    if (blog) {
      setCurrentBlog({ ...blog });
      setIsEditing(true);
      setOpenDialog(true);
      setErrors({ title: '', content: '' });
    } else {
      setCurrentBlog({ id: null, title: '', content: '' });
      setIsEditing(false);
      setOpenDialog(true);
      setErrors({ title: '', content: '' });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentBlog({ id: null, title: '', content: '' });
    setIsEditing(false);
    setErrors({ title: '', content: '' });
  };

  const handleOpenViewDialog = (blog) => {
    setViewBlog(blog);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setViewBlog(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentBlog({
      ...currentBlog,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const validateForm = () => {
    const { title, content } = currentBlog;
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Tiêu đề không được để trống';
    }

    if (!content.trim()) {
      newErrors.content = 'Nội dung không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing) {
        // Update existing blog qua API
        await updateBlog({
          ...currentBlog,
        }).unwrap();
        setSnackbar({
          open: true,
          message: 'Cập nhật bài viết thành công!',
          severity: 'success',
        });
      } else {
        // Add new blog qua API
        await addBlog({
          ...currentBlog,
        }).unwrap();
        setSnackbar({
          open: true,
          message: 'Thêm bài viết thành công!',
          severity: 'success',
        });
      }
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra',
        severity: 'error',
      });
    }

    handleCloseDialog();
  };

  const handleEdit = (blog) => {
    handleOpenDialog(blog);
  };

  const handleDelete = (blogId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      //   const updatedBlogs = blogs.filter((blog) => blog.id !== blogId);
      //   setBlogs(updatedBlogs);
      deleteBlog(blogId);
      setSnackbar({
        open: true,
        message: 'Xóa bài viết thành công!',
        severity: 'success',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Quản Lý Blog
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Thêm Bài Viết
        </Button>
      </Box>

      {/* Blog Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tiêu Đề</TableCell>
              <TableCell>Nội Dung</TableCell>
              <TableCell>Ngày Tạo</TableCell>
              <TableCell align="center">Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>{blog.id}</TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                    {blog.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 300 }}>
                    {blog.content.length > 100 ? `${blog.content.substring(0, 100)}...` : blog.content}
                  </Typography>
                </TableCell>
                <TableCell>{blog.createdAt}</TableCell>
                <TableCell align="center">
                  <IconButton color="info" onClick={() => handleOpenViewDialog(blog)} title="Xem chi tiết">
                    <Visibility />
                  </IconButton>
                  <IconButton color="primary" onClick={() => handleEdit(blog)} title="Chỉnh sửa">
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(blog.id)} title="Xóa">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Chỉnh Sửa Bài Viết' : 'Thêm Bài Viết Mới'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Tiêu đề"
              name="title"
              value={currentBlog.title}
              onChange={handleInputChange}
              error={!!errors.title}
              helperText={errors.title}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Nội dung"
              name="content"
              value={currentBlog.content}
              onChange={handleInputChange}
              multiline
              rows={8}
              error={!!errors.content}
              helperText={errors.content}
            />
            {/* <Box mb={3}>
              <CKEditorForm name="detail" lable="Chi tiết sản phẩm" form={form} />
            </Box> */}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {isEditing ? 'Cập Nhật' : 'Thêm Mới'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="md" fullWidth>
        {viewBlog && (
          <>
            <DialogTitle>
              <Typography variant="h5">{viewBlog.title}</Typography>
              <Typography variant="caption" color="text.secondary">
                Ngày tạo: {viewBlog.createdAt}
                {viewBlog.updatedAt && ` | Cập nhật: ${viewBlog.updatedAt}`}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {viewBlog.content}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseViewDialog}>Đóng</Button>
              <Button onClick={() => handleEdit(viewBlog)} variant="contained" startIcon={<Edit />}>
                Chỉnh Sửa
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BlogManagement;

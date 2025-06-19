import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { fetch } from '../../../api/Fetch';
import { useQuery } from '@tanstack/react-query';
import { getShopDetail } from '../../../api/shopApi';
import Swal from 'sweetalert2';

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { data: shopData, isLoading: isLoadingShop } = useQuery({
    queryKey: ['getShop-detail'],
    queryFn: getShopDetail,
    retry: 1,
  });

  const fetchBlogs = async (shopId) => {
    try {
      setIsLoading(true);
      const response = await fetch.get('/blog/' + shopId);
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể tải danh sách blog',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (shopData?.id) {
      fetchBlogs(shopData.id);
    }
  }, [shopData]);

  

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Xác nhận xóa',
        text: 'Bạn có chắc chắn muốn xóa blog này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      });

      if (result.isConfirmed) {
        try {
          await fetch.delete(`/blog/${id}`);
          Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: 'Xóa blog thành công!',
            confirmButtonColor: '#28a745',
          });
          fetchBlogs(shopData.id);
        } catch (error) {
          console.error('Error response:', error.response);
          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: error.response?.data?.message || 'Không thể xóa blog. Vui lòng thử lại!',
            confirmButtonColor: '#dc3545',
          });
        }
      }
    } catch (error) {
      console.error('Error in delete operation:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Có lỗi xảy ra trong quá trình xử lý. Vui lòng thử lại!',
        confirmButtonColor: '#dc3545',
      });
    }
  };

  const handleOpenDialog = (blog = {}) => {
    setEditingBlog(blog);
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBlog(null);
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setEditingBlog({ ...editingBlog, [field]: value });
    // Clear error when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  if (isLoadingShop) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={2}>Quản lý Blog</Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>Thêm Blog</Button>
      <Box mt={2}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        ) : blogs.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
            Chưa có bài blog nào
          </Typography>
        ) : (
          blogs.map((blog) => (
            <Card key={blog.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{blog.title}</Typography>
                <Typography variant="body2" color="text.secondary">{blog.content}</Typography>
                <Box mt={2}>
                  <Button variant="outlined" onClick={() => handleOpenDialog(blog)}>Sửa</Button>
                  <Button variant="outlined" color="error" onClick={() => handleDelete(blog.id)} sx={{ ml: 2 }}>Xóa</Button>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingBlog?.id ? 'Chỉnh sửa Blog' : 'Thêm Blog'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Tiêu đề"
            fullWidth
            margin="normal"
            value={editingBlog?.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            required
          />
          <TextField
            label="Nội dung"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={editingBlog?.content || ''}
            onChange={(e) => handleInputChange('content', e.target.value)}
            error={!!errors.content}
            helperText={errors.content}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">Hủy</Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            {editingBlog?.id ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BlogManagement;

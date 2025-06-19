import React, { useState } from 'react';
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();

  // Fetch vouchers
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['vouchers'],
    queryFn: async () => {
      const response = await fetch.get('/voucher/get-all');
      return response.data.data;
    },
  });

  const validateVoucher = () => {
    const newErrors = {};
    
    if (!editingVoucher?.code?.trim()) {
      newErrors.code = 'Vui lòng nhập mã voucher';
    }

    if (!editingVoucher?.discount || editingVoucher.discount <= 0) {
      newErrors.discount = 'Giảm giá phải lớn hơn 0';
    }

    if (!editingVoucher?.quantity || editingVoucher.quantity <= 0) {
      newErrors.quantity = 'Số lượng phải lớn hơn 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add/Update mutation
  const { mutate: saveVoucher } = useMutation({
    mutationFn: async (voucher) => {
      if (voucher.id) {
        return fetch.put(`/voucher/update-voucher/${voucher.id}`, voucher);
      } else {
        return fetch.post('/voucher/add-voucher', voucher);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['vouchers']);
      setOpenDialog(false);
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: variables.id ? 'Cập nhật voucher thành công!' : 'Thêm voucher mới thành công!',
        confirmButtonColor: '#28a745',
      });
    },
    onError: (error) => {
      console.error('Error saving voucher:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error.response?.data?.message || 'Không thể lưu voucher. Vui lòng thử lại!',
        confirmButtonColor: '#dc3545',
      });
    },
  });

  // Delete mutation
  const { mutate: deleteVoucher } = useMutation({
    mutationFn: (id) => fetch.delete(`/voucher/delete-voucher/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['vouchers']);
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Xóa voucher thành công!',
        confirmButtonColor: '#28a745',
      });
    },
    onError: (error) => {
      console.error('Error deleting voucher:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error.response?.data?.message || 'Không thể xóa voucher. Vui lòng thử lại!',
        confirmButtonColor: '#dc3545',
      });
    },
  });

  const handleSave = () => {
    if (!validateVoucher()) {
      return;
    }
    saveVoucher(editingVoucher);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc chắn muốn xóa voucher này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      deleteVoucher(id);
    }
  };

  const handleOpenDialog = (voucher = {}) => {
    setEditingVoucher(voucher);
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingVoucher(null);
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setEditingVoucher({ ...editingVoucher, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={2}>Quản lý Voucher</Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
        Thêm Voucher
      </Button>

      <Box mt={2}>
        {data?.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
            Chưa có voucher nào
          </Typography>
        ) : (
          data?.map((voucher) => (
            <Card key={voucher.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Mã: {voucher.code}</Typography>
                <Typography variant="body1">Giảm giá: {voucher.discount}%</Typography>
                <Typography variant="body2">Số lượng: {voucher.quantity}</Typography>
                <Box mt={2}>
                  <Button variant="outlined" onClick={() => handleOpenDialog(voucher)}>
                    Sửa
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={() => handleDelete(voucher.id)} 
                    sx={{ ml: 2 }}
                  >
                    Xóa
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingVoucher?.id ? 'Chỉnh sửa Voucher' : 'Thêm Voucher'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Mã voucher"
            fullWidth
            margin="normal"
            value={editingVoucher?.code || ''}
            onChange={(e) => handleInputChange('code', e.target.value)}
            error={!!errors.code}
            helperText={errors.code}
            required
          />
          <TextField
            label="Giảm giá (%)"
            fullWidth
            margin="normal"
            type="number"
            value={editingVoucher?.discount || ''}
            onChange={(e) => handleInputChange('discount', parseInt(e.target.value))}
            error={!!errors.discount}
            helperText={errors.discount}
            required
          />
          <TextField
            label="Số lượng"
            fullWidth
            margin="normal"
            type="number"
            value={editingVoucher?.quantity || ''}
            onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
            error={!!errors.quantity}
            helperText={errors.quantity}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">
            Hủy
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            {editingVoucher?.id ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VoucherManagement; 
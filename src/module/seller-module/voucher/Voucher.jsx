import React, { useState } from "react";
import "./Voucher.scss"; // Thêm import cho file CSS
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Typography,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Stack,
    CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import { FaTicketAlt, FaPlus, FaRegCopy, FaEdit, FaTrash } from "react-icons/fa";
import { getAllVoucher, insertVoucher, updateVoucher, deleteVoucher } from "../../../api/voucherApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import Swal from 'sweetalert2';
import { useQueryClient } from "@tanstack/react-query";

const StyledCard = styled(Card)(({ theme }) => ({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: theme.shadows
    },
}));

const FloatingAddButton = styled(Button)({
    position: "fixed",
    bottom: "2rem",
    right: "2rem",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    minWidth: "unset",
});

const VoucherList = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [newVoucher, setNewVoucher] = useState({
        code: "",
        discountAmount: "",
        minOrderAmount: "",
        startDate: "",
        endDate: "",
        quantity: "",
        description: "",
    });
    const [editingVoucher, setEditingVoucher] = useState(null);
    const [errors, setErrors] = useState({});

    const { data: vouchers = [], isLoading } = useQuery({
        queryKey: ["vouchers"],
        queryFn: getAllVoucher,
    });

    const queryClient = useQueryClient();

    const handleInputChange = (field, value) => {
        const targetVoucher = editingVoucher ? editingVoucher : newVoucher;
        const setVoucher = editingVoucher ? setEditingVoucher : setNewVoucher;
        
        setVoucher({
            ...targetVoucher,
            [field]: value
        });

        if (errors[field]) {
            setErrors({ ...errors, [field]: null });
        }
    };

    const { mutate: saveVoucher } = useMutation({
        mutationFn: async (voucher) => {
            if (voucher.id) {
                return updateVoucher(voucher.id, voucher);
            } else {
                return insertVoucher(voucher);
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['vouchers']);
            setOpenDialog(false);
            setEditingVoucher(null);
            setNewVoucher({
                code: "",
                discountAmount: "",
                minOrderAmount: "",
                startDate: "",
                endDate: "",
                quantity: "",
                description: "",
            });
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: variables.id ? 'Cập nhật voucher thành công!' : 'Thêm voucher mới thành công!',
                confirmButtonColor: '#28a745',
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: error.response?.data?.message || 'Không thể lưu voucher. Vui lòng thử lại!',
                confirmButtonColor: '#dc3545',
            });
        }
    });

    const { mutate: deleteVoucherMutation } = useMutation({
        mutationFn: deleteVoucher,
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
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: error.response?.data?.message || 'Không thể xóa voucher. Vui lòng thử lại!',
                confirmButtonColor: '#dc3545',
            });
        }
    });

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setSnackbar({
            open: true,
            message: "Mã voucher đã được sao chép!",
            severity: "success",
        });
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
            deleteVoucherMutation(id);
        }
    };

    const handleEdit = (voucher) => {
        setEditingVoucher(voucher);
        setOpenDialog(true);
    };

    const handleSave = () => {
        const voucherToSave = editingVoucher || newVoucher;
        if (!validateVoucher(voucherToSave)) {
            return;
        }
        saveVoucher(voucherToSave);
    };

    const validateVoucher = (voucher) => {
        const newErrors = {};
        
        if (!voucher.code?.trim()) {
            newErrors.code = 'Vui lòng nhập mã voucher';
        }

        if (!voucher.discountAmount || voucher.discountAmount <= 0) {
            newErrors.discountAmount = 'Giảm giá phải lớn hơn 0';
        }

        if (!voucher.quantity || voucher.quantity <= 0) {
            newErrors.quantity = 'Số lượng phải lớn hơn 0';
        }

        if (!voucher.startDate) {
            newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
        }

        if (!voucher.endDate) {
            newErrors.endDate = 'Vui lòng chọn ngày kết thúc';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isVoucherExpired = (endDate) => {
        return new Date(endDate) < new Date();
    };

    const getVoucherStatus = (voucher) => {
        const now = new Date();
        const startDate = new Date(voucher.startDate);
        const endDate = new Date(voucher.endDate);

        if (now < startDate) {
            return { label: 'Chưa bắt đầu', color: 'warning.main' };
        } else if (now > endDate) {
            return { label: 'Đã hết hạn', color: 'error.main' };
        } else {
            return { label: 'Đang hoạt động', color: 'success.main' };
        }
    };
    const formatToMMDDYYYY = (dateString) => {
        if (!dateString) return ""; // Handle null/undefined
        return dateString.split('T')[0].split(' ')[0]; // Extracts "yyyy-MM-dd"
      };
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }} >
            <Typography variant="h4" component="h1" gutterBottom>
                Danh sách voucher
            </Typography>

            <Grid container spacing={3}>
                {vouchers.map((voucher) => (
                    <Grid item xs={12} sm={6} md={4} key={voucher.id}>
                        <StyledCard>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: getVoucherStatus(voucher).color,
                                            border: 1,
                                            borderColor: getVoucherStatus(voucher).color,
                                            borderRadius: 1,
                                            px: 1,
                                            py: 0.5,
                                        }}
                                    >
                                        {getVoucherStatus(voucher).label}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 2,
                                    }}
                                >
                                    <Stack>

                                        <Typography variant="h6" component="div">
                                            <FaTicketAlt size={24} style={{ marginRight: "8px" }} />Giảm {voucher.discountAmount}
                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            aria-label="Expiry date"
                                        >
                                            Đơn hàng tối thiểu: {voucher.minOrderAmount}
                                        </Typography>
                                    </Stack>
                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        mb: 1,
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        sx={{ fontWeight: "bold" }}
                                        aria-label="Voucher code"
                                    >
                                        {voucher.code}
                                    </Typography>
                                    <IconButton
                                        onClick={() => handleCopyCode(voucher.code)}
                                        aria-label="sao chép mã"
                                    >
                                        <FaRegCopy />
                                    </IconButton>
                                </Box>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                    aria-label="Voucher description"
                                >
                                    {voucher.description}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    aria-label="Expiry date"
                                >
                                    Số lượng: {voucher.quantity}
                                </Typography>
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={{ xs: 1, sm: 2, md: 4 }} >
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        aria-label="Start date"
                                    >
                                        Ngày băt đầu: {new Date(voucher.startDate).toLocaleDateString()}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        aria-label="Expiry date"
                                    >
                                        Ngày hết hạn: {new Date(voucher.endDate).toLocaleDateString()}
                                    </Typography>
                                </Stack>

                                {isVoucherExpired(voucher.endDate) && (
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        Voucher này đã hết hạn!
                                    </Alert>
                                )}

                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                    <Button
                                        startIcon={<FaEdit />}
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleEdit(voucher)}
                                    >
                                        Sửa
                                    </Button>
                                    <Button
                                        startIcon={<FaTrash />}
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleDelete(voucher.id)}
                                    >
                                        Xóa
                                    </Button>
                                </Box>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>

            <FloatingAddButton
                variant="contained"
                color="primary"
                onClick={() => setOpenDialog(true)}
                aria-label="Add new voucher"
            >
                <FaPlus size={24} />
            </FloatingAddButton>

            <Dialog
                open={openDialog}
                onClose={() => {
                    setOpenDialog(false);
                    setEditingVoucher(null);
                    setErrors({});
                }}
                aria-labelledby="voucher-dialog"
            >
                <DialogTitle id="voucher-dialog">
                    {editingVoucher ? 'Chỉnh sửa Voucher' : 'Thêm Voucher'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Mã voucher"
                        fullWidth
                        value={editingVoucher?.code || newVoucher.code}
                        onChange={(e) => handleInputChange('code', e.target.value)}
                        error={!!errors.code}
                        helperText={errors.code}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Giảm giá"
                        type="number"
                        fullWidth
                        value={editingVoucher?.discountAmount || newVoucher.discountAmount}
                        onChange={(e) => handleInputChange('discountAmount', e.target.value)}
                        error={!!errors.discountAmount}
                        helperText={errors.discountAmount}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="đơn hàng tối thiểu"
                        type="number"
                        fullWidth
                        value={editingVoucher?.minOrderAmount || newVoucher.minOrderAmount}
                        onChange={(e) => handleInputChange('minOrderAmount', e.target.value)}
                        error={!!errors.minOrderAmount}
                        helperText={errors.minOrderAmount}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Ngày bắt đầu"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={formatToMMDDYYYY(editingVoucher?.startDate)|| newVoucher.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        error={!!errors.startDate}
                        helperText={errors.startDate}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Ngày hết hạn"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={formatToMMDDYYYY(editingVoucher?.endDate)|| newVoucher.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        error={!!errors.endDate}
                        helperText={errors.endDate}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="số lượng"
                        type="number"
                        fullWidth
                        value={editingVoucher?.quantity || newVoucher.quantity}
                        onChange={(e) => handleInputChange('quantity', e.target.value)}
                        error={!!errors.quantity}
                        helperText={errors.quantity}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        value={editingVoucher?.description || newVoucher.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenDialog(false);
                        setEditingVoucher(null);
                        setErrors({});
                    }} color="error">
                        Hủy
                    </Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        {editingVoucher ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default VoucherList;

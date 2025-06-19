import React, { useEffect, useState } from 'react';
import { Modal, Button, Typography, Box, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import { fetch } from '../../../api/Fetch';
import { useDispatch } from 'react-redux';
import { selectVoucher } from '../../../redux/slice/voucherSlice';

const VoucherModal = ({ orderAmount, shopId, open, onClose, onSelectVoucher }) => {
  const [vouchers, setVouchers] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      if (open && shopId) {
        try {
          const data = await fetch.get(`/voucher/get-valid?shopId=${shopId}`);
          setVouchers(data.data.data || []);
        } catch (error) {
          console.error('Error fetching valid vouchers:', error);
          setVouchers([]);
        }
      }
    }
    fetchData();
  }, [open, shopId]);

  const handleSelectVoucher = (voucher) => {
    dispatch(selectVoucher(voucher)); // This might need adjustment if you want per-shop vouchers in Redux
    onSelectVoucher(shopId, voucher);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl p-6 bg-white rounded-2xl shadow-2xl">
          <Typography variant="h6" className="mb-4 text-center">Chọn Voucher</Typography>
          <TableContainer component={Paper} className="max-h-96 overflow-auto">
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Mã Voucher</TableCell>
                  <TableCell>Mô Tả</TableCell>
                  <TableCell>Số Tiền Giảm</TableCell>
                  <TableCell>Đơn Tối Thiểu</TableCell>
                  <TableCell>Hành Động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vouchers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Không có voucher nào còn hiệu lực
                    </TableCell>
                  </TableRow>
                ) : (
                  vouchers.map((voucher) => (
                    <TableRow
                      key={voucher.id}
                      className={voucher.minOrderAmount > orderAmount ? 'opacity-50 pointer-events-none' : ''}
                    >
                      <TableCell>{voucher.code}</TableCell>
                      <TableCell>{voucher.description || 'Không có mô tả'}</TableCell>
                      <TableCell>{voucher.discountAmount.toLocaleString()}đ</TableCell>
                      <TableCell>{voucher.minOrderAmount.toLocaleString()}đ</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          disabled={voucher.minOrderAmount > orderAmount}
                          onClick={() => handleSelectVoucher(voucher)}
                        >
                          Chọn
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="mt-6 text-left">
            <Button variant="outlined" color="secondary" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default VoucherModal;
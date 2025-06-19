import {
  Box,
  Button,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateStatus, updateShipCost } from "../../../api/orderApi"; // Thêm import updateShipCost
import Swal from "sweetalert2";
import { queryClient } from "../../../main";
import CancelOrder from "./CancelOrder";

const ExpanDetail = ({ row, refetch }) => {
  const navigate = useNavigate();
  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const [orderStatus, setOrderStatus] = useState(row.order_status);
  const [paymentStatus, setPaymentStatus] = useState(row.payment_status);
  const [shipCost, setShipCost] = useState(row.shipCost); // State cho shipCost
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const updateShipCostMutation = useMutation({
    mutationFn: ({ id, shipCost }) => {
      return updateShipCost(id, shipCost);
    },
    onSuccess: () => {
      queryClient.refetchQueries(["order"]);
      Swal.fire({
        icon: "success",
        text: "Cập nhật phí vận chuyển thành công",
      });
      refetch();
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        text: "Cập nhật phí vận chuyển thất bại",
      });
    },
  });

  const { mutate } = useMutation({
    mutationFn: ({ id, status, type }) => {
      return updateStatus(id, status, type);
    },
    onSuccess: () => {
      queryClient.refetchQueries(["order"]);
      Swal.fire({
        icon: "success",
        text: "Cập nhật thành công",
      });
      refetch(); // Gọi lại để làm mới dữ liệu
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        text: "Cập nhật thất bại",
      });
    },
  });

  const handleUpdate = (id, type) => {
    if (type === 1) {
      mutate({ id, status: orderStatus, type: 1 });
    } else if (type === 2) {
      mutate({ id, status: paymentStatus, type: 2 });
    } else if (type === 3) {
      // Sử dụng mutation riêng cho cập nhật phí vận chuyển
      updateShipCostMutation.mutate({ id, shipCost });
    }
  };

  return (
    <Box>
      <CancelOrder show={show} handleClose={handleClose} data={row}></CancelOrder>
      <Box
        sx={{
          my: 3,
          width: "100%",
          height: "300px",
          backgroundColor: "white",
          padding: 2,
        }}
      >
        <Typography sx={{ fontWeight: "600" }} variant="body1" color="initial">
          Thông tin hóa đơn
        </Typography>

        <Box sx={{ ml: 5 }}>
          <Stack direction="row" spacing={3} sx={{ width: "100%", mt: 2 }}>
            <Stack direction={"row"} sx={{ width: "40%", alignItems: "end" }} spacing={3}>
              <Typography variant="body1" sx={{ width: "40%", fontSize: "14px" }} color="initial">
                Mã đơn hàng
              </Typography>
              <TextField fullWidth label="Mã đơn" variant="standard" value={row.code} disabled />
            </Stack>

            <Stack direction={"row"} sx={{ width: "25%", alignItems: "end" }} spacing={3}>
              <Typography variant="body1" sx={{ width: "50%", fontSize: "14px" }} color="initial">
                Tổng đơn
              </Typography>
              <TextField fullWidth label="Tổng đơn" variant="standard" value={formatCurrency(row.orderTotal)} disabled />
            </Stack>
          </Stack>

          <Stack direction="row" spacing={3} sx={{ width: "100%", mt: 2 }}>
            <Stack direction={"row"} sx={{ width: "40%", alignItems: "end" }} spacing={3}>
              <Typography variant="body1" sx={{ width: "45%", fontSize: "14px" }} color="initial">
                Phí vận chuyển
              </Typography>
              <TextField
                fullWidth
                label="Phí vận chuyển"
                variant="standard"
                type="number"
                value={shipCost}
                onChange={(e) => setShipCost(parseInt(e.target.value) || 0)} // Cập nhật state khi thay đổi
              />
            </Stack>

            <Stack direction={"row"} sx={{ width: "25%", alignItems: "end" }} spacing={3}>
              <Typography variant="body1" sx={{ width: "50%", fontSize: "14px" }} color="initial">
                Giảm giá
              </Typography>
              <TextField fullWidth label="Giảm giá" variant="standard" value={formatCurrency(row.discount)} disabled />
            </Stack>

            <Button
              color="success"
              variant="contained"
              sx={{ textTransform: "initial" }}
              onClick={() => handleUpdate(row.id, 3)} // Gọi hàm cập nhật shipCost
            >
              Cập nhật phí vận chuyển
            </Button>
          </Stack>

          {/* Các phần còn lại giữ nguyên */}
          <Stack direction="row" spacing={3} sx={{ width: "100%", mt: 3 }}>
            <Stack direction={"row"} sx={{ width: "90%", alignItems: "end" }} spacing={3}>
              <Typography variant="body1" sx={{ width: "25%", fontSize: "14px" }} color="initial">
                Phương thức thanh toán
              </Typography>
              <Typography variant="body1" color="initial" sx={{ fontWeight: "700" }}>
                {row.payment != 1 ? "Thanh toán qua VnPay" : "Thanh toán khi nhận hàng"}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={3} sx={{ width: "100%", mt: 3 }}>
            <Stack direction="row" spacing={3} sx={{ width: "90%", alignItems: "center" }}>
              <Typography variant="body1" sx={{ width: "20%", fontSize: "14px" }} color="initial">
                Trạng thái đơn hàng
              </Typography>
              <Select
                label="Trạng thái"
                size="small"
                variant="standard"
                disabled={row.order_status == 3 || row.order_status == 4}
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
              >
                <MenuItem value={0}>Chưa Xác nhận</MenuItem>
                <MenuItem value={1}>Đã xác nhận</MenuItem>
                <MenuItem value={2}>Đang giao hàng</MenuItem>
                <MenuItem value={3}>Hoàn tất</MenuItem>
                {row.order_status == 4 && <MenuItem value={4}>Đã Hủy</MenuItem>}
              </Select>
              {(row.order_status != 3 && row.order_status != 4) && (
                <Button
                  color="success"
                  variant="contained"
                  sx={{ textTransform: "initial" }}
                  onClick={() => handleUpdate(row.id, 1)}
                >
                  Cập nhật trạng thái
                </Button>
              )}
            </Stack>
          </Stack>

          <Stack direction="row" spacing={3} sx={{ width: "100%", mt: 3 }}>
            <Stack direction="row" spacing={3} sx={{ width: "90%", alignItems: "center" }}>
              <Typography variant="body1" sx={{ width: "20%", fontSize: "14px" }} color="initial">
                Trạng thái thanh toán
              </Typography>
              <Select
                label="Trạng thái"
                size="small"
                variant="standard"
                disabled={row.payment_status == 1 || row.order_status == 4}
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
              >
                <MenuItem value={0}>Chưa thanh toán</MenuItem>
                <MenuItem value={1}>Đã thanh toán</MenuItem>
              </Select>
              {(row.payment_status == 0 && row.order_status != 4) && (
                <Button
                  color="success"
                  variant="contained"
                  sx={{ textTransform: "initial" }}
                  onClick={() => handleUpdate(row.id, 2)}
                >
                  Cập nhật trạng thái
                </Button>
              )}
            </Stack>
          </Stack>
        </Box>
      </Box>

      {/* Phần địa chỉ giữ nguyên */}
      <Box sx={{ my: 3, width: "100%", height: "300px", backgroundColor: "white", padding: 2 }}>
        {/* ... (Địa chỉ giữ nguyên) */}
        <Stack direction={"row"} sx={{ justifyContent: "end", mt: 4 }} spacing={1}>
          <Button onClick={() => navigate("/seller/view-order/" + row.id)} sx={{ textTransform: "initial" }} variant="contained">
            Xem chi tiết
          </Button>
          <Button sx={{ textTransform: "initial" }} variant="contained" color="error" onClick={() => setShow(true)}>
            Hủy đơn
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ExpanDetail;
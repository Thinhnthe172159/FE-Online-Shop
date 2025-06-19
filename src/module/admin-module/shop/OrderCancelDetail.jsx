import React, { useState } from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { approveOrderCancel } from "../../../api/orderCancelApi";
import Swal from "sweetalert2";
import { queryClient } from "../../../main";
import ModalCancel from "./ModalCancel";
const OrderCancelDetail = ({ row }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false)
  };

  console.log(row);
  

  const { mutate } = useMutation({
    mutationFn: (data) => approveOrderCancel(data),
    onSuccess: () => {
      queryClient.refetchQueries(["admin-order"]);
      Swal.fire({
        icon: "success",
        text: "Đã hủy đơn hàng",
      });
    },
    onError: (e) => {
      console.log(e);
      Swal.fire({
        icon: "error",
        text: "Vui lòng thử lại sau",
      });
    },
  });

  const handleApprove = () => {
    Swal.fire({
      icon: "question",
      text: "Bạn có chắc chắn cho phép hủy đơn",
      showCancelButton: true,
      showConfirmButton: true,
    }).then((r) => {
      if (r.isConfirmed) {
        let data = {
          oid: row.order.code,
          id: row.id,
        };
        mutate(data);
      }
    });
  };

  const handleCancel = () => {
    setShow(true)
  };
  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  return (
    <Box>
      <ModalCancel shopId={row.shop.id} show={show} id={row.id} type={3} handleClose={handleClose} content={"Yêu cầu hủy đơn hàng "+row.order.code}></ModalCancel>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "white",
          padding: 2,
        }}
      >
        <Typography sx={{ fontWeight: "600" }} variant="body1" color="initial">
          Thông tin yêu cầu hủy đơn
        </Typography>

        <Box sx={{ ml: 5 }}>
          <Stack direction="row" spacing={3} sx={{ width: "100%", mt: 2 }}>
            <Stack
              direction={"row"}
              sx={{ width: "40%", alignItems: "end" }}
              spacing={3}
            >
              <Typography
                variant="body1"
                sx={{ width: "50%", fontSize: "14px" }}
                color="initial"
              >
                Mã đơn
              </Typography>
              <TextField
                value={row.order.code}
                fullWidth
                label="Mã đơn"
                variant="standard"
              />
            </Stack>

            <Stack
              direction={"row"}
              sx={{ width: "30%", alignItems: "end" }}
              spacing={3}
            >
              <Typography
                variant="body1"
                sx={{ width: "40%", fontSize: "14px" }}
                color="initial"
              >
                Tổng tiền đơn hàng
              </Typography>
              <TextField
                value={formatCurrency(row.order.orderTotal)}
                fullWidth
                label="Phí vận chuyển"
                variant="standard"
              />
            </Stack>
          </Stack>

          <Stack direction="row" spacing={3} sx={{ width: "100%", mt: 2 }}>
            <Stack
              direction={"row"}
              sx={{ width: "40%", alignItems: "end" }}
              spacing={3}
            >
              <Typography
                variant="body1"
                sx={{ width: "50%", fontSize: "14px" }}
                color="initial"
              >
                Trạng thái thanh toán
              </Typography>
              <TextField
                value={row.payment == 0 ? "Chưa thanh toán" : "Đã thanh toán"}
                fullWidth
                label="Phí vận chuyển"
                variant="standard"
              />
            </Stack>

            <Stack
              direction={"row"}
              sx={{ width: "30%", alignItems: "end" }}
              spacing={3}
            >
              <Typography
                variant="body1"
                sx={{ width: "40%", fontSize: "14px" }}
                color="initial"
              >
                Người đặt đơn:
              </Typography>
              <TextField fullWidth label="Phí vận chuyển" variant="standard" />
            </Stack>
          </Stack>

          <Stack direction="row" spacing={3} sx={{ width: "100%", mt: 3 }}>
            <Stack
              direction={"row"}
              sx={{ width: "90%", alignItems: "end" }}
              spacing={3}
            >
              <Typography
                variant="body1"
                sx={{ width: "16%", fontSize: "14px" }}
                color="initial"
              >
                Lý do hủy đơn
              </Typography>
              <TextField
                sx={{ width: "100%" }}
                fullWidth
                label="Lý do"
                variant="standard"
                value={row.reason}
              />
            </Stack>
          </Stack>

          <Stack direction="row" spacing={3} sx={{ width: "100%", mt: 4 }}>
            <Stack
              direction={"row"}
              sx={{ width: "90%", alignItems: "end" }}
              spacing={3}
            >
              <Typography
                variant="body1"
                sx={{ width: "14%", fontSize: "14px" }}
                color="initial"
              >
                Ảnh gửi kèm
              </Typography>
              <Stack direction={"row"} spacing={2}>
                {row.images.length > 0
                  ? row.images.map((item) => {
                      return (
                        <img
                          src={item.image}
                          style={{
                            width: "200px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "10px",
                          }}
                          alt=""
                        />
                      );
                    })
                  : "Không có ảnh gửi kèm"}
              </Stack>
            </Stack>
          </Stack>
        </Box>
        {row.status != 1 && (
          <Stack direction={"row"} justifyContent={"end"} spacing={3}>
            <Button onClick={handleCancel} variant="contained" color="error">
              Không đồng ý
            </Button>
            <Button onClick={handleApprove} variant="contained">
              Đồng ý{" "}
            </Button>
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default OrderCancelDetail;

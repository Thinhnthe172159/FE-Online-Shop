import React from "react";
import "./payment.scss";
import { Button, Stack, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
const Payment = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const amount = queryParams.get("amount");
  const email = queryParams.get("email");
  const numberOrder = queryParams.get("numberOrder");
  const address = queryParams.get("address");
  const nameReceiver = queryParams.get("name");
  const phone = queryParams.get("phone");
  const pay= queryParams.get("pay")

  const formatCurrency = (value) => {
    value = parseInt(value)
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const navigate = useNavigate()

  return (
    <div id="payment">
      <div className="success-body">
        <div className="card">
          <div className="circle">
            <i className="checkmark">✓</i>
          </div>
          <h3>Đặt hàng thành công</h3>
          <p>
            Cảm ơn {email} đã đặt hàng
            <br /> Chi tiết đơn hàng của bạn:
          </p>
          <div className="detail mt-5">
            <Stack direction={"column"} spacing={2}>
              <Stack
                direction={"row"}
                spacing={3}
                sx={{ justifyContent: "center", gap: "15px" }}
              >
                <Typography
                  className="detail-title"
                  variant="body1"
                  sx={{ fontWeight: "500" }}
                >
                  {pay == 1 ? "Bạn đã thanh toán:" : "Bạn cần thanh toán : "}
                </Typography>
                <Typography variant="body1" color="initial">
                  {formatCurrency(amount)}
                </Typography>
              </Stack>
              <Stack
                direction={"row"}
                spacing={3}
                sx={{ justifyContent: "center", gap: "15px" }}
              >
                <Typography
                  className="detail-title"
                  variant="body1"
                  sx={{ fontWeight: "500" }}
                >
                  Số đơn hàng:
                </Typography>
                <Typography variant="body1" color="initial">
                  {numberOrder}
                </Typography>
              </Stack>

              <Stack
                direction={"row"}
                spacing={3}
                sx={{ justifyContent: "center", gap: "15px" }}
              >
                <Typography
                  className="detail-title"
                  variant="body1"
                  sx={{ fontWeight: "500" }}
                >
                  Người nhận hàng:{" "}
                </Typography>
                <Typography variant="body1" color="initial">
                  {nameReceiver}
                </Typography>
              </Stack>
              <Stack
                direction={"row"}
                spacing={3}
                sx={{ justifyContent: "center", gap: "15px" }}
              >
                <Typography
                  className="detail-title"
                  variant="body1"
                  sx={{ fontWeight: "500" }}
                >
                  Số điện thoại nhận hàng:{" "}
                </Typography>
                <Typography variant="body1" color="initial">
                  {phone}
                </Typography>
              </Stack>

              <Stack
                direction={"column"}
                spacing={3}
                sx={{ justifyContent: "space-between" }}
              >
                <Typography
                  className="detail-title"
                  variant="body1"
                  sx={{ fontWeight: "500" }}
                >
                  Địa chỉ nhận hàng:{" "}
                </Typography>
                <Typography variant="body1" color="initial">
                  {address}
                </Typography>
              </Stack>
            </Stack>

            <Stack
              direction={"row"}
              spacing={3}
              className="mt-4"
              sx={{ justifyContent: "center" }}
            >
              <Button
                sx={{ textTransform: "capitalize" }}
                color="success"
                variant="outlined"
                onClick={() => navigate("/")}
              >
                Quay lại trang chủ
              </Button>
              <Button
                sx={{ textTransform: "capitalize" }}
                color="warning"
                variant="outlined"
                onClick={() => navigate("/profile/history-order-all")}
              >
                Theo dõi đơn hàng
              </Button>
            </Stack>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

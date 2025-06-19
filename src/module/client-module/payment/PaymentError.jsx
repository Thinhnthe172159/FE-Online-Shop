import React from "react";
import "./payment.scss";
import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
const PaymentError = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div id="payment-err">
        <div className="success-body">
          <div className="card">
            <div className="circle">
              <i className="checkmark">❌</i>
            </div>
            <h3>Thanh toán thất bại</h3>
            <p>
              Bạn chưa thanh toán được đơn hàng
              <br /> Vui lòng thử lại sau
            </p>
            <Stack direction={"row"} spacing={3} className="mt-5">
              <Button
                onClick={() => {
                  navigate("/");
                }}
                color="error"
                sx={{ textTransform: "initial" }}
                variant="outlined"
              >
                Quay lại trang chủ
              </Button>
              <Button
                onClick={() => {
                  navigate("/cart");
                }}
                color="error"
                sx={{ textTransform: "initial" }}
                variant="outlined"
              >
                Quay lại giỏ hàng
              </Button>
            </Stack>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentError;

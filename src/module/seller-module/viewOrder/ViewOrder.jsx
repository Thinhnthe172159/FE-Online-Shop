import React from "react";
import {
  Container,
  Stack,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useQuery } from "@tanstack/react-query";
import { getOneOrder } from "../../../api/orderApi";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../client-module/loading/Loading";

function OrderTitle({ code }) {
  const navigate = useNavigate();
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      style={{ marginTop: "20px" }}
    >
      {/* Back Button */}
      <IconButton
        onClick={() => navigate("/seller/order")}
        style={{ border: "1px solid #e0e0e0", borderRadius: "8px" }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Order Details */}
      <Box>
        <Typography variant="body2" color="green">
          Đơn hàng / Thông tin đơn hàng
        </Typography>
        <Typography variant="h5" component="div" style={{ fontWeight: "bold" }}>
          Đơn hàng {code}
        </Typography>
      </Box>
    </Stack>
  );
}

function OrderHeader({ code, paymentStatus, orderStatus, time, uptime }) {
  const orderStatusState = {};
  const paymentStatusState = {};
  switch (orderStatus) {
    case 0:
      orderStatusState["text"] = "Chưa xác nhận";
      orderStatusState["color"] = "red";
      orderStatusState["background"] = "#f0a1a158";

      break;
    case 1:
      orderStatusState["text"] = "Đã xác nhận";
      orderStatusState["color"] = "orange";
      orderStatusState["background"] = "#b6a9993b";
      break;
    case 2:
      orderStatusState["text"] = "Đang giao";
      orderStatusState["color"] = "orange";
      orderStatusState["background"] = "#b6a9993b";
      break;
    case 3:
      orderStatusState["text"] = "Hoàn tất";
      orderStatusState["color"] = "#4eb31d";
      orderStatusState["background"] = "#7ed67258";
      break;
    case 4:
      orderStatusState["text"] = "Đã hủy";
      orderStatusState["color"] = "black";
      orderStatusState["background"] = "white";
      break;
  }

  switch (paymentStatus) {
    case 0:
      paymentStatusState["text"] = "Chưa thanh toán";
      paymentStatusState["color"] = "red";
      paymentStatusState["background"] = "#f0a1a158";

      break;
    case 1:
      paymentStatusState["text"] = "Đã thanh toán";
      paymentStatusState["color"] = "#4eb31d";
      paymentStatusState["background"] = "#7ed67258";
      break;
  }

  return (
    <Box
      style={{
        marginTop: "20px",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "16px",
      }}
      sx={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
    >
      <Stack></Stack>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        {/* Back Button and Order Info */}
        <Stack direction="row" alignItems="center">
          <Box marginLeft={1}>
            <Stack direction={"column"} spacing={1}>
              <Typography
                variant="h5"
                component="div"
                style={{ fontWeight: "bold" }}
              >
                Đơn hàng {code}
              </Typography>

              <Typography
                sx={{
                  color: orderStatusState.color,
                  fontWeight: "600",
                  width: "150px",
                  textAlign: "center",
                  padding: "3px 0",
                  borderRadius: "10px",
                  background: orderStatusState.background,
                }}
                variant="body2"
                color="textSecondary"
              >
                {orderStatusState.text}
              </Typography>

              <Typography
                sx={{
                  color: paymentStatusState.color,
                  fontWeight: "600",
                  width: "150px",
                  textAlign: "center",
                  padding: "3px 0",
                  borderRadius: "10px",
                  background: paymentStatusState.background,
                }}
                variant="body2"
                color="textSecondary"
              >
                {paymentStatusState.text}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        {/* Action Buttons */}
      </Stack>

      {/* Order Details */}
      <Stack marginLeft={1} direction="row" spacing={3} sx={{ mt: 2 }}>
        <Typography variant="body2" color="textSecondary">
          Ngày đặt đơn: {time}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Ngày cập nhật: {uptime}
        </Typography>
      </Stack>
    </Box>
  );
}

function OrderDetails({ data }) {
  const getShortName = (name) => {
    if (name.length > 30) {
      let shortName = name.substring(0, 30) + "...";
      return shortName;
    }
    return name;
  };

  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <Box style={{ marginTop: "20px" }}>
      {/* Customer & Address Info */}
      <Stack direction="row" spacing={2} sx={{ justifyContent: "start" }}>
        <Card
          sx={{
            width: "50%",
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: "22px" }}>
              Thông tin giao hàng
            </Typography>
            <Stack marginLeft={2} spacing={1} marginTop={2}>
              <Stack sx={{ justifyContent: "space-between" }} direction={"row"}>
                <Typography>Tên người nhận:</Typography>
                <Typography>{data.address.nameReceiver}</Typography>
              </Stack>
              <Stack sx={{ justifyContent: "space-between" }} direction={"row"}>
                <Typography>Email đặt hàng:</Typography>
                <Typography>{data.customer.email}</Typography>
              </Stack>
              <Stack sx={{ justifyContent: "space-between" }} direction={"row"}>
                <Typography>Số điện thoại:</Typography>
                <Typography>{data.address.phone}</Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
        <Card
          sx={{
            width: "50%",
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: "22px" }}>
              Địa chỉ giao hàng
            </Typography>
            <Stack marginLeft={2} spacing={1} marginTop={2}>
              <Stack sx={{ justifyContent: "space-between" }} direction={"row"}>
                <Typography>Xã/Phường:</Typography>
                <Typography>{data.address.ward}</Typography>
              </Stack>
              <Stack sx={{ justifyContent: "space-between" }} direction={"row"}>
                <Typography>Quận/Huyện:</Typography>
                <Typography>{data.address.district}</Typography>
              </Stack>
              <Stack sx={{ justifyContent: "space-between" }} direction={"row"}>
                <Typography>Tỉnh thành:</Typography>
                <Typography>{data.address.province}</Typography>
              </Stack>

              <Stack direction={"column"}>
                <Typography sx={{ width: "90%" }}>
                  Địa chỉ chi tiết :
                </Typography>
                <Typography marginLeft={2}>{data.address.address}</Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Items Ordered */}
      <Card
        style={{
          marginTop: "20px",
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        }}
      >
        <CardContent>
          <Typography variant="h6">Các sản phẩm</Typography>
          <TableContainer component={Paper} style={{ marginTop: "10px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell sx={{ width: "30%" }}>Tên sản phẩm</TableCell>
                  <TableCell>Ảnh sản phẩm</TableCell>
                  <TableCell>Giá sản phẩm</TableCell>
                  <TableCell>Giá tiện ích</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Tổng tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.orderDetails.map((item, index) => {
                  const addonText = item.productAddOns
                    .map((addon) => addon.name) // Lấy ra tên của từng add-on
                    .join(", "); // Kết hợp các tên với dấu phẩy, nhưng không có dấu phẩy ở đầu hoặc cuối

                  const addOnPrice = item.productAddOns.reduce(
                    (a, c) => a + c.price,
                    0
                  );
                  return (
                    <TableRow>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Stack direction={"column"}>
                          <Typography variant="body1" color="initial">
                            {getShortName(item.product.name)}
                          </Typography>
                          <Box sx={{ ml: 3 }}>
                            <Typography
                              sx={{ fontSize: "12px" }}
                              variant="body1"
                              color="initial"
                            >
                              Lựa chọn: {item.productOptionName}
                            </Typography>

                            <Typography
                              sx={{ fontSize: "12px" }}
                              variant="body1"
                              color="initial"
                            >
                              Tiện ích: {addonText}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <img
                          src={item.product.avatar}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                          alt=""
                        />
                      </TableCell>
                      <TableCell>{formatCurrency(item.price)}</TableCell>
                      <TableCell>
                        {formatCurrency(formatCurrency(addOnPrice))}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        {formatCurrency(
                          item.price * item.quantity + addOnPrice
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Order Summary */}
          <Stack
            direction="row"
            justifyContent="end"
            style={{ marginTop: "20px" }}
          >
            <Stack textAlign="right" spacing={2} marginTop={3}>
              <Typography variant="h7">
                Tổng tiền hàng: {formatCurrency(data.orderTotal)}
              </Typography>
              <Typography>
                Phí vận chuyển: {formatCurrency(data.shipCost)}
              </Typography>
              <Typography> Giảm giá: {formatCurrency(0)}</Typography>
              <Typography variant="h6">
                Tổng tiền phải thanh toán: {formatCurrency(data.orderTotal)}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

function OrderPage() {
  const { id } = useParams();

  // Use useQuery with the id from useParams
  const { data, isLoading, error } = useQuery({
    queryFn: () => getOneOrder(id), // Use id directly here
    queryKey: ["order", id], // Include id in the query key
    enabled: !!id, // Only run if id is defined
  });

  if (isLoading) return <Loading></Loading>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box>
      <Container
        maxWidth="lg"
        style={{ marginTop: "20px", padding: "20px 0", marginBottom: "50px" }}
      >
        <OrderTitle code={data.code}></OrderTitle>
        <OrderHeader
          code={data.code}
          orderStatus={data.order_status}
          paymentStatus={data.payment_status}
          time={data.create_at}
          uptime={data.update_at}
        />
        <OrderDetails data={data} />
      </Container>
    </Box>
  );
}

export default OrderPage;

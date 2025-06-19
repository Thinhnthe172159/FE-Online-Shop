import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Stack,
  Typography,
  Breadcrumbs,
  Link,
  Checkbox,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";

import Grid2 from "@mui/material/Grid2";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import ReceiptIcon from "@mui/icons-material/Receipt";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetch } from "../../../api/Fetch";
import {
  deleteCartItem,
  getGroupCart,
  updateQuantity,
} from "../../../api/cartApi";
import Loading from "../loading/Loading";
import { getOrder } from "../../../api/orderApi";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { ADD_ORDER } from "../../../redux/slice/OrderSlice";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = React.useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const { mutate } = useMutation({
    mutationFn: (data) => getOrder(data),

    onSuccess: (data) => {
      dispatch(ADD_ORDER(data));
      navigate("/order");
    },
    onError: (e) => {
      alert(e);
    },
  });

  const handleGetOrder = () => {
    if (product.length == 0) {
      Swal.fire({
        icon: "warning",
        text: "Vui lòng chọn sản phẩm để thanh toán",
      });
    } else {
      mutate(product);
    }
  };

  const login = useSelector((state) => state.auth.login);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["cart-group"],
    queryFn: getGroupCart,
    retry: 1,
    enabled: login,
  });

  const { mutate: handleDelete } = useMutation({
    mutationFn: (id) => deleteCartItem(id),
    onSuccess: () => {
      refetch();
      Swal.fire({
        icon: "success",
        text: "Xóa thành công",
      });
    },
    onError: (e) => {},
  });

  const { mutate: handleUpdate } = useMutation({
    mutationFn: (data) => {
      updateQuantity(data);
    },
    onSuccess: () => {
      setOpenSnackbar(true);
      refetch();
    },
    onError: (e) => {},
  });

  const handleQuantityChange = (cart_item_id, change) => {
    setProduct((prevProducts) =>
      prevProducts.map((item) =>
        item.id === cart_item_id
          ? { ...item, quantity: item.quantity + change }
          : item
      )
    );
    handleUpdate({ id: cart_item_id, quantity: change== 1 ? 1: 0 });
  };

  const totalPrice = product.reduce((total, item) => {
    // Tính giá trị addons cho từng sản phẩm
    const addonPrice = item.productAddOns.reduce(
      (addonTotal, addon) => addonTotal + addon.price,
      0
    );

    // Cộng giá sản phẩm với giá addons và nhân với số lượng
    return total + (item.product.price + addonPrice) * item.quantity;
  }, 0);


  const handleSelectCartitem = (e) => {
    let item = JSON.parse(e.target.value);
    // Kiểm tra xem sản phẩm đã được chọn chưa
    if (e.target.checked) {
      // Nếu đã check, thêm sản phẩm vào selectedProducts
      setProduct((prevSelected) => [...prevSelected, item]);
    } else {
      // Nếu uncheck, xóa sản phẩm khỏi selectedProducts
      setProduct((prevSelected) =>
        prevSelected.filter((selectedItem) => selectedItem.id !== item.id)
      );
    }
  };

  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const handleShortName = (name) => {
    if (name.length > 50) {
      return name.substring(0, 50);
    }
    return name;
  };

  if (isLoading) {
    return <Loading></Loading>;
  } else {
    return (
      <>
        <Box bgcolor={"#f3f3f3"} pb={5}>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="success"
              sx={{ width: "100%" }}
            >
              Đã cập nhật thành công
            </Alert>
          </Snackbar>
          {/* BREADCRUMBS */}
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            height={90}
            sx={{ boxShadow: 1 }}
            bgcolor={"white"}
            p={2}
          >
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                sx={{ fontWeight: "bold", color: "black" }}
                typography={"h6"}
                underline="hover"
                color="inherit"
              >
                Giỏ Hàng
              </Link>
              <Link
                sx={{ fontWeight: "bold" }}
                typography={"h6"}
                underline="hover"
                color="inherit"
              >
                Thanh toán
              </Link>
              <Link
                sx={{ fontWeight: "bold" }}
                typography={"h6"}
                underline="hover"
                color="inherit"
              >
                Hoàn Thành
              </Link>
            </Breadcrumbs>
          </Box>

          {/* CONTENT */}
          <Container>
            <Grid2 container spacing={2} mt={5}>
              <Grid2 item size={{ xs: 12, md: 9 }}>
                <Box p={2} bgcolor={"white"} sx={{ boxShadow: 1 }}>
                  <Stack justifyContent={"space-between"} direction={"row"}>
                    <Typography
                      typography={"h5"}
                      sx={{ fontWeight: "bold", color: "gray" }}
                    >
                      Giỏ hàng của bạn
                    </Typography>
                    {/* Đơn giá và các thứ */}
                    <Stack alignItems={"center"} gap={3} direction={"row"}>
                      <Stack direction={"row"} gap={10}>
                        <Typography
                          typography={"p"}
                          sx={{
                            fontWeight: "bold",
                            color: "gray",
                            fontSize: 13,
                          }}
                        >
                          Đơn giá
                        </Typography>
                        <Typography
                          typography={"p"}
                          sx={{
                            fontWeight: "bold",
                            color: "gray",
                            fontSize: 13,
                          }}
                        >
                          Số lượng
                        </Typography>
                        <Typography
                          typography={"p"}
                          sx={{
                            fontWeight: "bold",
                            color: "gray",
                            fontSize: 13,
                          }}
                        >
                          Tổng giá
                        </Typography>
                      </Stack>
                      <IconButton>
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Box>
                <Grid2 item size={{ xs: 12, md: 9 }} mt={2}>
                  {/* TABLE */}
                  {data &&
                    data.map((item, index) => (
                      <Box p={2} bgcolor={"white"} mt={2}>
                        {/* Thanh bên đầu */}
                        <Stack
                          sx={{ borderBottom: 0.2, borderBottomColor: "gray" }}
                          alignItems={"center"}
                          direction={"row"}
                        >
                          {/* <Checkbox></Checkbox> */}
                          <Stack
                            direction={"row"}
                            className="mb-2"
                            spacing={1}
                            sx={{ alignItems: "center" }}
                          >
                            <img
                              style={{
                                width: "35px",
                                objectFit: "cover",
                                borderRadius: "10px",
                              }}
                              src={item.shop.logo}
                              alt=""
                            />
                            <Typography sx={{ fontWeight: "bold" }}>
                              {item.shop.name}{" "}
                            </Typography>
                          </Stack>
                        </Stack>
                        {/* Thanh bên dưới */}
                        {item &&
                          item.cart_items.map((cart_item) => {
                            return (
                              <Stack
                                mt={2}
                                justifyContent={"space-between"}
                                alignItems={"center"}
                                direction={"row"}
                              >
                                {/* First BOX */}
                                <Stack direction={"row"}>
                                  <Checkbox
                                    value={JSON.stringify(cart_item)}
                                    onChange={handleSelectCartitem}
                                  ></Checkbox>
                                  {/* IMAGE */}
                                  <Box
                                    component="img"
                                    src={cart_item.product.avatar}
                                    alt="example"
                                    sx={{
                                      width: 80,
                                      height: 80,
                                      objectFit: "cover",
                                      borderRadius: 2,
                                    }}
                                  />
                                  {/* TEXT */}
                                  <Stack ml={2}>
                                    <Typography sx={{ fontWeight: "bold" }}>
                                      {handleShortName(cart_item.product.name)}
                                    </Typography>
                                    <Typography sx={{ fontSize: 12 }}>
                                      Lựa chọn: {cart_item.option.name}
                                    </Typography>
                                    {cart_item.productAddOns.length != 0 && (
                                      <Typography sx={{ fontSize: 12 }}>
                                        Lựa chọn:{" "}
                                        {cart_item.productAddOns
                                          .map((addon) => addon.name)
                                          .join(", ")}
                                      </Typography>
                                    )}
                                  </Stack>
                                </Stack>
                                {/* Second box */}
                                <Stack
                                  justifyContent={"center"}
                                  alignItems={"center"}
                                  gap={3}
                                  direction={"row"}
                                >
                                  <Stack
                                    alignItems={"center"}
                                    direction={"row"}
                                    gap={4}
                                  >
                                    <Typography sx={{ fontWeight: "bold" }}>
                                      {cart_item.productAddOns.length !== 0
                                        ? formatCurrency(
                                            cart_item.product.price +
                                              cart_item.productAddOns.reduce(
                                                (total, addon) =>
                                                  total + addon.price,
                                                0
                                              )
                                          )
                                        : formatCurrency(
                                            cart_item.product.price
                                          )}
                                    </Typography>
                                    {/* điều chỉnh số lượng */}
                                    <Stack
                                      sx={{ borderRadius: 50, border: 1 }}
                                      direction={"row"}
                                      alignItems={"center"}
                                    >
                                      <Button
                                        variant="text"
                                        onClick={() =>
                                          handleQuantityChange(cart_item.id,-1)
                                        } // Giảm số lượng
                                        disableRipple
                                        sx={{
                                          fontWeight: "bold",
                                          color: "black",
                                          ":hover": {
                                            backgroundColor: "transparent",
                                          },
                                        }}
                                      >
                                        -
                                      </Button>
                                      <Typography>
                                        {cart_item.quantity}
                                      </Typography>
                                      <Button
                                        variant="text"
                                        onClick={() =>
                                          handleQuantityChange(cart_item.id,1)
                                        }
                                        disableRipple
                                        sx={{
                                          fontWeight: "bold",
                                          color: "black",
                                          ":hover": {
                                            backgroundColor: "transparent",
                                          },
                                        }}
                                      >
                                        +
                                      </Button>
                                    </Stack>
                                    <Typography sx={{ fontWeight: "bold" }}>
                                      {cart_item.productAddOns.length !== 0
                                        ? formatCurrency(
                                            (cart_item.product.price +
                                              cart_item.productAddOns.reduce(
                                                (total, addon) =>
                                                  total + addon.price,
                                                0
                                              )) *
                                              cart_item.quantity
                                          )
                                        : formatCurrency(
                                            cart_item.product.price *
                                              cart_item.quantity
                                          )}
                                    </Typography>
                                  </Stack>
                                  <IconButton
                                    onClick={() => handleDelete(cart_item.id)}
                                  >
                                    <DeleteOutlineIcon />
                                  </IconButton>
                                </Stack>
                              </Stack>
                            );
                          })}
                      </Box>
                    ))}
                </Grid2>
              </Grid2>
              <Grid2 item size={{ xs: 12, md: 3 }}>
                {/* CART TOTAL */}
                <Stack sx={{ boxShadow: 1 }} bgcolor={"white"} p={2}>
                  <Box
                    sx={{ borderBottom: 1 }}
                    display={"flex"}
                    p={2}
                    bgcolor={"white"}
                  >
                    <Typography sx={{ fontWeight: "bold", color: "gray" }}>
                      <ReceiptIcon sx={{ mr: 1 }} />
                      Tóm tắt đơn hàng
                    </Typography>
                  </Box>
                  <Stack
                    p={2}
                    display={"flex"}
                    justifyContent={"space-between"}
                    direction={"row"}
                    spacing={2}
                  >
                    <Typography sx={{ fontWeight: "bold" }}>Tổng</Typography>
                    <Typography sx={{ fontWeight: "bold" }}>
                      {formatCurrency(totalPrice)}
                    </Typography>
                  </Stack>
                  <Stack>
                    <Button
                      onClick={handleGetOrder}
                      variant="contained"
                      sx={{
                        borderRadius: 20,
                        bgcolor: "#ffcf20",
                        fontWeight: "bold",
                        color: "#1b1b1b",
                        "&:hover": {
                          backgroundColor: "#ffcf20",
                          color: "White", // Keeps the same background color on hover
                          boxShadow: "none", // Removes shadow if any
                        },
                      }}
                    >
                      Thanh toán
                    </Button>
                  </Stack>
                </Stack>

                {/* BELOW SHIT IDK */}
                <Stack
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  p={2}
                  mt={2}
                >
                  <img
                    src="https://baabrand.com/wp-content/uploads/2018/12/icon-thiet-ke-linh-vuc-logo-thuong-hieu-thoi-trang-my-pham-lam-dep-spa-baa-brand-1-400x400.png"
                    alt="Girl in a jacket"
                    style={{ width: "50%" }}
                  ></img>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: 10,
                      color: "gray",
                      fontStyle: "italic",
                    }}
                    mt={2}
                  >
                    Mỗi sản phẩm trên 6MEMs được chuẩn bị và gửi đi từ các nhà
                    cung cấp ở nhiều địa điểm khác nhau. Bạn có thể thấy phí
                    giao hàng được áp dụng ở trang tiếp theo.
                  </Typography>
                </Stack>
              </Grid2>
            </Grid2>
          </Container>
        </Box>
      </>
    );
  }
};

export default Cart;

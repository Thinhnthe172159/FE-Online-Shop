import React, { useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Paper,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useQuery } from "@tanstack/react-query";
import { getAllShop } from "../../../api/shopApi";
import Loading from "../../client-module/loading/Loading";
import StarIcon from "@mui/icons-material/Star";
import { Container } from "react-bootstrap";
import ViewShopOwner from "./ViewShopOwner";
import { Link, useNavigate } from "react-router-dom";
const ManageShop = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["get-all-shop"],
    queryFn: getAllShop,
  });
  console.log(data);

  const navigate = useNavigate();

  const [open, setOpen] = useState({});

  const handleToggle = (id) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <Box sx={{ mt: 3, mr: 5 }}>
      <h3>Tất cả cửa hàng</h3>
      <TableContainer sx={{ mt: 3 }} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Tên cửa hàng</TableCell>
              <TableCell>Logo</TableCell>
              <TableCell>Số sản phẩm</TableCell>
              <TableCell>Đánh giá</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((shop) => (
              <React.Fragment key={shop.id}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => handleToggle(shop.id)}
                    >
                      {open[shop.id] ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={1}>
                      <b>{shop.name}</b>
                      {shop.productInactive > 0 && (
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: "12px",
                            padding: "3px",
                            background: "#f0a1a158",
                            width: "120px",
                            textAlign: "center",
                            color: "red",
                            fontWeight: "600",
                            borderRadius: "10px",
                          }}
                          color="initial"
                        >
                          {shop.productInactive} sản phẩm mới
                        </Typography>
                      )}

                      {shop.newTransaction > 0 && (
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: "12px",
                            padding: "3px",
                            background: "#f0a1a158",
                            width: "120px",
                            textAlign: "center",
                            color: "red",
                            fontWeight: "600",
                            borderRadius: "10px",
                          }}
                          color="initial"
                        >
                          {shop.newTransaction} Giao dịch mới
                        </Typography>
                      )}
                       {shop.newOrderRequest > 0 && (
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: "12px",
                            padding: "3px",
                            background: "#f0a1a158",
                            width: "120px",
                            textAlign: "center",
                            color: "red",
                            fontWeight: "600",
                            borderRadius: "10px",
                          }}
                          color="initial"
                        >
                          {shop.newOrderRequest} Yêu cầu hủy đơn
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <img
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                      src={shop.logo}
                      alt=""
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Stack direction={"column"}>
                        <Stack
                          direction={"row"}
                          spacing={1}
                          sx={{ alignItems: "center" }}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clip-path="url(#clip0_280_88461)">
                              <g clip-path="url(#clip1_280_88461)">
                                <path
                                  d="M21.9636 7.09765C21.9416 7.0384 21.9096 6.98339 21.8689 6.93505C21.8548 6.91771 21.8393 6.90148 21.8227 6.88651C21.7821 6.84521 21.7344 6.81151 21.6819 6.787L12.2532 2.06183C12.1732 2.02189 12.0851 2.0011 11.9958 2.0011C11.9064 2.0011 11.8183 2.02189 11.7384 2.06183L2.30963 6.77487C2.23114 6.81344 2.16265 6.86967 2.10957 6.93915C2.05648 7.00863 2.02024 7.08947 2.00368 7.17531C1.99877 7.21561 1.99877 7.25635 2.00368 7.29665V16.713C2.00327 16.8196 2.03289 16.9242 2.08915 17.0147C2.1454 17.1053 2.22601 17.1782 2.32177 17.2251L11.7335 21.9357C11.816 21.9787 11.9076 22.0011 12.0006 22.0011C12.0936 22.0011 12.1853 21.9787 12.2677 21.9357L21.6819 17.2251C21.7777 17.1782 21.8583 17.1053 21.9145 17.0147C21.9708 16.9242 22.0004 16.8196 22 16.713V7.29423C22.0002 7.22701 21.9878 7.16035 21.9636 7.09765ZM12.0079 11.3714L8.5647 9.64346L16.7114 5.57356L20.1424 7.28695L12.0079 11.3714ZM11.4324 12.3664V20.4966L3.15222 16.3708V8.21645L11.4324 12.3664ZM3.84912 7.28695L11.9958 3.21461L15.4268 4.928L7.28018 9.00276L3.84912 7.28695ZM12.5713 20.4966V12.3543L20.8514 8.22858V16.3587L12.5713 20.4966ZM11.9958 21.71C12.0191 21.7137 12.0429 21.7137 12.0662 21.71C12.0427 21.7129 12.019 21.7121 11.9958 21.7076V21.71ZM21.5532 16.9654L12.1293 21.6736L21.5532 16.9654C21.5757 16.9531 21.5969 16.9385 21.6163 16.9217C21.5969 16.9385 21.5757 16.9531 21.5532 16.9654Z"
                                  fill="#1B1B1B"
                                ></path>
                              </g>
                            </g>
                            <defs>
                              <clipPath id="clip0_280_88461">
                                <rect
                                  width="24"
                                  height="24"
                                  fill="white"
                                  transform="translate(0 0.000976562)"
                                ></rect>
                              </clipPath>
                              <clipPath id="clip1_280_88461">
                                <rect
                                  width="24"
                                  height="24"
                                  fill="white"
                                  transform="translate(0 0.000976562)"
                                ></rect>
                              </clipPath>
                            </defs>
                          </svg>
                          <Typography
                            sx={{ fontSize: "19px", fontWeight: "700" }}
                            variant="body1"
                            color="initial"
                          >
                            {shop.productActive}
                          </Typography>
                        </Stack>

                        <Box>
                          <Typography
                            className="mt-2"
                            sx={{
                              fontSize: "12px",
                              color: "#868686",
                              fontWeight: "500",
                              lineHeight: "12px",
                            }}
                            variant="body1"
                            color="initial"
                          >
                            Sản phẩm
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Stack direction={"column"}>
                        <Stack
                          direction={"row"}
                          spacing={1}
                          sx={{ alignItems: "center" }}
                        >
                          <StarIcon sx={{ color: "orange" }}></StarIcon>
                          <Typography
                            variant="body1"
                            sx={{ fontSize: "19px", fontWeight: "700" }}
                            color="initial"
                          >
                            {shop.rating.toFixed(1)}
                          </Typography>
                        </Stack>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#868686",
                            fontWeight: "500",
                            lineHeight: "12px",
                          }}
                          variant="body1"
                          color="initial"
                        >
                          Đánh giá
                        </Typography>
                      </Stack>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Button
                      sx={{ textTransform: "initial" }}
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        navigate("/admin/shop-detail/" + shop.id);
                      }}
                    >
                      Xem chi tiết cửa hàng
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6} // Thay đổi thành 6 để chiếm toàn bộ chiều rộng
                  >
                    <Collapse in={open[shop.id]} timeout="auto" unmountOnExit>
                      <Box margin={1} sx={{ width: "100%" }}>
                        <Container style={{ width: "100%" }}>
                          {" "}
                          {/* Đặt width: 100% cho Container */}
                          <ViewShopOwner
                            owner={shop.owner}
                            tax={shop.taxNumber}
                          />
                        </Container>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      
      </TableContainer>
    </Box>
  );
};

export default ManageShop;

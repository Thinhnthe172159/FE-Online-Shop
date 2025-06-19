import React, { useState } from "react";
import {
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Box,
  Tabs,
  Tab,
  Stack,
  Button,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import TabPanel from "./ProductPanel"; // Import TabPanel from a separate file
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProductRow = ({ product, handleDeleteProduct, handleChangeStatus }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const { options, addOns } = product;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Tính tổng số lượng từ tất cả các options
  const totalQuantity = product.options.reduce((sum, option) => sum + option.quantity, 0);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>

        <TableCell component="th" scope="row">
          {product.id}
        </TableCell>
        <TableCell>
          <img
            style={{ width: "90px", height: "100px", objectFit: "cover" }}
            src={product.avatar}
            alt=""
          />
        </TableCell>
        <TableCell>{product.name}</TableCell>
        <TableCell>{product.price.toLocaleString()} đ</TableCell>
        <TableCell width={"10%"}>{totalQuantity}</TableCell>
        <TableCell>
          <Stack direction={"row"} spacing={2}>
            <Button
              onClick={() => navigate("/seller/update-product/" + product.id)}
              variant="outlined"
              color="success"
              disabled={product.status !== 1}
            >
              Cập nhật
            </Button>
            <Button
              onClick={() => handleDeleteProduct(product.id)}
              color="error"
            >
              Xóa
            </Button>
          </Stack>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab
                  sx={{ textTransform: "capitalize" }}
                  label="Thông tin sản phẩm"
                />
                <Tab
                  sx={{ textTransform: "capitalize" }}
                  label="Số lượng còn lại"
                />
                <Tab
                  sx={{ textTransform: "capitalize" }}
                  label="Tiện ích bổ sung"
                />
              </Tabs>
              <TabPanel value={value} index={0}>
                <Stack
                  sx={{ alignItems: "start" }}
                  direction={"row"}
                  spacing={5}
                >
                  <Box sx={{ width: "40%" }} className="product-avatar">
                    <img
                      className="product-avatar-img"
                      src={product.avatar}
                      alt=""
                    />
                  </Box>
                  <Box className="product-info" sx={{ width: "60%" }}>
                    <Stack
                      className="product-info-item"
                      direction={"row"}
                      spacing={3}
                    >
                      <p className="product-name">Tên sản phẩm:</p>
                      <p>{product.name}</p>
                    </Stack>
                    <Stack
                      className="product-info-item"
                      direction={"row"}
                      spacing={3}
                    >
                      <p className="product-name">Giá sản phẩm:</p>
                      <p>{product.price.toLocaleString()} đ</p>
                    </Stack>
                    <Stack
                      className="product-info-item"
                      direction={"row"}
                      spacing={3}
                      sx={{ flexWrap: "wrap" }}
                    >
                      <p className="product-name">Thể loại:</p>
                      {product.categories && product.categories.length > 0 ? (
                        product.categories.map((category, index) => (
                          <Button
                            key={index}
                            variant="outlined"
                            color="primary"
                            sx={{
                              textTransform: "capitalize",
                              marginRight: "8px",
                              marginBottom: "8px",
                            }}
                          >
                            {category.name}
                          </Button>
                        ))
                      ) : (
                        <p>Không có thể loại nào</p>
                      )}
                    </Stack>
                    <Stack
                      direction={"row"}
                      spacing={3}
                      className="product-info-item"
                    >
                      <p className="product-name">Chiều rộng</p>
                      <p>{product.width.toLocaleString()} cm</p>
                    </Stack>
                    <Stack
                      direction={"row"}
                      spacing={3}
                      className="product-info-item"
                    >
                      <p className="product-name">Chiều dài</p>
                      <p>{product.length.toLocaleString()} cm</p>
                    </Stack>
                    <Stack
                      direction={"row"}
                      spacing={3}
                      className="product-info-item"
                    >
                      <p className="product-name">Chiều cao</p>
                      <p>{product.height.toLocaleString()} cm</p>
                    </Stack>
                    <Stack
                      direction={"row"}
                      spacing={3}
                      className="product-info-item"
                    >
                      <p className="product-name">Trọng lượng</p>
                      <p>{product.weight.toLocaleString()} kg</p>
                    </Stack>
                    <Stack
                      direction={"row"}
                      spacing={3}
                      className="product-info-item"
                    >
                      <p className="product-name">Ngày tạo</p>
                      <p>10-10-2024</p>
                    </Stack>
                    <Stack
                      direction={"row"}
                      spacing={3}
                      className="product-info-item"
                    >
                      <p className="product-name">Trạng thái</p>
                      <Button
                        color={product.status !== 0 ? "success" : "error"}
                        variant="outlined"
                      >
                        {product.status == 0 && "Chờ duyệt"}
                        {product.status == 1 && "Đang hoạt động"}
                        {product.status == 2 && "Ngừng kinh doanh"}
                        {product.status == 3 && "Bị từ chối"}
                      </Button>
                    </Stack>
                    <Stack
                      className="mt-5"
                      direction={"row"}
                      spacing={2}
                      sx={{ justifyContent: "end" }}
                    >
                      {product.status !== 0 && product.status !== 3 ? (
                        <Button
                        onClick={() => handleChangeStatus(product.id, product.status)}
                        color={product.status === 1 ? "error" : "success"}
                        variant="contained"
                        disabled={product.status === 0 || product.status === 3} // Disable for pending/rejected
                      >
                        {product.status === 1 ? "Ngừng kinh doanh" : "Hoạt động trở lại"}
                      </Button>
                      ) : (
                        ""
                      )}
                    </Stack>
                  </Box>
                </Stack>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Container>
                  <TableContainer sx={{ width: "600px" }} component={Paper}>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Tên lựa chọn</TableCell>
                          <TableCell>Số lượng</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {options && options.length > 0 ? (
                          options.map((option) => (
                            <TableRow key={option.id}>
                              <TableCell>{option.name}</TableCell>
                              <TableCell>{option.quantity}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={2}>
                              Không có lựa chọn nào
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Container>
              </TabPanel>
              <TabPanel value={value} index={2}>
                <Container>
                  <TableContainer sx={{ width: "600px" }} component={Paper}>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Tên tiện ích</TableCell>
                          <TableCell>Giá tiền</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {addOns && addOns.length > 0 ? (
                          addOns.map((addOn) => (
                            <TableRow key={addOn.id}>
                              <TableCell>{addOn.name}</TableCell>
                              <TableCell>{addOn.price} vnd</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={2}>
                              Không có tiện ích nào
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Container>
              </TabPanel>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ProductRow;

import React, { useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  Snackbar,
  Stack,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import HomeIcon from "@mui/icons-material/Home";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ClearIcon from "@mui/icons-material/Clear";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { fetch } from "../../../api/Fetch"; // Giả sử fetch đã được cấu hình với token
import ProfileNav from "../../../components/client/profileNav/ProfileNav";
import { useNavigate } from "react-router-dom";

function Favourite() {
  const [openSnackbarFav, setOpenSnackbarFav] = React.useState(false);
  const [products, setProducts] = React.useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch.get(`/favourite/view-favourite`).then((data) => {
      setProducts(data.data.data.favourite_items || []);
    });
  }, []);

  const handleNavigateDetails = (id) => {
    navigate(`/product-detail/${id}`);
    window.scrollTo(0, 0);
  };

  const handleDelete = (id) => {
    const data = { id };
    fetch.put(`/favourite/delete-favourite`, data).then(() => {
      setOpenSnackbarFav(true);
      setProducts(products.filter((product) => product.id !== id));
    });
  };

  const handleDeleteAll = () => {
    fetch.delete(`/favourite/delete-all-favourite`).then(() => {
      setProducts([]);
    });
  };

  const handleNavigatingHome = () => {
    navigate("/");
  };

  const handleCloseSnackbarFav = () => {
    setOpenSnackbarFav(false);
  };

  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <Box bgcolor={"#f3f3f3"}>
      <Container>
        <Grid2 container py={5} spacing={5}>
          <Grid2 className="favourite" item size={{ xs: 12, md: 4 }}>
            <ProfileNav />
          </Grid2>

          <Grid2 item size={{ xs: 12, md: 8 }}>
            <Box boxShadow={2} bgcolor={"white"} p={2}>
              <Typography sx={{ fontWeight: "bold" }} variant="h5">
                YÊU THÍCH
              </Typography>
            </Box>
            <Grid2 container spacing={4} mt={5}>
              {products.map((product, index) => (
                <Grid2 item xs={12} sm={6} md={4} key={index}>
                  <IconButton
                    onClick={() => handleDelete(product.id)}
                    sx={{ position: "absolute" }}
                  >
                    <HighlightOffIcon />
                  </IconButton>
                  <Card sx={{ width: 230 }}>
                    <CardMedia
                      sx={{ height: 200 }}
                      image={product.product.avatar}
                      title="product image"
                    />
                    <CardContent>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontWeight: "bold",
                          fontSize: "17px",
                        }}
                      >
                        {product.product.name.length > 20
                          ? `${product.product.name.substring(0, 20)}...`
                          : product.product.name}
                      </Typography>
                      <Typography
                        mt={2}
                        pb={1}
                        gutterBottom
                        variant="p"
                        sx={{
                          fontWeight: "bold",
                          color: "#51b699",
                          borderBottom: "1px solid #bdc3c7",
                        }}
                        component="div"
                      >
                        {formatCurrency(product.product.price)}
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="p"
                        sx={{ fontSize: "12px", opacity: "0.6" }}
                        component="div"
                      >
                        {product.product.description.length > 25
                          ? `${product.product.description.substring(0, 35)}...`
                          : product.product.description}
                      </Typography>
                      <Button
                        onClick={() => handleNavigateDetails(product.product.id)}
                        sx={{
                          mt: 2,
                          width: "100%",
                          backgroundColor: "#ffcf20",
                          color: "#1b1b1b",
                          borderRadius: "999px",
                          textTransform: "capitalize",
                        }}
                      >
                        <b>Chi tiết</b>
                      </Button>
                    </CardContent>
                  </Card>
                </Grid2>
              ))}
            </Grid2>

            <Stack direction="row" spacing={2} justifyContent="flex-start" mt={5}>
              <Button
                sx={{ borderRadius: 20, bgcolor: "#bdc3c7" }}
                variant="contained"
                disableElevation
                startIcon={<ClearIcon />}
                onClick={handleDeleteAll}
              >
                XÓA YÊU THÍCH
              </Button>
              <Button
                sx={{ borderRadius: 20, bgcolor: "#ffcf20", color: "#1b1b1b" }}
                variant="contained"
                disableElevation
                startIcon={<ShoppingCartIcon />}
                onClick={handleNavigatingHome}
              >
                TIẾP TỤC MUA SẮM
              </Button>
            </Stack>
          </Grid2>
        </Grid2>

        <Snackbar
          open={openSnackbarFav}
          autoHideDuration={3000}
          onClose={handleCloseSnackbarFav}
        >
          <Alert
            onClose={handleCloseSnackbarFav}
            severity="success"
            sx={{ width: "100%" }}
          >
            Bạn đã xóa sản phẩm yêu thích!!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default Favourite;
import React, { useEffect, useState, useRef } from "react";
import "./product-detail.css";
import { useNavigate, useParams } from "react-router-dom";
import "./product-detail.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import TextsmsIcon from "@mui/icons-material/Textsms";
import parse from "html-react-parser";
import {
  Box,
  Button,
  IconButton,
  Divider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Snackbar,
  Alert,
  TextField,
  Rating,
  Typography,
  Breadcrumbs,
  Link,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { Container } from "react-bootstrap";
import { fetch } from "../../../api/Fetch";
import axios from "axios";
import { queryClient } from "../../../main";
import { useDispatch, useSelector } from "react-redux";
import FeedBack from "./FeedBack";
import { South } from "@mui/icons-material";
import Swal from "sweetalert2";
import { SET_SHOP } from "../../../redux/slice/ChatSlice";

const Detail = () => {
  const navigate = useNavigate();
  const login = useSelector((state) => state.auth.login);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openSnackbarFav, setOpenSnackbarFav] = useState(false);
  const [customerNote, setCustomerNote] = useState("");
  const [rating, setRating] = useState(5);

  const turquoiseColor = " #40B39D";
  const infoRef = useRef(null);
  const descriptionRef = useRef(null);
  const notesRef = useRef(null);
  const [images, setImages] = useState([]);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]); // Khi id thay đổi, sẽ cuộn lại lên đầu trang
  const handleAddOnChange = (event, newAddOn) => {
    if (newAddOn) {
      if (selectedAddOns.includes(newAddOn)) {
        setSelectedAddOns(selectedAddOns.filter((id) => id !== newAddOn));
      } else {
        setSelectedAddOns([...selectedAddOns, newAddOn]);
      }
    }
  };
  const brandRef = useRef(null);
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:8080/product/getbyID/${id}`)
      .then((response) => {
        setProduct(response.data);
        setImages(response.data.images);
        setMainImage(response.data.avatar);
        if (response.data.options && response.data.options.length > 0) {
          setSelectedOption(response.data.options[0]);
        }
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra khi lấy dữ liệu sản phẩm!", error);
      });

    axios
      .get(`http://localhost:8080/favourite/is-product-favourite/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setIsFavorited(response.data.data);
      });

    axios
      .get(`http://localhost:8080/feedback/get-avg/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const ratingValue = response.data;
        setRating(isNaN(ratingValue) || ratingValue === null ? 0 : ratingValue);
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra khi lấy dữ liệu đánh giá!", error);
      });
  }, [id]);
  const dispatch = useDispatch()
  
  const setChat = (shop) =>{
    dispatch(SET_SHOP({shop}))
    navigate("/chat")
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleOptionChange = (event, newOption) => {
    if (newOption !== null) {
      setSelectedOption(newOption);
    }
  };

  const handleAddToCart = () => {
    if (!login) {
      navigate("/login");
    }
    const data = {
      product: { ...product, brand: null, option: null },
      option: selectedOption,
      quantity: quantity,
      addOns: selectedAddOns.length == 0 ? "" : selectedAddOns.join(","),
    };
    fetch
      .post("/cart/add-to-cart", data)
      .then((data) => {
        setOpenSnackbar(true);      
        queryClient.refetchQueries(["totalItem"]);
      })
      .catch((e) => {
         Swal.fire({
          icon:"error",
          text:"Sản phẩm không đủ số lượng"
         })
      });
   
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const scrollToSection = (sectionRef) => {
    sectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const shortDesc = (desc) => {
    if (desc.length > 30) {
      return desc.substring(0, 30) + "...";
    }
    return desc;
  };

  const handleFavouriteClick = (id) => {
    if (!login) {
      navigate("/login");
    }
    // Gửi yêu cầu thêm/xóa sản phẩm khỏi danh sách yêu thích
    const data = {
      product: { ...product, brand: null, option: null },
    };

    if (isFavorited) {
      fetch.delete(`/favourite/delete-details/${id}`).then(() => {
        queryClient.refetchQueries(["totalFavourites"]);
      });
    } else {
      fetch
        .post("/favourite/add-to-favourite", data)
        .then((data) => {
          queryClient.refetchQueries(["totalFavourites"]);
        })
        .catch((e) => console.log(e));
    }

    setIsFavorited(!isFavorited);
    setOpenSnackbarFav(true);
  };

  const handleCloseSnackbarFav = () => {
    setOpenSnackbarFav(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        paddingTop: "10px",
        paddingBottom: "200px",
      }}
      className="product-container "
    >
      <Container style={{ width: "80%" }} className="mt-5">

        {product ? (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{ justifyContent: "space-between" }}
            spacing={5}
          >
            {/* Product Image */}
            <Box className="product-image-container">
              {/* Hình ảnh chính */}
              <img
                src={mainImage}
                alt={product.name}
                className="product-image"
                style={{ width: "100%", maxHeight: "500px", marginBottom: "10px" }}
              />

              {/* Danh sách hình ảnh thumbnail (bao gồm cả mainImage) */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "10px",
                }}
              >
                <img
                    
                    src={product.avatar}
                    alt={`product}`}
                    style={{ width: "70px", height: "70px", cursor: "pointer", border: product.avatar === mainImage ? '2px solid #ffc107' : 'none' }}
                    onClick={() => setMainImage(product.avatar)}
                  />
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img.image}
                    alt={`product-image-${index}`}
                    style={{ width: "70px", height: "70px", cursor: "pointer", border: img.image === mainImage ? '2px solid #ffc107' : 'none' }}
                    onClick={() => setMainImage(img.image)}
                  />
                ))}
              </Box>
            </Box>
            {/* Product Info */}
            <Box className="product-info" sx={{ width: "55%" }}>
              <Typography
                sx={{ fontSize: "25px" }}
                fontWeight="bold"
                gutterBottom
              >
                {product.name}
              </Typography>

              {/* Rating, Favorite, and Chat */}
              <Box
                sx={{ display: "flex", alignItems: "center", marginY: "10px" }}
                className="star-rating"
              >
                <Rating
                  name="half-rating-read"
                  value={rating}
                  precision={0.5} // Đặt độ chính xác cho nửa sao
                  readOnly
                  sx={{
                    "& .MuiRating-iconFilled": {
                      color: "#ffc107", // Màu sao được đánh giá
                    },
                    "& .MuiRating-iconEmpty": {
                      color: "#e0e0e0", // Màu sao chưa được đánh giá
                    },
                  }}
                />
                <Box
                  variant="body2"
                  sx={{
                    marginLeft: "2px",
                    marginRight: "10px",
                    fontSize: "15px",
                  }}
                  className="rating-text"
                >
                  (Đánh giá: {rating})
                </Box>

                {/* Favorite Button */}
                <Box
                  sx={{
                    display: "flex",
                    gap: "3px",
                    cursor: "pointer",
                    alignItems: "center",
                  }}
                  onClick={() => handleFavouriteClick(product.id)}
                >
                  <IconButton sx={{ color: isFavorited ? "red" : "gray" }}>
                    {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                  <Typography
                    variant="body2"
                    sx={{ marginRight: "10px", fontSize: "15px" }}
                  >
                    Yêu thích
                  </Typography>
                </Box>

                {/* Chat Button */}
                <Box
                  sx={{
                    display: "flex",
                    gap: "3px",
                    cursor: "pointer",
                    alignItems: "center",
                  }}
                  onClick={() => setChat(product.shop)}
                >
                  <IconButton sx={{}}>
                    <img
                      src="data:image/svg+xml,%3Csvg width='17' height='16' viewBox='0 0 17 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2.95219 11.5086L2.91125 14.9471L6.34972 11.4268C8.09624 11.4404 12.0887 11.4677 14.0863 11.4677C16.0839 11.4677 16.5287 10.649 16.5014 10.2397V2.17567C16.5014 1.32424 15.4917 0.729315 14.9868 0.53828C11.0708 0.470051 3.0013 0.358154 2.05163 0.456396C1.10195 0.554638 0.618931 1.45248 0.496129 1.88912L0.209595 10.035L1.06922 11.0993L2.95219 11.5086Z' fill='%23FFCF20'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M2.83044 15.2855C2.86488 15.299 2.90097 15.3057 2.93641 15.3057C3.01555 15.3057 3.09271 15.2735 3.14867 15.2133L6.3661 11.7511H14.7296C15.8879 11.7511 16.8304 10.8087 16.8304 9.65032V2.40647C16.8304 1.24811 15.8879 0.305664 14.7296 0.305664H2.12542C0.96707 0.305664 0.0246231 1.24811 0.024292 2.40647V9.65032C0.024292 10.8087 0.966738 11.7511 2.12509 11.7511H2.64665V15.0159C2.64665 15.1348 2.7195 15.2418 2.83044 15.2855ZM0.604132 2.40647C0.604132 1.56734 1.28663 0.885173 2.12542 0.885173H14.7296C15.5687 0.885173 16.2509 1.56767 16.2509 2.40647V9.65032C16.2509 10.4891 15.5684 11.1716 14.7296 11.1716H6.24027C6.1598 11.1716 6.08297 11.2051 6.028 11.264L3.22649 14.2784V11.4614C3.22649 11.3014 3.09668 11.1716 2.93674 11.1716H2.12542C1.2863 11.1716 0.604132 10.4891 0.604132 9.65032V2.40647ZM6.91481 6.02823C6.91481 6.86239 7.59334 7.54091 8.4275 7.54091C9.26166 7.54091 9.94018 6.86239 9.94018 6.02823C9.94018 5.19407 9.26166 4.51555 8.4275 4.51555C7.59334 4.51555 6.91481 5.19407 6.91481 6.02823ZM7.49432 6.02856C7.49432 5.51396 7.91289 5.09539 8.4275 5.09539C8.9421 5.09539 9.36067 5.51396 9.36067 6.02856C9.36067 6.54316 8.9421 6.96173 8.4275 6.96173C7.91289 6.96173 7.49432 6.54316 7.49432 6.02856ZM3.59804 7.54091C2.76388 7.54091 2.08536 6.86239 2.08536 6.02823C2.08536 5.19407 2.76388 4.51555 3.59804 4.51555C4.4322 4.51555 5.11072 5.19407 5.11072 6.02823C5.11072 6.86239 4.4322 7.54091 3.59804 7.54091ZM3.59804 5.09539C3.08344 5.09539 2.66486 5.51396 2.66486 6.02856C2.66486 6.54316 3.08344 6.96173 3.59804 6.96173C4.11264 6.96173 4.53121 6.54316 4.53121 6.02856C4.53121 5.51396 4.11264 5.09539 3.59804 5.09539ZM11.7439 6.02823C11.7439 6.86239 12.4225 7.54091 13.2566 7.54091C14.0908 7.54091 14.7693 6.86239 14.7693 6.02823C14.7693 5.19407 14.0908 4.51555 13.2566 4.51555C12.4225 4.51555 11.7439 5.19407 11.7439 6.02823ZM12.3235 6.02856C12.3235 5.51396 12.742 5.09539 13.2566 5.09539C13.7712 5.09539 14.1898 5.51396 14.1898 6.02856C14.1898 6.54316 13.7712 6.96173 13.2566 6.96173C12.742 6.96173 12.3235 6.54316 12.3235 6.02856Z' fill='black'/%3E%3C/svg%3E%0A"
                      alt=""
                    />
                  </IconButton>
                  <Typography sx={{ fontSize: "15px" }} variant="body2">
                    Trò chuyện cùng Thương hiệu
                  </Typography>
                </Box>
              </Box>

              {/* Brand and Address */}
              <Box variant="body2" sx={{ marginTop: "5px", fontSize: "18px" }}>
                Cửa hàng:{" "}
                <span style={{ color: turquoiseColor }}>
                  {product.shop?.name || "N/A"}
                </span>{" "}
              </Box>

              {/* Product Price */}
              <Box
                variant="h4"
                sx={{
                  color: turquoiseColor,
                  marginTop: "20px",
                  padding: "20px 0",
                  borderTop: "1px solid #e0e0e0",
                  borderBottom: "1px solid #e0e0e0",
                }}
                className="product-price"
              >
                {product.price.toLocaleString()} ₫
              </Box>

              <Divider sx={{ marginY: "15px" }} />

              {/* Product Options */}
              <Box
                sx={{
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "50px",
                }}
              >
                <Typography variant="body2" sx={{ marginRight: "10px" }}>
                  Lựa chọn:
                </Typography>
                <ToggleButtonGroup
                  value={selectedOption}
                  exclusive
                  onChange={handleOptionChange}
                  aria-label="Lựa chọn sản phẩm"
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    "& .MuiToggleButton-root": {
                      padding: "10px 20px",
                      borderRadius: "999px",
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                      border: "1px solid #ccc",
                      textTransform: "capitalize",
                      "&.Mui-selected": {
                        backgroundColor: "#fffae9",
                        color: "#ffcf20",
                        borderColor: "#ffcf20",
                      },
                      "&:hover": {
                        backgroundColor: "#fffae9",
                        color: "#ffcf20",
                        borderColor: "#ffcf20",
                      },
                    },
                  }}
                >
                  {product.options &&
                    product.options.map((option) => (
                      <ToggleButton
                        key={option.id}
                        value={option}
                        aria-label={option.name}
                      >
                        {option.name}
                      </ToggleButton>
                    ))}
                </ToggleButtonGroup>
              </Box>

              {/* Add-ons */}
              {product && product.addOns.length != 0 ? (
                <Box
                  sx={{
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "50px",
                  }}
                >
                  <Box variant="body2" sx={{ marginRight: "10px" }}>
                    Các lựa chọn:
                  </Box>
                  <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {product.addOns.map((option) => (
                      <ToggleButton
                        key={option.id}
                        value={option.id}
                        selected={selectedAddOns.includes(option.id)} // Kiểm tra trạng thái selected
                        onChange={handleAddOnChange}
                        aria-label={option.name}
                        sx={{
                          padding: "10px 20px",
                          borderRadius: "999px",
                          fontSize: "0.875rem",
                          fontWeight: "bold",
                          border: "1px solid #ccc",
                          textTransform: "capitalize",
                          "&.Mui-selected": {
                            backgroundColor: "#fffae9",
                            color: "#ffcf20",
                            borderColor: "#ffcf20",
                          },
                          "&:hover": {
                            backgroundColor: "#fffae9",
                            color: "#ffcf20",
                            borderColor: "#ffcf20",
                          },
                        }}
                      >
                        {option.name} + {option.price.toLocaleString()} ₫
                      </ToggleButton>
                    ))}
                  </Box>
                </Box>
              ) : (
                ""
              )}

              {/* Customer Note */}
             

              <div className="row gap-3">
                <div className="col-md-4">
                  {/* Quantity Control */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "20px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      padding: "5px",
                      width: "150px",
                      justifyContent: "space-between",
                    }}
                    className="quantity-controls"
                  >
                    <IconButton onClick={decreaseQuantity} color="primary">
                      <RemoveIcon />
                    </IconButton>
                    <Box variant="h6" sx={{ marginX: "10px" }}>
                      {quantity}
                    </Box>
                    <IconButton onClick={increaseQuantity} color="primary">
                      <AddIcon />
                    </IconButton>
                  </Box>
                </div>
                <div className="col-md-7">
                  <Button
                    variant="contained"
                    startIcon={<AddShoppingCartIcon />}
                    sx={{
                      backgroundColor: "#ffc107",
                      color: "#333",
                      padding: "12px 20px",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      textTransform: "none",
                      borderRadius: "8px",
                      width: "100%",
                      "&:hover": { backgroundColor: "#e0a800" },
                    }}
                    onClick={handleAddToCart}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                </div>
              </div>
            </Box>
          </Stack>
        ) : (
          <Box variant="h6">Không có sản phẩm tồn tại</Box>
        )}

        {/* Section Navigation */}
        <Box sx={{ marginY: "30px", textAlign: "center" }}>
          <Button
            onClick={() => scrollToSection(infoRef)}
            sx={{
              fontWeight: "bold",
              color: "black",
              textTransform: "none",
              marginRight: "20px",
              fontSize: "1.2rem",
              borderBottom: "2px solid #ffc107",
            }}
          >
            Thông tin
          </Button>
          <Button
            onClick={() => scrollToSection(descriptionRef)}
            sx={{
              fontWeight: "bold",
              color: "black",
              textTransform: "none",
              marginRight: "20px",
              fontSize: "1.2rem",
            }}
          >
            Mô tả
          </Button>
          <Button

            onClick={() => scrollToSection(brandRef)}
            sx={{
              fontWeight: "bold",

              color: "black",
              textTransform: "none",
              fontSize: "1.2rem",
            }}
          >
            Về thương hiệu
          </Button>
        </Box>
        {/* Product Information Section */}
        <Box>
          <Container style={{ width: "70%" }}>
            <Box ref={infoRef} sx={{ marginBottom: "40px" }}>
              <Box sx={{ marginBottom: "20px" }}>
                <Box sx={{ marginTop: "10px" }}>
                  {product ? parse(product.description) : ""}
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
        {/* Product Description Section */}
        <Box>
          <Container style={{ width: "70%" }}>
            <Box ref={descriptionRef} sx={{ marginY: "20px" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <Box variant="h5" fontWeight="bold" gutterBottom>
                  Đặc tính mô tả
                </Box>
                <Divider
                  sx={{
                    flexGrow: 1,
                    marginLeft: "10px",
                    borderBottom: "2px solid black",
                  }}
                />
              </Box>
              <ul style={{ lineHeight: "1.8rem" }}>
                <li>Kích thước: {product?.length || 0} x {product?.width || 0} x {product?.height || 0} cm</li>
                <li>Trọng lượng: {product?.weight || 0} g</li>
              </ul>
            </Box>
            {/* Phần Về thương hiệu */}
            <Box ref={brandRef} sx={{ marginY: "20px" }}>
              {product?.shop && (
                <Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Về {product.shop.name}
                  </Typography>
                  <Box
                    sx={{
                      border: "1px solid #e0e0e0",
                      padding: "20px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Logo và thông tin shop */}
                    <Box sx={{ display: "flex", alignItems: "center" ,justifyContent:"space-between" }}>
                      <img
                        src={product.shop.logo}
                        alt={product.shop.name}
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          marginRight: "20px",
                        }}
                      />
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {product.shop.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {product.shop.shopAddresses[0]?.fullAddress || "Không có địa chỉ"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          SĐT: {product.shop.shopPhones[0]?.phoneNumber || "Không có SĐT"}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Số lượng sản phẩm và đánh giá */}
                    <Box sx={{ textAlign: "center", marginY: "10px" }}>
                      <Typography variant="body1" fontWeight="bold" sx={{ color: "#ffc107" }}>
                        {product.shop.totalFeedback || 0}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Đánh giá
                      </Typography>
                    </Box>

                    {/* Nút Xem Shop và Trò chuyện */}
                    <Box sx={{ marginTop: "5px" }}>
                      <Button
                        onClick={() => navigate(`/shop/${product.shop.id}`)}
                        variant="outlined"
                        sx={{
                          borderRadius: "20px",
                          paddingX: "15px",
                          paddingY: "8px",
                          fontWeight: "bold",
                          marginRight: "10px",
                        }}
                      >
                        Xem Shop
                      </Button>
                      <Button
                        onClick={() => setChat(product.shop)}
                        variant="text"
                        sx={{
                          textTransform: "none",
                          color: "#ffc107",
                          fontWeight: "bold",
                        }}
                        startIcon={<ChatBubbleOutlineIcon style={{ color: "#ffc107" }} 
                        
                        />}
                      >
                        Trò chuyện
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>

          </Container>
        </Box>


        {/* Feedback Section */}
        <FeedBack id={id}></FeedBack>

        {/* Snackbar Notification */}
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
            Sản phẩm đã được thêm vào giỏ hàng!
          </Alert>
        </Snackbar>

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
            Bạn đã yêu thích sản phẩm này!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Detail;

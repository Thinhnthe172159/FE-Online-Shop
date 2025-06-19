import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Rating,
  Stack,
  Button,
  Divider,
  Chip,
  Pagination,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Modal,
  Fade
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import ChatIcon from "@mui/icons-material/Chat";
import PhoneIcon from "@mui/icons-material/Phone";
import parse from "html-react-parser";
import { useNavigate, useParams } from "react-router-dom";
import { fetch } from "../../../api/Fetch";
import { useQuery } from "@tanstack/react-query";
import Backdrop from "@mui/material/Backdrop";
export const ShopDetail = () => {
  const { id } = useParams();
  const [shopInfo, setShopInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFullDesc, setShowFullDesc] = useState(false); // State để kiểm soát xem hiển thị đầy đủ mô tả
  const productsPerPage = 6;
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const getDetail = async (id) =>{
      let data = await fetch.get("/shop/detail-customer/"+id)
      return data.data 
  }
    const getBlogs = async (shopId) => {
      let data = await fetch.get(`/blog/${shopId}`);
      return data.data;
    };
    const { data: blogData } = useQuery({
      queryKey: ['shop-blogs', id],
      queryFn: () => getBlogs(id)
    });

  const {data} = useQuery({
    queryKey:['c-detail'],
    queryFn: () => getDetail(id)
  })
  console.log(data);
  
  useEffect(() => {
    if(data){
      setShopInfo(data)
      if (blogData) setBlogs(blogData);
    }
  }, [data,blogData]);
  const fetchData = async () => {
    try {
      const response = await fetch.get(`/shop/detail-customer/${id}`);
      console.log(response);
      
      if (response.status === 200) {
        setShopInfo(response.data);
      } else {
        setShopInfo({});
      }
    } catch (error) {
      console.error("Error fetching shop details:", error);
      setShopInfo({});
    }
  };
  const navigate = useNavigate();

  const handleCardClick = (productId) => {
    // Navigate to the product detail page using the product ID
    navigate(`/product-detail/${productId}`);
  };
  console.log(data);
  const handleOpenBlog = (blog) => {
    setSelectedBlog(blog);
  };

  const handleCloseBlog = () => {
    setSelectedBlog(null);
  };

  if (!shopInfo) {
    return <Typography variant="h6" align="center">Loading...</Typography>;
  }

  const toggleDescription = () => {
    setShowFullDesc(!showFullDesc);
  };

  const shortDescription = shopInfo.description?.slice(0, 150) + "...";

  // Logic for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = shopInfo.products?.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f9f9f9" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
          maxWidth: "900px",
          mx: "auto",
          mb: 4,
          p: 2,
        }}
      >
        <Avatar
          src={shopInfo.logo || "/default-logo.png"}
          alt={shopInfo.name}
          variant="square"
          sx={{ width:'300px', height:'300px', mr: { sm: 4 }, mb: { xs: 2, sm: 0 } }}
        />
        <Box sx={{ textAlign: { xs: "center", sm: "left" }, flex: 1 }}>
          <Typography variant="h4" fontWeight="bold">
            {shopInfo.name || "Shop Name"}
          </Typography>
          {shopInfo.shopAddresses?.[0]?.fullAddress && (
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
              Vị trí: {shopInfo.shopAddresses[0].fullAddress}
            </Typography>
          )}
          {shopInfo.shopPhones?.[0]?.phoneNumber && (
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <PhoneIcon fontSize="small" sx={{ mr: 0.5, color: "#3f51b5" }} />
              <Typography variant="body2" sx={{ fontWeight: "bold", color: "#3f51b5" }}>
                {shopInfo.shopPhones[0].phoneNumber}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <Rating
              value={shopInfo.rating || 0}
              precision={0.5}
              readOnly
              sx={{ mr: 1 }}
            />
            <Typography variant="body2">
              {shopInfo.rating} ({shopInfo.totalFeedback} reviews)
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <LocalMallIcon fontSize="small" sx={{ mr: 0.5, color: "#3f51b5" }} />
            <Typography variant="body2" sx={{ fontWeight: "bold", color: "#3f51b5" }}>
              {shopInfo.products?.length || 0} sản phẩm
            </Typography>
          </Box>
          {shopInfo.joinedDate && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Tham gia 6MEMs từ: {shopInfo.joinedDate}
            </Typography>
          )}
          {/* Hiển thị mô tả ngắn hoặc đầy đủ */}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {parse(showFullDesc ? shopInfo.description : shortDescription)}
            {shopInfo.description && shopInfo.description.length > 150 && (
              <Button onClick={toggleDescription} sx={{ textTransform: "none", ml: 1, color: "#3f51b5" }}>
                {showFullDesc ? "Ẩn bớt" : "Xem thêm"}
              </Button>
            )}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mt: 4, mb: 4 }} />

      {/* Product List */}
      <Typography variant="h5" fontWeight="bold" sx={{ mt: 4, mb: 2, color: "#333", textAlign: "center" }}>
        Sản phẩm của cửa hàng
      </Typography>
      <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: "1200px", mx: "auto" }}>
        {currentProducts?.length > 0 ? (
          currentProducts.map((product) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={product.id}>
              <Card
                sx={{
                  maxWidth: 250,
                  boxShadow: 3,
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.05)" },
                  height: "100%",
                }}
                onClick={() => handleCardClick(product.id)}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={product.avatar || "/default-product.png"}
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "#333" }} noWrap>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {shopInfo.shopAddresses[0]?.province || ""}
                  </Typography>
                  <Typography variant="body2" color="green" fontWeight="bold" sx={{ mt: 1 }}>
                    {product.price.toLocaleString()} đ
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <Rating
                      value={product.averageRating || 0}
                      readOnly
                      precision={0.5}
                      icon={<StarIcon fontSize="inherit" />}
                      emptyIcon={<StarIcon fontSize="inherit" style={{ opacity: 0.3 }} />}
                    />
                  </Box>
                  {product.feedBacks?.length > 0 && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                      {product.feedBacks.slice(0, 2).map((feedback) => (
                        <Chip
                          key={feedback.id}
                          label={feedback.comment}
                          size="small"
                          sx={{
                            backgroundColor: "#f1f8e9",
                            color: "#558b2f",
                            fontSize: "0.75rem",
                          }}
                        />
                      ))}
                      {product.feedBacks.length > 2 && (
                        <Chip
                          label="..."
                          size="small"
                          sx={{
                            backgroundColor: "#e0e0e0",
                            color: "#333",
                            fontSize: "0.75rem",
                          }}
                        />
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ width: "100%", mt: 2 }}>
            Không có sản phẩm nào
          </Typography>
        )}
      </Grid>

      {/* Pagination Component */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={Math.ceil((shopInfo.products?.length || 0) / productsPerPage)}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
          color="primary"
        />
      </Box>
      <Box sx={{ p: 4, backgroundColor: "#f9f9f9" }}>
      {/* Existing Shop Details */}
      <Divider sx={{ mt: 4, mb: 4 }} />

      {/* Blog Section */}
      <Typography variant="h5" fontWeight="bold" sx={{ mt: 4, mb: 2, textAlign: "center" }}>
        Blog của cửa hàng
      </Typography>
      <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: "1200px", mx: "auto" }}>
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog.id}>
              <Card
                sx={{
                  boxShadow: 3,
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.05)" }
                }}
                onClick={() => handleOpenBlog(blog)}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {blog.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ngày đăng: {blog.createdDate.join("-")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" align="center">
            Không có bài blog nào
          </Typography>
        )}
      </Grid>

      {/* Blog Modal */}
      <Modal
        open={!!selectedBlog}
        onClose={handleCloseBlog}
        closeAfterTransition
        sx={{
          zIndex: (theme) => theme.zIndex.modal + 1,
        }}
      >
        <Fade in={!!selectedBlog}>
          <Box sx={{ p: 4, backgroundColor: "#fff", maxWidth: 800, mx: "auto", mt: 5, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
              {selectedBlog?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Ngày đăng: {selectedBlog?.createdDate.join("-")}
            </Typography>
            <Typography variant="body1">{selectedBlog?.content}</Typography>
            <Button onClick={handleCloseBlog} sx={{ mt: 3 }} variant="contained" color="primary">
              Đóng
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
    </Box>
  );
};

export default ShopDetail;

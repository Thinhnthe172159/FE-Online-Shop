import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import StarIcon from "@mui/icons-material/Star";
import {
  Box,
  FormControlLabel,
  Radio,
  Stack,
  Button,
  RadioGroup,
} from "@mui/material";
import { fetch } from '../../../api/Fetch';

const provinceFilter = [
  { label: "Hà Nội", value: "Hà Nội" },
  { label: "Hồ Chí Minh", value: "Hồ Chí Minh" },
  { label: "Đà Nẵng", value: "Đà Nẵng" },
  { label: "Các tỉnh khác", value: "other" }
];

const ratingFilter = [
  { label: "Từ 5 sao", stars: 5 },
  { label: "Từ 4 sao", stars: 4 },
  { label: "Từ 3 sao", stars: 3 },
];

const priceFilter = [
  { label: "Từ 50k", value: 50000 },
  { label: "Từ 100k", value: 100000 },
  { label: "Từ 500k", value: 500000 },
  { label: "Từ 1tr trở lên", value: 1000000 },
];

const ProductFilterSearch = ({ setFilterProduct, searchTerm }) => {
  const [province, setProvince] = useState('');
  const [rating, setRating] = useState(0);
  const [price, setPrice] = useState(0);

  const fetchFilteredProducts = async () => {
    try {
      let queryParams = new URLSearchParams();
      queryParams.append('category', '0'); // Default category (adjust as needed)
      
      if (province && province !== 'other') {
        queryParams.append('province', province);
      } else if (province === 'other') {
        queryParams.append('province', 'other');
      }
      if (rating > 0) {
        queryParams.append('rating', rating);
      }
      if (price > 0) {
        queryParams.append('price', price);
      }
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }

      const response = await fetch.get(`/product/filter?${queryParams.toString()}`);
      if (response.status === 200) {
        const products = (response.data.data || []).map(product => ({
          ...product,
          description: product.description ? product.description.replace(/<[^>]+>/g, "") : "Không có mô tả",
          shopName: product.shopName || "Không xác định",
          avatar: product.avatar || "path_to_default_image",
        }));
        setFilterProduct(products);
      } else {
        setFilterProduct([]);
      }
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      setFilterProduct([]);
    }
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [province, rating, price, searchTerm]);

  const resetFilters = () => {
    setProvince('');
    setRating(0);
    setPrice(0);
  };

  const handleProvinceChange = (event) => {
    const newValue = event.target.value;
    setProvince(prev => prev === newValue ? '' : newValue);
  };

  const handleRatingChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    setRating(prev => prev === newValue ? 0 : newValue);
  };

  const handlePriceChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    setPrice(prev => prev === newValue ? 0 : newValue);
  };

  return (
    <div id="product-filter">
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Bộ lọc</Typography>
        <Button 
          onClick={resetFilters}
          variant="outlined"
          size="small"
          sx={{
            textTransform: 'none',
            borderColor: '#ddd',
            color: '#666',
            '&:hover': {
              borderColor: '#999',
              backgroundColor: '#f5f5f5'
            }
          }}
        >
          Xóa bộ lọc
        </Button>
      </Stack>

      <Box sx={{ margin: "20px 0" }}>
        <Typography className="filter-label" variant="h6">Địa điểm</Typography>
        <RadioGroup value={province} onChange={handleProvinceChange}>
          {provinceFilter.map((item) => (
            <FormControlLabel
              key={item.value}
              value={item.value}
              control={<Radio sx={{ '&.Mui-checked': { color: '#ffcf20' } }} />}
              label={item.label}
            />
          ))}
        </RadioGroup>
      </Box>

      <Box sx={{ margin: "20px 0" }}>
        <Typography className="filter-label" variant="h6">Đánh giá</Typography>
        <RadioGroup value={rating} onChange={handleRatingChange}>
          {ratingFilter.map((item) => (
            <FormControlLabel
              key={item.stars}
              value={item.stars}
              control={<Radio sx={{ '&.Mui-checked': { color: '#ffcf20' } }} />}
              label={
                <Stack direction="row" alignItems="center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon 
                      key={i} 
                      sx={{ color: i < item.stars ? "#ffcf20" : "#ddd", fontSize: '20px' }} 
                    />
                  ))}
                  <Typography variant="body2" sx={{ marginLeft: 1 }}>{item.label}</Typography>
                </Stack>
              }
            />
          ))}
        </RadioGroup>
      </Box>

      <Box sx={{ margin: "20px 0" }}>
        <Typography className="filter-label" variant="h6">Giá</Typography>
        <RadioGroup value={price} onChange={handlePriceChange}>
          {priceFilter.map((item) => (
            <FormControlLabel
              key={item.value}
              value={item.value}
              control={<Radio sx={{ '&.Mui-checked': { color: '#ffcf20' } }} />}
              label={item.label}
            />
          ))}
        </RadioGroup>
      </Box>
    </div>
  );
};

export default ProductFilterSearch;
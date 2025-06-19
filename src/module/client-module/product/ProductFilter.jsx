import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import StarIcon from "@mui/icons-material/Star";
import { Box, Radio, RadioGroup, FormControlLabel, Stack } from "@mui/material";
import { fetch } from '../../../api/Fetch';
import { useParams } from "react-router-dom";

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

const ProductFilter = ({ setFilterProduct }) => {

  const [province, setProvince] = useState('');
  const [rating, setRating] = useState(0);
  const [price, setPrice] = useState(0);
  const { categoryId } = useParams();

  const fetchFilteredProducts = async () => {
    try {
      let queryParams = new URLSearchParams();
      
      if (categoryId) queryParams.append('category', categoryId);
      if (province && province !== 'other') queryParams.append('province', province);
      if (rating > 0) queryParams.append('rating', rating);
      if (price > 0) queryParams.append('price', price);

      const response = await fetch.get(`/product/filter?${queryParams.toString()}`);
      if (response.status === 200) {
        setFilterProduct(response.data.data);
      } else {
        setFilterProduct([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu lọc:', error);
      setFilterProduct([]);
    }
  };

  // Reset tất cả các filter
  const resetFilters = () => {
    setProvince('');
    setRating(0);
    setPrice(0);
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [province, rating, price, categoryId]);

  const handleProvinceChange = (event) => {
    setProvince(event.target.value);
  };

  const handleRatingChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setRating(prevRating => (prevRating === value ? 0 : value));
  };

  const handlePriceChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setPrice(prevPrice => (prevPrice === value ? 0 : value));
  };

  return (
    <div id="product-filter">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <h3>Bộ lọc</h3>
        <button 
          onClick={resetFilters}
          style={{
            padding: '5px 10px',
            backgroundColor: '#f0f0f0',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Xóa bộ lọc
        </button>
      </Stack>

      <Box sx={{ margin: "30px 0" }}>
        <Typography className="filter-label" variant="h6">Địa điểm</Typography>
        <RadioGroup value={province} onChange={handleProvinceChange}>
          {provinceFilter.map((item) => (
            <FormControlLabel
              key={item.label}
              value={item.value || item.label} // Dùng giá trị "other" nếu có, nếu không thì dùng label
              control={<Radio />}
              label={item.label}
            />
          ))}
        </RadioGroup>
      </Box>

      <Box sx={{ margin: "30px 0" }}>
        <Typography className="filter-label" variant="h6">Đánh giá</Typography>
        <RadioGroup value={rating} onChange={handleRatingChange}>
          {ratingFilter.map((rating) => (
            <FormControlLabel
              key={rating.stars}
              value={rating.stars}
              control={<Radio />}
              label={
                <Stack direction="row" alignItems="center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} sx={{ color: i < rating.stars ? "orange" : "#ddd" }} />
                  ))}
                  <Typography variant="body2" sx={{ marginLeft: 1 }}>{rating.label}</Typography>
                </Stack>
              }
            />
          ))}
        </RadioGroup>
      </Box>

      <Box sx={{ margin: "30px 0" }}>
        <Typography className="filter-label" variant="h6">Giá</Typography>
        <RadioGroup value={price} onChange={handlePriceChange}>
          {priceFilter.map((price) => (
            <FormControlLabel
              key={price.value}
              value={price.value}
              control={<Radio />}
              label={price.label}
            />
          ))}
        </RadioGroup>
      </Box>
    </div>
  );
};

export default ProductFilter;

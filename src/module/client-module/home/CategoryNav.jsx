import React, { useState, useEffect } from 'react';
import { Box, Stack, Typography, Tooltip, MenuItem } from "@mui/material";
import { fetch } from '../../../api/Fetch';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} arrow />
))({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: '#ffffff', // Nền trắng cho Tooltip
    color: '#000000',           // Màu chữ đen
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',  // Tùy chọn bóng nhẹ nếu muốn
    borderRadius: '8px',        // Làm tròn các góc
  },
  [`& .MuiTooltip-arrow`]: {
    color: '#ffffff',           // Màu mũi tên trắng
  },
});

const CategoryNav = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await fetch.get('/category/getAll');
      if (response.status === 200) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Box sx={{ padding: "10px", boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}>
      <Stack direction={"row"} spacing={3} sx={{ justifyContent: "center" }}>
        {categories.map(category => (
          <CustomTooltip
            key={category.id}
            title={
              category.subcategories && category.subcategories.length > 0 ? (
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  padding: '5px',
                  width: '150px',  // Đặt chiều rộng đồng nhất cho menu
                }}>
                  {category.subcategories.map((subItem, index) => (
                    <Link key={index} to={`/category/${subItem.id}/products`} style={{ textDecoration: 'none' }}>
                      <MenuItem sx={{ color: '#000000', backgroundColor: '#ffffff', '&:hover': { backgroundColor: '#f0f0f0' } }}>
                        {subItem.name}
                      </MenuItem>
                    </Link>
                  ))}
                </Box>
              ) : null
            }
            placement="bottom-start"
            enterDelay={100}
            leaveDelay={100}
            arrow
          >
            <Box>
              <Link to={`/category/${category.id}/products`} style={{ textDecoration: 'none' }}>
                <Typography sx={{ fontSize: "16px", fontWeight: "600" }} variant="body1" color="initial">
                  {category.name}
                </Typography>
              </Link>
            </Box>
          </CustomTooltip>
        ))}
      </Stack>
    </Box>
  );
};

export default CategoryNav;

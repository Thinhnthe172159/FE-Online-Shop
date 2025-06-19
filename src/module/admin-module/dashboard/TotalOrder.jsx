import React from 'react';
import { Paper, Typography, Box, IconButton, Button } from '@mui/material';
import { ShoppingCart, MoreVert, ArrowDownward } from '@mui/icons-material';

const TotalOrder = ({ amount }) => {

  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#1E88E5', // Màu nền xanh dương
        color: 'white',
        borderRadius: 3,
        height: '130px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Hiệu ứng vòng tròn nền */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ShoppingCart
            sx={{
              fontSize: 30,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: 1,
              borderRadius: '5px',
              marginRight: 1,
            }}
          />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {amount} Cửa hàng hoạt động
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
              
              
            </Box>
          </Box>
        </Box>
        <IconButton sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          <MoreVert />
        </IconButton>
      </Box>

     
    </Paper>
  );
};

export default TotalOrder;

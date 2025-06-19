import React from 'react';
import { Paper, Typography, Box, IconButton } from '@mui/material';
import { AccountBalanceWallet, MoreVert, ArrowUpward } from '@mui/icons-material';


const formatCurrency = (value) => {
  return value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

const TotalEarning = ({ amount }) => (
  <Paper
    elevation={3}
    sx={{
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: '#6C63FF', // Màu nền tím đậm hơn
      color: 'white',
      borderRadius: 3,
      height: '130px',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Vòng tròn nhạt để tạo hiệu ứng nền */}
    <Box
      sx={{
        position: 'absolute',
        top: -30,
        right: -30,
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
        width: 50,
        height: 50,
        borderRadius: '50%',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
      }}
    />

    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <AccountBalanceWallet
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
            {formatCurrency(amount)}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
            <ArrowUpward fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2">Thu nhập trong ngày</Typography>
          </Box>
        </Box>
      </Box>
      <IconButton sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
        <MoreVert />
      </IconButton>
    </Box>
  </Paper>
);

export default TotalEarning;

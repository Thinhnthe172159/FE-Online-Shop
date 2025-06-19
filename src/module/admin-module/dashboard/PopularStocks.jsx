import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material';

const stocks = [
  { name: 'Bajaj Finery', amount: 1839.00, profit: 10, isProfit: true },
  { name: 'TTML', amount: 100.00, profit: -10, isProfit: false },
  { name: 'Reliance', amount: 200.00, profit: 10, isProfit: true },
  { name: 'TTML', amount: 189.00, profit: -10, isProfit: false },
  { name: 'Stolon', amount: 189.00, profit: -10, isProfit: false },
];
const formatCurrency = (value) => {
  return value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}
const PopularStocks = ({transaction}) => (
  <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Một số giao dịch mới
    </Typography>
    <List>
      {transaction.map((stock, index) => (
        <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: stock.isProfit ? 'purple' : 'black' }}>
              Cửa hàng {stock.shop.name}
            </Typography>
            <Typography variant="body2" sx={{ color: stock.type ==1 ? 'green' : 'red' }}>
              {stock.type== 1 ? "Nhận được" : "Bị trừ"}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 0.5 }}>
              {formatCurrency(stock.amount)}
            </Typography>
            {stock.type == 1 ? (
              <ArrowDropUp sx={{ color: 'green' }} />
            ) : (
              <ArrowDropDown sx={{ color: 'red' }} />
            )}
          </Box>
        </ListItem>
      ))}
    </List>
  </Paper>
);

export default PopularStocks;

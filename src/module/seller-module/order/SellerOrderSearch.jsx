import { Box, Button, InputAdornment, TextField } from "@mui/material";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
const SellerOrderSearch = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
        padding: 2,
        borderRadius: "8px",
        width: "500px",
      }}
    >
      {/* TextField for search input */}
      <TextField
        placeholder="Theo mã phiếu đặt, tên hàng, hoặc số điện thoại khách hàng"
        variant="standard"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ width: "70%" }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          color="success"
          sx={{ textTransform: "initial" }}
        >
          Tìm kiếm
        </Button>
      </Box>
    </Box>
  );
};

export default SellerOrderSearch;

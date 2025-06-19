import { Stack, Typography, TextField } from "@mui/material";
import React from "react";
import { Box } from "@mui/material";


const ProductItemHeader = () => {
  return (
    <Box
    sx={{
      width: "100%",
      backgroundColor: "white",
      borderRadius: "10px",
      border: "1px solid #ccc",
      boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
    }}
  >
    <Stack
      direction={"row"}
      sx={{
        p: "20px",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ width: "5%" }}>
        <Typography variant="body1" color="initial">
          #
        </Typography>
      </Box>

      <Box sx={{ width: "15%" }}>
        <Typography variant="body1" color="initial">
          Ảnh sản phẩm
        </Typography>
      </Box>

      <Box sx={{ width: "20%" }}>
        <Typography variant="body1" color="initial">
          Tên sản phẩm
        </Typography>
      </Box>

      <Box sx={{ width: "20%" }}>
        <Typography variant="body1" color="initial">
          Số lượng
        </Typography>
      </Box>

      <Box sx={{ width: "30%" }}>
        <Stack direction={"row"} spacing={8}>
          <Typography variant="body1" color="initial">
            Giá tiền
          </Typography>
          <Typography variant="body1" color="initial">
            Tổng tiền
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ width: "10%" }}>
        <Typography variant="body1" color="initial">Hành động</Typography>
      </Box>
    </Stack>
  </Box>
  )
}

export default ProductItemHeader
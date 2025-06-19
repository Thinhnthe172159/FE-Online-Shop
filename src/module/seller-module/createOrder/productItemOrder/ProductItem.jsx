import { Stack, Typography, TextField, Button } from "@mui/material";
import CounterQuantity from "./CounterQuantity";
import React from "react";
import { Box} from "@mui/material";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';





const ProductItem = () => {

  const getShortName = (data) => {
      if(data.length > 35){
         return data.substring(0,35)+ "..."
      }
      else return data
  }

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
              1
            </Typography>
          </Box>

          <Box sx={{ width: "15%", display: "flex", justifyContent: "start" }}>
            <img
              style={{
                width: "90px",
                height: "90px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
              src="https://static.chus.vn/images/thumbnails/500/500/detailed/275/F__12_.jpg"
              alt=""
            />
          </Box>

          <Box sx={{ width: "20%", display: "flex", justifyContent: "end" }}>
            <Typography variant="body1" color="initial">
              {getShortName("Hoa văn phòng Giấc mơ ban mai đẹp như mơ ức")}
            </Typography>
          </Box>

          <Box sx={{ width: "20%" }}>
            <CounterQuantity></CounterQuantity>
          </Box>

          <Box sx={{ width: "30%" }}>
            <Stack direction={"row"} spacing={3}>
              <TextField
                sx={{ width: "50%" }}
                id=""
                label=""
                variant="standard"
                value={"520.000 "}
              />
              <TextField
                sx={{ width: "50%" }}
                id=""
                label=""
                variant="standard"
                value={"520.000 "}
              />
            </Stack>
          </Box>

          <Box sx={{ width: "10%", display: "flex", justifyContent: "center" }}>
            <Button color="error"><DeleteOutlineOutlinedIcon></DeleteOutlineOutlinedIcon></Button>
          </Box>
        </Stack>
      </Box>
  )
}

export default ProductItem
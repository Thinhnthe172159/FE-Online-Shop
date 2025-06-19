import { Typography} from "@mui/material";
import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";



export default function CounterQuantity() {
    const [count, setCount] = useState(3); // Giá trị mặc định là 3
  
    const handleIncrement = () => {
      setCount(count + 1);
    };
  
    const handleDecrement = () => {
      setCount(count > 0 ? count - 1 : 0); // Không cho phép giảm xuống dưới 0
    };
  
    return (
      <Box display="flex" alignItems="center">
        <IconButton
          onClick={handleDecrement}
          sx={{
            backgroundColor: "#f5f5f5",
            width: "36px",
            height: "36px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RemoveIcon sx={{ color: "gray", fontSize: "13px" }} />
        </IconButton>
  
        <Typography sx={{ mx: 2, color: "red", fontSize: "20px" }}>
          {count}
        </Typography>
  
        <IconButton
          onClick={handleIncrement}
          sx={{
            backgroundColor: "#f5f5f5",
            width: "36px",
            height: "36px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AddIcon sx={{ color: "gray", fontSize: "13px" }} />
        </IconButton>
      </Box>
    );
  }
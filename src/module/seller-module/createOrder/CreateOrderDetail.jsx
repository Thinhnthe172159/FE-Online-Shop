import { Box, Stack } from "@mui/material";
import React from "react";
import CreateOrderProduct from "./CreateOrderProduct";
import CreateOrderAddress from "./CreateOrderAddress";

const CreateOrderDetail = ({ data, onChange }) => {
  return (
    <Stack direction={"row"}>
      <Box sx={{width:"60%"}}>
        <CreateOrderProduct></CreateOrderProduct>
      </Box>
      <Box sx={{width:"40%"}}>
        <CreateOrderAddress></CreateOrderAddress>
      </Box>
    </Stack>
  );
};

export default CreateOrderDetail;

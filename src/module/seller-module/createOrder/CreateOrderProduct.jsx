import { Stack, Typography, TextField } from "@mui/material";
import React from "react";


import ProductItem from "./productItemOrder/ProductItem";
import ProductItemHeader from "./productItemOrder/ProductItemHeader";

const CreateOrderProduct = () => {
  return (
    <Stack direction={"column"} spacing={2}>
        <ProductItemHeader></ProductItemHeader>
      <ProductItem></ProductItem>
    </Stack>
  );
};

export default CreateOrderProduct;

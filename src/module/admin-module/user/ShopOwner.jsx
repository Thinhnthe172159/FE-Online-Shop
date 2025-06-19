import React from "react";
import Typography from "@mui/material/Typography";
import "./adminUser.scss";
import TableUser from "./TableUser";
import Insert from "./Insert";
const ShopOwner = () => {
  

  return (
    <section id="admin-user">
      <Typography variant="h5" color="initial">
        Quản lý chủ cửa hàng
      </Typography>
      <Insert></Insert>
      <TableUser></TableUser>
    </section>
  );
};

export default ShopOwner;

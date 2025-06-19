import React from "react";
import NavSide from "../components/admin/NavSide";
import { AdminHeader } from "../components/admin/AdminHeader";
import { Box, Stack } from "@mui/material";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminLayout = () => {
  const auth = useSelector((state) => state.auth);
  console.log(auth);
  
  // Kiểm tra trạng thái đăng nhập và vai trò người dùng
  if (!auth.login) {
    return <Navigate to="/admin-gate/login" />;
  }
  
  if (auth.role !== "admin" && auth.role !== "superAdmin") {
    return <Navigate to="/" />;
  }

  return (
    <>
      <AdminHeader />

      <Stack sx={{ alignItems: "start", marginTop: "65px" }} direction={"row"} spacing={3}>
        <Box sx={{ width: "18%" }}>
          <NavSide />
        </Box>

        <Box sx={{ width: "82%" }}>
          <Outlet />
        </Box>
      </Stack>
    </>
  );
};

export default AdminLayout;

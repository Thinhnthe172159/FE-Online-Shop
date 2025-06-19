import { Pagination, Stack } from "@mui/material";
import React from "react";

const OrderPagination = ({ page, onPageChange,currentPage }) => {
  console.log("Pagination component received page:", page); // Kiểm tra giá trị `page`
  return (
    <Stack direction="row" sx={{ justifyContent: "center" }} className="mt-4">
      <Pagination
        count={page} // Tổng số trang
        page={currentPage} // Trang hiện tại
        color="primary"
        onChange={(event, value) => onPageChange(value)} // Gọi hàm onPageChange khi thay đổi trang
      />
    </Stack>
  );
};

export default OrderPagination;

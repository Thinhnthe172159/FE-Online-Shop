import React, { useEffect, useState } from "react";
import { TextField, Button, InputAdornment, Box, Stack } from "@mui/material";
import { Container } from "react-bootstrap";
import SellerOrderTable from "./SellerOrderTable";
import SellerOrderFilter from "./SellerOrderFilter";
import SellerOrderSearch from "./SellerOrderSearch";
import OrderPagination from "./OrderPagination";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getOrderByShop } from "../../../api/orderApi";
import { OrbitProgress } from "react-loading-indicators";

export default function SellerOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // Lấy các giá trị từ URL
  const initialPage = parseInt(queryParams.get("page")) || 1;
  const startDate = queryParams.get("startDate");
  const endDate = queryParams.get("endDate");
  const status = queryParams.get("status") ? queryParams.get("status").split(",").map(Number) : [];
  
  
  // Khởi tạo state
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [selectedStatuses, setSelectedStatuses] = useState(status);
  // Cập nhật URL khi trang, ngày, hoặc trạng thái thay đổi
  useEffect(() => {
    const newURL = `?page=${page}` + 
                   (startDate ? `&startDate=${startDate}` : "") + 
                   (endDate ? `&endDate=${endDate}` : "") +
                   (status.length ? `&status=${status.join(",")}` : "");
    navigate(newURL, { replace: true });
  }, [page, startDate, endDate, selectedStatuses, navigate]);

  // Fetch data từ API khi page, ngày hoặc trạng thái thay đổi
  const { data: ordersData, isLoading, refetch } = useQuery({
    queryKey: ["order", page, startDate, endDate, status],
    queryFn: () => getOrderByShop(page, startDate, endDate, status),
  });

  console.log(ordersData);
  

  // Cập nhật state với dữ liệu nhận được
  useEffect(() => {
    if (ordersData) {
      setData(ordersData.data);
      setTotalPage(ordersData.page); // Giả sử API trả về totalPages
    }
  }, [ordersData]);

  // Xử lý khi người dùng thay đổi trang
  const handlePageChange = (newPage) => {
    setPage(newPage); // Cập nhật page và gọi lại API
  };

  // Xử lý khi người dùng thay đổi trạng thái lọc
  const handleStatusChange = (newStatuses) => {
    setSelectedStatuses(newStatuses); // Cập nhật trạng thái được chọn
    setPage(1); // Đặt lại trang về 1 khi thay đổi bộ lọc
  };

  // Hiển thị loading nếu đang tải dữ liệu
  if (isLoading) {
    return (
      <Stack
        style={{
          minHeight: "60vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <OrbitProgress color="#1976d2" size="medium" text="" textColor="" />
      </Stack>
    );
  }

  // Hiển thị nội dung khi dữ liệu đã tải xong
  return (
    <Container className="mt-4 pb-5">
      <Stack
        direction={"row"}
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Stack direction={"row"} spacing={3} sx={{ alignItems: "center" }}>
          <h3>Phiếu đặt hàng</h3>
          
        </Stack>
        <Box>
          
        </Box>
      </Stack>
      <Stack
        className="mt-4"
        sx={{ alignItems: "start" }}
        direction={"row"}
        spacing={3}
      >
        <Box sx={{ width: "25%" }}>
          <SellerOrderFilter 
            startDateInit={startDate} 
            endDateInit={endDate} 
            initialStatuses={selectedStatuses}
            onStatusChange={handleStatusChange}
          />
        </Box>
        <Box>
          <SellerOrderTable data={data} refetch={refetch} />
          <OrderPagination page={totalPage} currentPage={page} onPageChange={handlePageChange} />
        </Box>
      </Stack>
    </Container>
  );
}

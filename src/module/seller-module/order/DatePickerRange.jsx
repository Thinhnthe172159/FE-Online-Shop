import React from "react";
import { DateRange } from "react-date-range";
import { vi } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Button, Popover, Stack } from "@mui/material";

export default function SellerDatePicker({ showDate, handleShowDate, selectionRange, handleSelect, handleSearch }) {
  return (
    <Popover
      sx={{ position: "absolute", top: "30%", left: "23%" }}
      open={showDate}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <DateRange
          ranges={[selectionRange]}
          onChange={handleSelect}
          months={1} // Hiển thị chỉ một tháng
          direction="horizontal" // Hướng ngang
          showDateDisplay={false} // Ẩn phần hiển thị ngày ở trên
          locale={vi} // Ngôn ngữ tiếng Việt
          moveRangeOnFirstSelection={false} // Để tránh việc chọn toàn bộ tháng
        />
        <Stack direction={"row"} sx={{ justifyContent: "center" }} spacing={2}>
          <Button onClick={handleShowDate} color="error" variant="outlined" sx={{ textTransform: "initial" }}>
            Hủy
          </Button>
          <Button onClick={handleSearch} variant="outlined" sx={{ textTransform: "initial" }}>
            Tìm kiếm
          </Button>
        </Stack>
      </div>
    </Popover>
  );
}

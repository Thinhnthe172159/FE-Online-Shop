import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import SellerDatePicker from "./DatePickerRange";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { format } from "date-fns";
import { useNavigate, useLocation } from "react-router-dom";

const SellerOrderFilter = ({ startDateInit, endDateInit }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const initialSelectedStatuses = queryParams.get("status")
    ? queryParams.get("status").split(",").map(Number)
    : [];

  const [showDate, setShowDate] = useState(false);
  const [selectionRange, setSelectionRange] = useState({
    startDate: startDateInit ? new Date(startDateInit) : null,
    endDate: endDateInit ? new Date(endDateInit) : null,
    key: "selection",
  });

  const [filterDate, setFilterDate] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState(initialSelectedStatuses);

  useEffect(() => {
    if (startDateInit && endDateInit) {
      setFilterDate(`${startDateInit} ~ ${endDateInit}`);
    }
  }, [startDateInit, endDateInit]);

  const handleSelect = (ranges) => {
    setSelectionRange({
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
      key: "selection",
    });
  };

  const handleShowDate = () => {
    setShowDate(!showDate);
  };

  const handleStatusChange = (event) => {
    const status = parseInt(event.target.value);
    let updatedStatuses;

    if (event.target.checked) {
      updatedStatuses = [...selectedStatuses, status];
    } else {
      updatedStatuses = selectedStatuses.filter((s) => s !== status);
    }

    setSelectedStatuses(updatedStatuses);

    const statusQuery = updatedStatuses.join(",");

    // Chỉ thêm `startDate` và `endDate` vào URL nếu `startDateInit` và `endDateInit` có giá trị
    let url = `/seller/order?page=1&status=${statusQuery}`;
    if (startDateInit && endDateInit) {
      const currentStartDate = format(new Date(startDateInit), "yyyy-MM-dd");
      const currentEndDate = format(new Date(endDateInit), "yyyy-MM-dd");
      url += `&startDate=${currentStartDate}&endDate=${currentEndDate}`;
    }

    navigate(url);
  };

  const handleSearchDate = () => {
    const startDate = selectionRange.startDate ? format(selectionRange.startDate, "yyyy-MM-dd") : null;
    const endDate = selectionRange.endDate ? format(selectionRange.endDate, "yyyy-MM-dd") : null;
    let dateData = `${startDate} ~ ${endDate}`;
    setFilterDate(dateData);
    handleShowDate();

    const statusQuery = selectedStatuses.join(",");

    // Cập nhật URL với cả `startDate`, `endDate`, và `status`
    let url = `/seller/order?page=1&startDate=${startDate}&endDate=${endDate}&status=${statusQuery}`;
    navigate(url);
  };

  const handleClearFilter = () => {
    // Reset date states
    setSelectionRange({
      startDate: null,
      endDate: null,
      key: "selection"
    });
    setFilterDate("");
    
    // Reset status states
    setSelectedStatuses([]);
    
    // Reset URL params
    navigate('/seller/order?page=1');
  };

  return (
    <div id="order-filter">
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '10px'
      }}>
        <button
          onClick={handleClearFilter}
          style={{
            padding: '4px 12px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Đặt lại
        </button>
      </Box>
      <Box
        sx={{
          border: "1px solid #ccc",
          padding: "20px",
          width: "100%",
          marginBottom: "20px",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        }}
      >
        <Stack>
          <p className="mb-3">
            <b>Tìm kiếm theo ngày tháng</b>
          </p>
          <div style={{ width: "100%" }}>
            <Stack direction={"column"}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: "end", position: "relative" }}
              >
                <TextField
                  onClick={handleShowDate}
                  value={filterDate}
                  label="Chọn ngày tháng"
                  variant="standard"
                  sx={{ width: "100%" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleShowDate}>
                          <DateRangeIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <SellerDatePicker
                  handleShowDate={handleShowDate}
                  showDate={showDate}
                  handleSelect={handleSelect}
                  selectionRange={selectionRange}
                  handleSearch={handleSearchDate}
                />
              </Stack>
            </Stack>
          </div>
        </Stack>
      </Box>
      <Box
        sx={{
          border: "1px solid #ccc",
          padding: "20px",
          width: "100%",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        }}
      >
        <Stack>
          <p className="mb-3">
            <b>Tìm kiếm theo trạng thái</b>
          </p>
          <div style={{ width: "100%" }}>
            <FormGroup sx={{ marginLeft: "20px", width: "100%" }}>
              <FormControlLabel
                value={0}
                control={
                  <Checkbox
                    checked={selectedStatuses.includes(0)}
                    onChange={handleStatusChange}
                  />
                }
                label="Chưa xác nhận"
              />
              <FormControlLabel
                value={1}
                control={
                  <Checkbox
                    checked={selectedStatuses.includes(1)}
                    onChange={handleStatusChange}
                  />
                }
                label="Đã xác nhận"
              />
              <FormControlLabel
                value={2}
                control={
                  <Checkbox
                    checked={selectedStatuses.includes(2)}
                    onChange={handleStatusChange}
                  />
                }
                label="Đang giao hàng"
              />
              <FormControlLabel
                value={3}
                control={
                  <Checkbox
                    checked={selectedStatuses.includes(3)}
                    onChange={handleStatusChange}
                  />
                }
                label="Hoàn thành"
              />
              <FormControlLabel
                value={4}
                control={
                  <Checkbox
                    checked={selectedStatuses.includes(4)}
                    onChange={handleStatusChange}
                  />
                }
                label="Đã hủy"
              />
            </FormGroup>
          </div>
        </Stack>
      </Box>
    </div>
  );
};

export default SellerOrderFilter;

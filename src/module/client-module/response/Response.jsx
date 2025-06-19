import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Collapse,
  Box,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { customerGetResponse } from "../../../api/CustomerReportApi";

const Response = () => {
  const { data } = useQuery({
    queryKey: ["c-response"],
    queryFn: customerGetResponse,
  });

  console.log(data);

  const [expandedRow, setExpandedRow] = useState(null);

  const handleExpandClick = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Khách hàng</TableCell>

            <TableCell>loại Phản hồi</TableCell>
            <TableCell align="center">Chi tiết</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row) => (
            <React.Fragment key={row.id}>
              <TableRow>
                <TableCell>{row.customer.name || "N/A"}</TableCell>

                <TableCell>{row.customerReportType.type}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleExpandClick(row.id)}>
                    {expandedRow === row.id ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={4}
                  style={{ paddingBottom: 0, paddingTop: 0 }}
                >
                  <Collapse
                    in={expandedRow === row.id}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Box margin={2}>
                      <Typography variant="body2" gutterBottom>
                        <strong>Nội dung gửi lên:</strong>{" "}
                        {row.reportContent || "Không có nội dung"}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          <strong>Nội dung phản hồi:</strong>{" "}
                          {row.reportResponse || "Không có nội dung"}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          <strong>Hình ảnh:</strong>
                        </Typography>
                        <Box display="flex" flexWrap="wrap">
                          {row.customerReportImages?.length > 0 ? (
                            row.customerReportImages.map((img, index) => (
                              <Box key={index} sx={{ mr: 2, mb: 2 }}>
                                <img
                                  src={img.reportImageContent}
                                  alt="Hình ảnh phản hồi"
                                  style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 4,
                                    border: "1px solid #ccc",
                                  }}
                                />
                              </Box>
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Không có hình ảnh
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Response;

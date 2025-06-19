import React from "react";
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
import { getShopResponse } from "../../../api/reportAip";
import { Container } from "react-bootstrap";

const ShopResponse = () => {
  const { data } = useQuery({
    queryKey: ["shop-response"],
    queryFn: getShopResponse,
  });

  const [expandedRow, setExpandedRow] = React.useState(null);

  const handleExpandClick = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };

  return (
    <Container className="mt-5" style={{ width: "80%" }}>
      <Typography className="my-4" variant="h5" color="initial">
        Báo cáo được phản hồi
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cửa hàng</TableCell>
              <TableCell>Loại báo cáo</TableCell>
              <TableCell align="center">Chi tiết</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((report) => (
              <React.Fragment key={report.id}>
                <TableRow>
                  <TableCell>{report.shop?.name || "N/A"}</TableCell>
                  <TableCell>{report.reportType1.type}</TableCell>
               
                  <TableCell align="center">
                    <IconButton onClick={() => handleExpandClick(report.id)}>
                      {expandedRow === report.id ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={4}
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                  >
                    <Collapse
                      in={expandedRow === report.id}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box margin={2}>
                        <Typography variant="body2" gutterBottom>
                          <strong>Nội dung báo cáo:</strong>{" "}
                          {report.reportContent}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" gutterBottom>
                            <strong>Hình ảnh:</strong>
                          </Typography>
                          <Box display="flex" flexWrap="wrap">
                            {report.shopReportImages?.length > 0 ? (
                              report.shopReportImages.map((img, index) => (
                                <Box key={index} sx={{ mr: 2, mb: 2 }}>
                                  <img
                                    src={img.reportImageContent}
                                    alt="Hình ảnh báo cáo"
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
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Không có hình ảnh
                              </Typography>
                            )}
                          </Box>
                          <Box>
                            <Typography variant="body2" gutterBottom>
                              <strong>Nội dung báo cáo:</strong>{" "}
                              {report.reportResponse}
                            </Typography>
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
    </Container>
  );
};

export default ShopResponse;

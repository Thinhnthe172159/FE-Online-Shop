import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Box,
  Grid,
  Divider,
  TextareaAutosize,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  Stack,
  Button,
  Dialog,
  DialogContent,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ImageIcon from '@mui/icons-material/Image';
import { fetch } from '../../../api/Fetch';
import { useMutation } from '@tanstack/react-query';
import { saveResponeShop } from '../../../api/reportAip';
import Swal from 'sweetalert2';

export const ShopReport = () => {
  const [reports, setReports] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [openImage, setOpenImage] = useState(null);
  const [responses, setResponses] = useState({});

  const fetchReports = async () => {
    try {
      const response = await fetch.get('/shop-reports/all');
      if (response.status === 200) {
        const groupedReports = response.data.reduce((acc, report) => {
          const existingReport = acc.find(r => r.id === report.id);
          if (existingReport) {
            existingReport.shopReportImages.push(...report.shopReportImages);
          } else {
            acc.push({ ...report, shopReportImages: [...report.shopReportImages] });
          }
          return acc;
        }, []);
        setReports(groupedReports);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu báo cáo:', error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleExpandClick = (reportId) => {
    setExpanded(expanded === reportId ? null : reportId);
  };

  const handleImageClick = (imageUrl) => {
    setOpenImage(imageUrl);
  };

  const handleCloseImageDialog = () => {
    setOpenImage(null);
  };

  const { mutate } = useMutation({
    mutationFn: (data) => saveResponeShop(data),
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        text: "Đã gửi phản hồi đến cửa hàng"
      });
      fetchReports(); // Gọi lại API lấy báo cáo sau khi gửi phản hồi thành công
    },
    onError: (e) => {
      console.log(e);
      Swal.fire({
        icon: "error",
        text: "Vui lòng thử lại sau"
      });
    }
  });

  const handleResponseChange = (reportId, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [reportId]: value,
    }));
  };

  const handleSendResponse = (reportId) => {
    const responseText = responses[reportId];
    if (responseText) {
      let content = {
        id: reportId,
        reportResponse: responseText,
      };
      mutate(content);
    } else {
      alert('Vui lòng nhập phản hồi trước khi gửi.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
        Báo Cáo Cửa Hàng
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cửa hàng</TableCell>
                  <TableCell>Loại báo cáo</TableCell>
                  <TableCell align="center">Mở rộng</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <React.Fragment key={report.id}>
                    <TableRow>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar
                            src={report.shop && report.shop.logo ? report.shop.logo : null}
                            alt={report.shop ? report.shop.name : 'Logo'}
                            sx={{ width: 40, height: 40, mr: 2, border: '1px solid #3f51b5' }}
                          />
                          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                            {report.shop ? report.shop.name : 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{report.reportType1.type}</TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleExpandClick(report.id)}>
                          <ExpandMoreIcon
                            sx={{
                              transform: expanded === report.id ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.3s',
                            }}
                          />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                        <Collapse in={expanded === report.id} timeout="auto" unmountOnExit>
                          <Box margin={2}>
                            <Typography variant="body2" gutterBottom>
                              <strong>Nội dung báo cáo:</strong> {report.reportContent}
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="body2" gutterBottom><strong>Hình ảnh:</strong></Typography>
                              <Grid container spacing={1}>
                                {report.shopReportImages?.length > 0 ? (
                                  report.shopReportImages.map((img, index) => (
                                    <Grid item key={index}>
                                      <Avatar
                                        src={img.reportImageContent}
                                        variant="rounded"
                                        sx={{ width: 60, height: 60, border: '2px solid #3f51b5', cursor: 'pointer' }}
                                        onClick={() => handleImageClick(img.reportImageContent)}
                                      />
                                    </Grid>
                                  ))
                                ) : (
                                  <Box display="flex" alignItems="center">
                                    <ImageIcon sx={{ color: '#757575', mr: 1 }} />
                                    <Typography variant="body2" color="text.secondary">Không có hình ảnh</Typography>
                                  </Box>
                                )}
                              </Grid>
                            </Box>
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="body2" gutterBottom><strong>Phản hồi:</strong></Typography>
                              <TextareaAutosize
                                minRows={3}
                                placeholder="Nhập phản hồi..."
                                value={report.reportResponse || responses[report.id] || ''}
                                onChange={(e) => handleResponseChange(report.id, e.target.value)}
                                style={{ width: '100%', padding: '8px', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                disabled={Boolean(report.reportResponse)} // Vô hiệu hóa nếu đã có phản hồi
                              />
                              {!report.reportResponse && (
                                <Stack direction="row" sx={{ justifyContent: "center", mt: 2 }}>
                                  <Button variant="contained" color="primary" onClick={() => handleSendResponse(report.id)}>
                                    Gửi phản hồi
                                  </Button>
                                </Stack>
                              )}
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
        </CardContent>
      </Card>

      {/* Hộp thoại để phóng to hình ảnh */}
      <Dialog open={Boolean(openImage)} onClose={handleCloseImageDialog} maxWidth="sm" fullWidth>
        <DialogContent>
          <img src={openImage} alt="Phóng to hình ảnh" style={{ width: '100%' }} />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ShopReport;

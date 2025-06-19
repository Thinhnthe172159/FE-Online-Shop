import { Box, Button, Checkbox, Snackbar } from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import { Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './productmodal.scss';
import ProductRow from "./ProductRow";
import { fetch } from "../../../api/Fetch";
import * as XLSX from "xlsx"; 
const ProductTable = ({ selectedCategories,selectedPriceRanges  }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch.get("/product/getAll");
        console.log("data", response.data.data);
        setProducts(response.data.data);
      } catch (error) {
        setErrorMessage('Lỗi khi lấy dữ liệu sản phẩm.');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  const filteredByCategory = products.filter((product) =>
    // Ensure product.categories exists and is an array
    product.categories?.some((category) => selectedCategories.includes(category.id))
  );
  console.log("selectedPriceRanges", selectedPriceRanges);
  console.log("selectedCategories", selectedCategories);
  const filteredByPrice = filteredByCategory.filter((product) => {
    
  
    return selectedPriceRanges?.some((range) => {
      const price = product.price;
  
      switch (range) {
        case "0-100000":
          return price >= 0 && price <= 100000;
        case "100000-1000000":
          return price > 100000 && price <= 1000000;
        case "1000000-10000000":
          return price > 1000000 && price <= 10000000;
        case "10000000+":
          return price > 10000000;
        default:
          return false;
      }
    });
  });
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const filteredProducts = filteredByPrice.filter(product => 
    product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
    product.id.toString().includes(debouncedSearchTerm)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleDeleteProduct = useCallback(async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        const response = await fetch.delete(`/product/delete/${id}`);
        console.log('Product deleted successfully', response.data);
        
        setProducts((prevProducts) => prevProducts.filter(product => product.id !== id));
        setSelectedItems((prevSelected) => prevSelected.filter(item => item !== id));
      } catch (error) {
        setErrorMessage("Lỗi khi xóa sản phẩm.");
        setOpenSnackbar(true);
      }
    }
  }, [setProducts, setSelectedItems]);

  // New function to handle status changes
  const handleChangeStatus = async (id, status) => {
    try {
      const newStatus = status === 1 ? 2 : 1; // Toggle status (0 to 1, or 1 to 0)
      const response = await fetch.put(`/product/updateStatus`, null, {
        params: { productId: id, status: newStatus }
      });
      
      // Update state if successful
      setProducts((prevProducts) =>
        prevProducts.map(product =>
          product.id === id ? { ...product, status: newStatus } : product
        )
      );
      console.log("Status updated successfully", response.data);
    } catch (error) {
      setErrorMessage("Lỗi khi cập nhật trạng thái sản phẩm.");
      setOpenSnackbar(true);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prevSelected => 
      prevSelected.includes(id) 
        ? prevSelected.filter(item => item !== id) 
        : [...prevSelected, id]
    );
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  console.log(products);
  const handleExport = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
  
    // Format the filtered products for Excel
    const exportData = filteredProducts.map(product => ({
      "Mã hàng": product.id,
      "Tên hàng": product.name,
      "Giá bán": product.price,
      "Trạng thái": product.status === 1 ? "Kích hoạt" : "Không kích hoạt",
      "Danh mục": product.categories.map(category => category.name).join(", "),
      "Cân nặng": product.weight,
      "Chiều cao": product.height,
      "Chiều dài": product.length,
      "Chiều rộng": product.width,
      "Tùy chọn": product.options.map(option => `${option.name} (Số lượng: ${option.quantity})`).join(", "),
      "Mô tả": product.description,
      "Ngày tạo": product.create_at,
      "Ngày cập nhật": product.update_at,
    }));
  
    // Create a worksheet from the exportData array
    const ws = XLSX.utils.json_to_sheet(exportData);
  
    // Apply wrap text for all cells
    const range = XLSX.utils.decode_range(ws['!ref']); // Get the range of the data in the sheet
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = { r: R, c: C }; // The current cell address
        const cell = ws[XLSX.utils.encode_cell(address)];
  
        if (cell) {
          // Ensure 's' property exists for styling
          cell.s = cell.s || {};
          cell.s.alignment = cell.s.alignment || {};
          cell.s.alignment.wrapText = true;  // Set wrapText to true for each cell
        }
      }
    }
  
    // Fixed column widths (in characters) to allow proper wrapping
    const colWidths = [
      { wch: 12 },  // Mã hàng
      { wch: 30 },  // Tên hàng
      { wch: 12 },  // Giá bán
      { wch: 20 },  // Trạng thái
      { wch: 25 },  // Danh mục
      { wch: 12 },  // Cân nặng
      { wch: 12 },  // Chiều cao
      { wch: 12 },  // Chiều dài
      { wch: 12 },  // Chiều rộng
      { wch: 40 },  // Tùy chọn
      { wch: 50 },  // Mô tả
      { wch: 20 },  // Ngày tạo
      { wch: 20 },  // Ngày cập nhật
    ];
  
    // Apply the fixed column widths
    ws['!cols'] = colWidths;
  
  
    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sản phẩm");
  
    // Generate an Excel file and trigger the download
    XLSX.writeFile(wb, "products.xlsx");
  };
  
  
  
  
  return (
    <Container fluid id="seller-table-product">
      <Box>
        <Row style={{ justifyContent: "space-between" }}>
          <Col>
            <Form className="mx-2">
              <Form.Group className="mb-3">
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Tìm kiếm theo tên hoặc mã sản phẩm"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Form>
          </Col>
          <Col>
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <Button onClick={() => navigate('/seller/add-product')} sx={{ backgroundColor: "#00b63e", color: "white", marginRight: 1 }}>
                Thêm mới +
              </Button>

              <Button onClick={handleExport} sx={{ backgroundColor: "#ff9800", color: "white" }}>
                Xuất file
              </Button>
            </Box>
          </Col>
        </Row>
      </Box>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={selectedItems.length === currentItems.length}
                  onChange={() => {
                    if (selectedItems.length === currentItems.length) {
                      setSelectedItems([]);
                    } else {
                      setSelectedItems(currentItems.map(item => item.id));
                    }
                  }}
                />
              </TableCell>
              <TableCell>Mã hàng</TableCell>
              <TableCell >Ảnh</TableCell>
              <TableCell width={"40%"}>Tên hàng</TableCell>
              <TableCell  width={"10%"}>Giá bán</TableCell>
              <TableCell width={"10%"}>Còn lại</TableCell>
              <TableCell width={"20%"}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không có sản phẩm nào được tìm thấy.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((product) => (
                <ProductRow 
                  key={product.id} 
                  product={product} 
                  handleDeleteProduct={handleDeleteProduct}
                  handleChangeStatus={handleChangeStatus}
                />
              ))
            )}
          </TableBody>
        </Table>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>Đầu</Button>
        <Button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Trước</Button>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button key={index + 1} onClick={() => setCurrentPage(index + 1)} variant={currentPage === index + 1 ? 'contained' : 'outlined'} sx={{ margin: '0 5px' }}>
            {index + 1}
          </Button>
        ))}
        <Button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Tiếp</Button>
        <Button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>Cuối</Button>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={errorMessage}
      />
    </Container>
  );
}

export default ProductTable;

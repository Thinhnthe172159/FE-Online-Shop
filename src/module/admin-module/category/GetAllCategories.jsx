import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, IconButton, Collapse, Box,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, Alert,
  FormControl, InputLabel, Select, MenuItem, DialogContentText
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { fetch } from "../../../api/Fetch";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [name, setName] = useState('');
  const [status, setStatus] = useState(1);
  const [parent, setParent] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [originalName, setOriginalName] = useState(''); 
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [expandedId, setExpandedId] = useState(null); 
  const [isSubcategory, setIsSubcategory] = useState(false);
  const [subcategoryParentId, setSubcategoryParentId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch.get('/category/getAll');
      const categoriesWithDefaults = response.data.data.map(category => ({
        ...category,
        parentName: category.parentName || 'Không có' 
      }));
      setCategories(categoriesWithDefaults);
      setAllCategories(categoriesWithDefaults);
    } catch (error) {
      console.error('Lỗi khi tải danh mục', error);
    }
  };
  console.log(categories);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError('Tên danh mục không được để trống');
      return;
    }

    if (name.trim().toLowerCase() !== originalName.toLowerCase()) {
      const isDuplicate = categories.some(
        (category) => category.name.toLowerCase() === name.trim().toLowerCase() && category.id !== editingId
      );
      if (isDuplicate) {
        setError('Tên danh mục đã tồn tại!');
        return;
      }
    }

    try {
      let response;
      if (editingId) {
        // Cập nhật danh mục hoặc danh mục con
        response = await fetch.put(`/category/update/${editingId}`, { name, status, parent });
        setMessage('Cập nhật danh mục thành công');
      } else {
        response = await fetch.post('/category/create', { name, status, parent });
        setMessage('Thêm danh mục thành công');
      }

      fetchCategories(); 
      setName('');
      setStatus(1);
      setParent(null);
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error('Lỗi khi gửi danh mục', error);
      setMessage('Có lỗi khi thêm/cập nhật danh mục');
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setName(category.name);
    setStatus(category.status);
    setParent(category.parent);
    setOriginalName(category.name); 
    setError('');
    setNameError('');
    setShowForm(true);
    setIsSubcategory(false);
  };

  const handleEditSubcategory = (subcategory, parentId) => {
    setEditingId(subcategory.id);
    setName(subcategory.name);
    setStatus(subcategory.status);
    setParent(parentId);
    setOriginalName(subcategory.name); 
    setError('');
    setNameError('');
    setShowForm(true);
    setIsSubcategory(true);
    setSubcategoryParentId(parentId);
  };

  const handleAdd = () => {
    setEditingId(null);
    setName('');
    setStatus(1);
    setParent(null);
    setOriginalName(''); 
    setError('');
    setNameError('');
    setShowForm(true);
    setIsSubcategory(false);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setError('');
    setNameError('');
  };

  const handleDeleteConfirmOpen = (id, isSub = false) => {
    setCategoryToDelete(id);
    setDeleteConfirmOpen(true);
    setIsSubcategory(isSub);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch.delete(`/category/delete/${categoryToDelete}`);
      if (response.status === 200) {
        setMessage('Xóa danh mục thành công');
        setCategories(categories.filter(category => category.id !== categoryToDelete));
      } else {
        setMessage('Có lỗi khi xóa danh mục');
      }
    } catch (error) {
      console.error('Lỗi khi xóa danh mục', error);
      setMessage('Có lỗi khi xóa danh mục');
    } finally {
      setDeleteConfirmOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setCategoryToDelete(null);
  };

  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý danh mục
      </Typography>

      {message && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mb: 2 }}>
        Thêm danh mục
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="center">Tên danh mục</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center">Nhóm cha</TableCell>
              <TableCell align="center">Chức năng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <React.Fragment key={category.id}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => handleExpandClick(category.id)}
                    >
                      {expandedId === category.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">{category.name}</TableCell>
                  <TableCell align="center">{category.status === 1 ? 'Hoạt động' : 'Không hoạt động'}</TableCell>
                  <TableCell align="center">{category.parentName || 'Không có'}</TableCell>
                  <TableCell align="center">
                    <Button variant="outlined" color="primary" onClick={() => handleEdit(category)} sx={{ mr: 1 }}>
                      Sửa
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => handleDeleteConfirmOpen(category.id)}>
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={expandedId === category.id} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <Typography variant="h6" gutterBottom component="div">
                          Danh mục con
                        </Typography>
                        {category.subcategories && category.subcategories.length > 0 ? (
                          <Table size="small" aria-label="subcategories">
                            <TableHead>
                              <TableRow>
                                <TableCell align="center">ID</TableCell>
                                <TableCell align="center">Tên danh mục con</TableCell>
                                <TableCell align="center">Trạng thái</TableCell>
                                <TableCell align="center">Chức năng</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {category.subcategories.map((sub) => (
                                <TableRow key={sub.id}>
                                  <TableCell align="center">{sub.id}</TableCell>
                                  <TableCell align="center">{sub.name}</TableCell>
                                  <TableCell align="center">{sub.status === 1 ? 'Hoạt động' : 'Không hoạt động'}</TableCell>
                                  <TableCell align="center">
                                    <Button
                                      variant="outlined"
                                      color="primary"
                                      onClick={() => handleEditSubcategory(sub, category.id)}
                                      sx={{ mr: 1 }}
                                    >
                                      Sửa
                                    </Button>
                                    <Button
                                      variant="outlined"
                                      color="error"
                                      onClick={() => handleDeleteConfirmOpen(sub.id, true)}
                                    >
                                      Xóa
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            Không có danh mục con
                          </Typography>
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Form thêm và sửa danh mục */}
      <Dialog open={showForm} onClose={handleCloseForm}>
        <DialogTitle>{editingId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Tên danh mục"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError('');
            }}
            required
            sx={{ mt: 2 }}
            error={Boolean(nameError)}
            helperText={nameError}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Trạng thái"
            >
              <MenuItem value={1}>Hoạt động</MenuItem>
              <MenuItem value={0}>Không hoạt động</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Nhóm cha</InputLabel>
            <Select
              value={parent}
              onChange={(e) => setParent(e.target.value)}
              label="Nhóm cha"
            >
              <MenuItem value={null}>Không có</MenuItem>
              {allCategories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {editingId ? 'Cập nhật danh mục' : 'Thêm danh mục'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Xác nhận xóa */}
      <Dialog open={deleteConfirmOpen} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa danh mục này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleDelete} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CategoryManagement;

import React, { useState, useEffect } from 'react';
import {
Container, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, Alert, Card, CardContent, Box, IconButton, Grid
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { getReportType, submitReport } from '../../../api/CustomerReportApi';

export const Reportr = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [type, setType] = useState('');
    const [message, setMessage] = useState('');
    const [images, setImages] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [reportTypes, setReportTypes] = useState([]);

    useEffect(() => {
        const fetchReportTypes = async () => {
            try {
                const data = await getReportType();
                if (data) {
                    setReportTypes(data);
                }
            } catch (error) {
                console.error("Error fetching report types:", error);
                setError("Không thể tải danh sách loại phản hồi.");
            }
        };
        fetchReportTypes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!type) {
            setError('Vui lòng chọn loại phản hồi');
            return;
        }
        if (!message) {
            setError('Vui lòng nhập nội dung');
            return;
        }
        setError('');
        const formData = new FormData();
        formData.append('report', JSON.stringify({ reportContent: message, email, typeId: type }));
        images.forEach((image) => {
            formData.append('images', image);
        });
        try {
            const response = await submitReport(formData);      
            console.log(response);
            
            if (response) {
                setError(null)
                setSubmitted(true);
                setName('');
                setEmail('');
                setType('');
                setMessage('');
                setImages([]);
            } else {
                setError('Gửi phản hồi thất bại, vui lòng thử lại.');
            }
        } catch (error) {
            console.error("Error submitting report:", error);
            setError('Đã xảy ra lỗi khi gửi phản hồi.');
        }
    };

    const handleCloseAlert = () => {
        setSubmitted(false);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const validExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

        const validFiles = files.filter((file) => {
            const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
            if (!validExtensions.includes(extension)) {
                setError(`Tệp ${file.name} không được hỗ trợ. Chỉ chấp nhận các tệp .jpg, .jpeg, .png, .gif`);
                return false;
            }
            return true;
        });

        setImages((prevImages) => [...prevImages, ...validFiles]);
    };

    const handleRemoveImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ width: '100%', boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                        Gửi Phản Hồi & Báo Cáo Vấn Đề
                    </Typography>

                    {submitted && (
                        <Alert
                            severity="success"
                            action={
                                <IconButton size="small" onClick={handleCloseAlert}>
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                            sx={{ mb: 2 }}
                        >
                            Cảm ơn bạn đã gửi phản hồi!
                        </Alert>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Box sx={{ mb: 2 }}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Loại phản hồi</InputLabel>
                                <Select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    label="Loại phản hồi"
                                >
                                    {reportTypes.map((reportType) => (
                                        <MenuItem key={reportType.id} value={reportType.id}>
                                            {reportType.type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Nội dung"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" gutterBottom>
                                Ảnh sản phẩm:
                            </Typography>
                            <Button
                                variant="outlined"
                                component="label"
                                sx={{ mb: 2 }}
                            >
                                + Thêm ảnh
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                />
                            </Button>

                            <Grid container spacing={2}>
                                {images.map((image, index) => (
                                    <Grid item xs={3} key={index}>
                                        <Box
                                            sx={{
                                                width: '100%',
                                                height: '100px',
                                                border: '1px dashed gray',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                position: 'relative',
                                            }}
                                        >
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={`preview ${index}`}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleRemoveImage(index)}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 0,
                                                    backgroundColor: 'white',
                                                    '&:hover': {
                                                        backgroundColor: 'white',
                                                    },
                                                }}
                                            >
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            endIcon={<SendIcon />}
                            fullWidth
                            sx={{
                                backgroundColor: '#1976d2',
                                '&:hover': {
                                    backgroundColor: '#1565c0'
                                }
                            }}
                        >
                            Gửi Phản Hồi
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Reportr;

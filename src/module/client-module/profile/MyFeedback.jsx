import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getFeebBackByUser, deleteFeedbackById, editFeedbackById, removeImage } from '../../../api/feedbackApi';
import Loading from '../loading/Loading';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box,
    Rating,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from '@mui/material';

export const MyFeedback = ({ customerId }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);
    const [editComment, setEditComment] = useState('');
    const [editImages, setEditImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [error, setError] = useState('');

    const { data: datafeedback, isLoading, isError, refetch } = useQuery({
        queryKey: ["fb", customerId],
        queryFn: getFeebBackByUser
    });

    console.log(datafeedback);

    const getshort = (name) =>{
        if(name.length > 40){
            return name.substring(0,45)+"..."
        }
        return name
    }

    useEffect(() => {
        if (datafeedback) {
            const aggregatedFeedbacks = datafeedback.reduce((acc, feedback) => {
                const { id, product, feedbackImages, rating, comment, create_at } = feedback;
                if (!acc[id]) {
                    acc[id] = {
                        product,
                        feedbackImages: [],
                        rating,
                        comment,
                        create_at,
                        id
                    };
                }
                acc[id].feedbackImages = acc[id].feedbackImages.concat(feedbackImages);
                return acc;
            }, {});

            setFeedbacks(Object.values(aggregatedFeedbacks));
        }
    }, [datafeedback]);

    const handleDeleteClick = (feedbackId) => {
        setSelectedFeedbackId(feedbackId);
        setOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedFeedbackId) {
            const response = await deleteFeedbackById(selectedFeedbackId);
            if (response) {
                setFeedbacks(feedbacks.filter(feedback => feedback.id !== selectedFeedbackId));
                alert("Đánh giá đã được xóa thành công");
            } else {
                alert("Không thể xóa đánh giá");
            }
        }
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleEditClick = (feedback) => {
        setSelectedFeedbackId(feedback.id);
        setEditComment(feedback.comment);
        setEditImages(feedback.feedbackImages);
        setNewImages([]);
        setImagesToDelete([]);
        setOpenEdit(true);
    };

    const handleEditSubmit = async () => {
        if (editComment.trim() === '') {
            setError('Nhận xét không được để trống');
            return;
        }

        const formData = new FormData();
        formData.append('feedback', JSON.stringify({
            ...feedbacks.find(f => f.id === selectedFeedbackId),
            comment: editComment
        }));

        newImages.forEach(image => {
            formData.append('images', image);
        });

        imagesToDelete.forEach(image => {
            formData.append('deleteImages', image);
        });

        const response = await editFeedbackById(selectedFeedbackId, formData);
        
        
        // if (response.status === 200) {
        //     const updatedFeedbacks = feedbacks.map(feedback =>
        //         feedback.id === selectedFeedbackId
        //             ? {
        //                 ...feedback,
        //                 comment: editComment,
        //                 feedbackImages: [...editImages.filter(img => !imagesToDelete.includes(img.imageContent)), ...newImages.map(file => URL.createObjectURL(file))]
        //             }
        //             : feedback
        //     );
        //     setFeedbacks(updatedFeedbacks);
        //     refetch();
        // } else {
        //     alert("Không thể sửa đánh giá: " + response.data.message);
        // }
        setOpenEdit(false);
        refetch();
    };

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        console.log(files);
        const allFilesValid = files.every(file => file.type === 'image/jpeg' || file.type === 'image/png');
        if (allFilesValid) {
            setNewImages(files);
            setError('');
        } else {
            setError('Tất cả các tệp phải là hình ảnh (JPEG hoặc PNG)');
        }
    };

    const {mutate} = useMutation({
        mutationFn:(id)=> removeImage(id),
        onSuccess: () => {
           setOpenEdit(false)
            refetch()
        }
    })


    const handleDeleteImage = (id) => {
       mutate(id);
    };

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return <div>Lỗi khi lấy dữ liệu đánh giá</div>;
    }

    return (
        <div style={{ margin: '20px' }}>
            <h2>Đánh Giá Của Tôi</h2>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tên Sản Phẩm</TableCell>
                            <TableCell>Hình Ảnh</TableCell>
                            <TableCell>Đánh Giá</TableCell>
                            <TableCell>Nhận Xét</TableCell>
                            <TableCell>Ngày</TableCell>
                            <TableCell>Hành Động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {feedbacks.length > 0 ? (
                            feedbacks.map((feedback) => (
                                <TableRow key={feedback.id}>
                                    <TableCell>{getshort(feedback.product.name)}</TableCell>
                                    <TableCell>
                                        {feedback.feedbackImages.length > 0 && feedback.feedbackImages.map((image, index) => (
                                            <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                                                <img
                                                    src={image.imageContent}
                                                    alt={`Feedback Image`}
                                                    style={{ width: '50px', height: '50px', cursor: 'pointer', marginRight: '5px' }}
                                                    onClick={() => window.open(image.imageContent, '_blank')}
                                                />
                                            </div>
                                        ))}
                                    </TableCell>
                                    <TableCell>
                                        <Rating value={feedback.rating} readOnly precision={0.5} />
                                    </TableCell>
                                    <TableCell>{feedback.comment}</TableCell>
                                    <TableCell>{new Intl.DateTimeFormat('vi-VN').format(new Date(feedback.create_at))}</TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center">
                                            <Button variant="outlined" color="success" style={{ marginRight: '8px' }} onClick={() => handleEditClick(feedback)}>Sửa</Button>
                                            <Button variant="outlined" color="error" onClick={() => handleDeleteClick(feedback.id)}>Xóa</Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan="6" style={{ textAlign: 'center' }}>Không có phản hồi nào</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa đánh giá này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
                <DialogTitle>Sửa Đánh Giá</DialogTitle>
                <DialogContent style={{ minWidth: '400px', minHeight: '300px' }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nhận Xét"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        multiline
                        rows={4}
                    />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div>
                        <input
                            type="file"
                            multiple
                            accept="image/jpeg, image/png"
                            onChange={handleImageChange}
                        />
                        <div>
                            {editImages.length > 0 && editImages.map((img, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                    <img src={img.imageContent} alt="existing" style={{ width: '50px', height: '50px', margin: '5px' }} />
                                    <Button onClick={() => handleDeleteImage(img.feedbackImageId)}>Xóa</Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleEditSubmit} color="primary">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default MyFeedback;

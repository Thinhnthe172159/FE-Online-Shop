import React, { useState } from 'react';
import { Avatar, Box, Dialog, DialogContent, Rating, Stack, Typography } from '@mui/material';

const FeedbackContent = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const handleClickOpen = (imageUrl) => {
    setSelectedImage(imageUrl); 
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false); 
    setSelectedImage(''); 
  };

  return (
    <div className="mt-3" id="feedback-content">
      {data.length > 0 ? (
        data.map((feedback, index) => (
          <Stack key={index} direction={"row"} spacing={3} className="feedback-item">
            <Avatar src={feedback.customer.avatar} sx={{ width: 56, height: 56 }} />
            <Box className="feedback-user-name">
              <Typography variant="h6" color="initial">{feedback.customer.name}</Typography>
              <Stack direction={"row"} spacing={1} sx={{ alignItems: "center" }}>
                <Typography sx={{ fontSize: '12px', fontWeight: 400, lineHeight: "16px", color: "#868686" }}>
                  {new Date(feedback.create_at).toLocaleString()} 
                </Typography>
                <Rating size='small' name="read-only" value={feedback.rating} readOnly />
              </Stack>
              <Box className="feedback-user-content mt-3">
                <p style={{ fontWeight: 400 }}>{feedback.comment}</p>
                <Stack direction={"row"} spacing={1}>
                  {feedback.feedbackImages && feedback.feedbackImages.map((image, i) => (
                    <Box key={i} sx={{ width: "75px", height: "75px", cursor: "pointer" }}>
                      <img 
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                        src={image.imageContent}
                        alt={`Feedback image ${i + 1}`}
                        onClick={() => handleClickOpen(image.imageContent)} 
                      />
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Stack>
        ))
      ) : (
        <Typography>No feedback available.</Typography>
      )}
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogContent>
          <img 
            src={selectedImage} 
            alt="Full Size Feedback Image" 
            style={{ width: "100%", height: "100%", objectFit: "contain" }} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedbackContent;

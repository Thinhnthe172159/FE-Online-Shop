import React from 'react';
import { Box, Typography, Stepper, Step, StepLabel } from '@mui/material';

const DetailStep = ({ status }) => {
 
    if(status == 3 || status ==4){
        status++
    }
  const steps = ["Chưa xác nhận", 'Đã xác nhận', "Đang giao", "Hoàn tất"];

  if(status != 5){
    return (
      <Box sx={{ width: '100%', my: 5 }}>
        <Typography variant="h6" component="div" sx={{ mb: 2, textAlign: 'center' }}>
          Trạng thái giao hàng
        </Typography>
        <Stepper activeStep={status} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    );
  }
}

export default DetailStep;

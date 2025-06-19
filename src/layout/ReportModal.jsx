import { Button } from '@mui/material'
import React from 'react'
import { Modal } from 'react-bootstrap'
import "./modal.css"

const ReportModal = ({show, handleSave,data}) => {
  return (
    <Modal dialogClassName='modal-report' show={show} >
        <Modal.Header closeButton>
          <Modal.Title>Thông báo phản hồi</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có {data} phản hồi báo cáo từ quản trị , vui lòng kiểm tra</Modal.Body>
        <Modal.Footer>
        
          <Button color='error' onClick={handleSave} sx={{textTransform:"initial"}} variant="contained" >
            Tôi đã hiểu
          </Button>
        </Modal.Footer>
      </Modal>
  )
}

export default ReportModal
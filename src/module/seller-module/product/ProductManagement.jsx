import React,{useState} from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import ProductNav from './ProductNav'
import ProductTable from './ProductTable'
import { Stack } from '@mui/material'

const ProductManagement = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const handleCategoryChange = (categories) => {
    console.log("categoties:",categories );
    
    setSelectedCategories(categories); // Cập nhật danh sách nhóm hàng đã chọn
  };
  const handlePriceRangeChange = (ranges) => {
    console.log("ranges:",ranges );
    setSelectedPriceRanges(ranges);
  };
  return (
    <Container fluid className='mt-4' style={{
        minHeight: "100vh"
    }}>
        <Stack
            direction={"row"}
            spacing={3}
        >
             <div style={{width:"20%"}}>
             <ProductNav onCategoryChange={handleCategoryChange} onPriceRangeChange={handlePriceRangeChange} />
             </div>
             <ProductTable selectedCategories={selectedCategories} selectedPriceRanges={selectedPriceRanges}/>

            {/* <Col lg={3}> 
               
            </Col>
            <Col lg={9}> 
               
            </Col> */}
        </Stack>
    </Container>
  )
}

export default ProductManagement
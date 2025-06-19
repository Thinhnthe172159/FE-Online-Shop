import { Stack } from '@mui/material';
import React from 'react'
import { Col, Row,Container } from 'react-bootstrap';
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import { Link } from "react-router-dom";
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import Loading from '../loading/Loading';
import { getUserDetail } from '../../../api/customerApi';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
const ProfileHome = () => {


  const login = useSelector((state) => state.auth.login)
  const{data, isLoading, refetch} = useQuery({
      queryKey: ['account-home'],
      queryFn: getUserDetail,
      enabled: login,
      retry: 1
  })


    const detailItem = [
        {
          label: "Hồ sơ",
          icon: <PersonOutlineOutlinedIcon />,
        },
    
        {
          label: "Địa chỉ",
          icon: <CreditCardOutlinedIcon />,
        },
    
        {
          label: "Thẻ",
          icon: <RoomOutlinedIcon />,
        },
      ];

      if(isLoading){
        return <Loading></Loading>
      }
    const handleAccountClick = () =>{
        
    }

  return (
    <Row>
    <Col lg={7}>
      <Stack direction={"column"} spacing={3}>
        <div className="account">
          <div className="account-top">
            <Stack direction={"row"} spacing={2}>
              <div>
                <img
                  width={"80px"}
                  height={"80px"}
                  src={data.avatar}
                  alt=""
                />
              </div>
              <Stack
                direction={"column"}
                spacing={0}
                className="mt-2"
              >
                <span>Xin chào</span>
                <h4>{data.name}</h4>
              </Stack>
            </Stack>
          </div>

          <div className="account-bottom mt-3">
            <Container style={{ width: "65%" }}>
              <Stack
                direction={"row"}
                sx={{ justifyContent: "space-between" }}
              >
                {detailItem.map((item) => {
                  return (
                    <div key={item.label} className="item">
                      <div className="item-icon">{item.icon}</div>
                      <div className="item-text">{item.label}</div>
                    </div>
                  );
                })}
              </Stack>
            </Container>
          </div>
        </div>

        <div className="order mt-4 px-3 py-3">
          <div className="order-top">
            <Stack direction={"row"} sx={{justifyContent:"space-between"}}>
              <h4>Đơn hàng</h4>
              <Link>Khám phá thêm <ArrowForwardOutlinedIcon/></Link>
            </Stack>
          </div>
          <div className="order-bottom mt-4">
            <Container style={{ width: "65%" }}>
              <Stack
                direction={"row"}
                sx={{ justifyContent: "space-between" }}
              >
                {detailItem.map((item) => {
                  return (
                    <div className="item">
                      <div className="item-icon">{item.icon}</div>
                      <div className="item-text">{item.label}</div>
                    </div>
                  );
                })}
              </Stack>
            </Container>
          </div>
        </div>
      </Stack>
    </Col>
    <Col>
      <div className="favorite">
      <div className="order px-3 py-3">
          <div className="order-top">
            <Stack direction={"row"} sx={{justifyContent:"space-between"}}>
              <h4>Yêu thích</h4>
              <Link>Khám phá thêm <ArrowForwardOutlinedIcon/></Link>
            </Stack>
          </div>
          <div className="order-bottom mt-4">
          
              <Stack
                direction={"row"}
                sx={{ justifyContent: "space-between" }}
              >
                  <div className="favorite-item">
                    <img src="https://static.chus.vn/images/thumbnails/104/104/detailed/273/13,6_cm__2_.jpg" alt="" />
                  </div>
              </Stack>
            
          </div>
        </div>
      </div>
    </Col>
  </Row>
  )
}

export default ProfileHome
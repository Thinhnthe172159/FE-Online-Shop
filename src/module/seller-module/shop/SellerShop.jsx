import React from 'react'
import "./sellershop.scss"
import { useQuery } from '@tanstack/react-query'
import { getShop, getShopDetail } from '../../../api/shopApi'
import Loading from '../../client-module/loading/Loading'
import { Container } from 'react-bootstrap'
import { Box, Stack } from '@mui/material'
import UpdateShopDetail from './UpdateShopDetail'
import DetailShop from './DetailShop'
import UpdateAddress from './UpdateAddress'
import UpdateShipCost from './UpdateShipCost'
import ManagePhone from './UpdatePhone'
import ProfilePage from './DetailShop'
import GeneralUpdate from './GeneralUpdate'
import PersonalProfile from './DetailShop'
const SellerShop = () => {
    const {data,isLoading} = useQuery({
        queryKey:['getShop-detail'],
        queryFn: getShopDetail,
        retry: 1
    })
   
    

if(isLoading){
    return <Loading></Loading>
}

  return (
    <div id='seller-shop' >
        <Container style={{width:"80%"}}>
            <Box>
                <PersonalProfile shop={data}></PersonalProfile>

            </Box>
            {/* <Box >
                <GeneralUpdate data={data}></GeneralUpdate>
           
            </Box> */}
        </Container>
    </div>
  )
}

export default SellerShop
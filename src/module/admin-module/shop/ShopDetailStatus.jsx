import React from 'react'
import ProfilePage from '../../seller-module/shop/DetailShop'

const ShopDetailStatus = ({shop}) => {
    console.log(shop);
    
  return (
    <ProfilePage shop={shop} admin={true}></ProfilePage>
  )
}

export default ShopDetailStatus
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./profileNav.scss";

const ProfileNav = () => {
  const [account, setAccount] = useState(false);
  const [order, setOrder] = useState(false);
  const [report, setReport] = useState(false);

  const location = useLocation();  // Lấy thông tin location hiện tại từ React Router

  const showAccount = () => {
    setAccount(!account);
  };

  const showOrder = () => {
    setOrder(!order);
  };

  // Kiểm tra xem URL hiện tại có phải là một trong các trang liên quan đến "Đơn hàng của tôi"
  useEffect(() => {
    const orderPaths = [
      "/profile/history-order-all",
      "/profile/history-order-ship",
      "/profile/history-order-success",
      "/profile/history-order-cancel",
    ];

    // Nếu đường dẫn hiện tại là một trong các trang trên, mở menu "Đơn hàng của tôi"
    if (orderPaths.includes(location.pathname)) {
      setOrder(true);
    } else {
      setOrder(false);
    }
  }, [location.pathname]); // Mỗi khi location.pathname thay đổi, kiểm tra lại

  return (
    <div id="profile-nav">
      <ul>
        <li>
          <NavLink to={"/profile"} end>
            6MEMs của tôi
          </NavLink>
        </li>
        <li className="nested-menu">
          <div className="sub-menu-head" onClick={showAccount}>
            <p>Tài khoản của tôi</p>
            <p>{account ? "-" : "+"}</p>
          </div>
          <ul className={account ? "sub-menu active-sub-menu" : "sub-menu"}>
            <li>
              <NavLink to={"/profile/account"}>Thông tin tài khoản</NavLink>
            </li>
            <li>
              <NavLink to={"/profile/address"}>Địa chỉ</NavLink>
            </li>
          </ul>
        </li>
        <li className="nested-menu" onClick={showOrder}>
          <div className="sub-menu-head">
            <p>Đơn hàng của tôi</p>
            <p>{order ? "-" : "+"}</p>
          </div>
          <ul className={order ? "sub-menu active-sub-menu" : "sub-menu"}>
            <li>
              <NavLink to={"/profile/history-order-all"}>Tất cả đơn hàng</NavLink>
            </li>
            <li>
              <NavLink to={"/profile/history-order-ship"}>Đang giao hàng</NavLink>
            </li>
            <li>
              <NavLink to={"/profile/history-order-success"}>Đã giao hàng</NavLink>
            </li>
            <li>
              <NavLink to={"/profile/history-order-cancel"}>Đã hủy</NavLink>
            </li>
          </ul>
        </li>
        <li>
          <NavLink to={"/profile/shop-register"}>Đăng ký bán hàng</NavLink>
        </li>
        <li>
          <NavLink to={"/profile/product-feedback"}>Sản phẩm chờ đánh giá</NavLink>
        </li>
        <li>
          <NavLink to={"/profile/my-feedback"}>Đánh giá của tôi</NavLink>
        </li>
        <li className="nested-menu">
          <div className="sub-menu-head" onClick={() => setReport(!report)}>
            <p>Báo cáo</p>
            <p>{report ? "-" : "+"}</p>
          </div>
          <ul className={report ? "sub-menu active-sub-menu" : "sub-menu"}>
            <li>
              <NavLink to={"/profile/report"}>Báo cáo sự cố</NavLink>
            </li>
      
            <li>
              <NavLink to={"/profile/response"}>Phản hồi</NavLink>
            </li>
          </ul>
        </li>
        <li><NavLink to={"/"}>Thoát</NavLink></li>
      </ul>
    </div>
  );
};

export default ProfileNav;

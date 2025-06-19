import React, { useState } from "react";
import { Link, Navigate, NavLink, useNavigate } from "react-router-dom";
import "./navside.scss"; // Import file SCSS

// Import Material-UI icons
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import CategoryIcon from "@mui/icons-material/Category";
import PaymentIcon from "@mui/icons-material/Payment";
import SettingsIcon from "@mui/icons-material/Settings";
import StorefrontIcon from '@mui/icons-material/Storefront';
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import WidgetsIcon from '@mui/icons-material/Widgets';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import LogoutIcon from "@mui/icons-material/Logout";
import ReportIcon from "@mui/icons-material/Report"
import LockIcon from '@mui/icons-material/Lock';
import {
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { LOGOUT } from "../../redux/slice/AuthSlice";

function NavSide() {
  const navigate = useNavigate(); // Khởi tạo hook useNavigate

  // Tạo các state riêng biệt cho từng phần menu
  const [openUserManagement, setOpenUserManagement] = useState(false);
  const [openShopManagement, setOpenShopManagement] = useState(false);
  const [openCategoryManagement, setOpenCategoryManagement] = useState(false);
  const [openSalesRegistration, setOpenSalesRegistration] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  // Hàm handle để đóng/mở từng phần
  const handleToggleUserManagement = () => {
    setOpenUserManagement(!openUserManagement);
  };

  const handleToggleShopManagement = () => {
    setOpenShopManagement(!openShopManagement);
  };

  const handleToggleCategoryManagement = () => {
    setOpenCategoryManagement(!openCategoryManagement);
  };

  const handleToggleSalesRegistration = () => {
    setOpenSalesRegistration(!openSalesRegistration);
  };
  const handleOpenReport = () => {
    setOpenReport(!openReport); // Thay đổi state cho "Quản lý báo cáo"
  };

  const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(LOGOUT())
    window.location.reload()
    // Chuyển hướng hoặc thực hiện hành động đăng xuất tại đây
  };

  // Hàm điều hướng đến trang chủ
  const navigateToHome = () => {
    navigate("/admin");
  };

  return (
    <div id="nav-admin">
      <div className="navSide">
        {/* Administration menu */}
        <ul className="menuList">

          {/* Trang chủ */}
          <li className="menuItem">
            <ListItemButton onClick={navigateToHome}> {/* Thêm onClick để điều hướng */}
              <ListItemIcon sx={{ color: "black" }}>
                <BusinessIcon />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontWeight: "bold" }}
                primary="Trang chủ"
              />
            </ListItemButton>
          </li>

          {/* Quản lý người dùng */}
          <li className="menuItem">
            <ListItemButton onClick={handleToggleUserManagement}>
              <ListItemIcon sx={{ color: "black" }}>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontWeight: "bold" }}
                primary="Quản lý người dùng"
              />
              {openUserManagement ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={openUserManagement} timeout="auto" unmountOnExit>
              <ul className="nav-item-ul">
                <Link to={"/admin/customer"}><li>Quản lý khách hàng</li></Link>
                <Link to={"/admin/shopOwner"}><li>Quản lý chủ cửa hàng</li></Link>
                <Link to={"/admin/admins"}><li>Quản lý quản trị viên</li></Link>
              </ul>
            </Collapse>
          </li>

          {/* Quản lý cửa hàng */}
          <li className="menuItem">
            <ListItemButton onClick={handleToggleShopManagement}>
              <ListItemIcon sx={{ color: "black" }}>
                <StorefrontIcon />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontWeight: "bold" }}
                primary="Quản lý cửa hàng"
              />
              {openShopManagement ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={openShopManagement} timeout="auto" unmountOnExit>
              <ul className="nav-item-ul">
                <Link to={"/admin/shop"}><li>Quản lý cửa hàng</li></Link>
              </ul>
            </Collapse>
          </li>

          {/* Quản lý danh mục */}
          <li className="menuItem">
            <ListItemButton onClick={handleToggleCategoryManagement}>
              <ListItemIcon sx={{ color: "black" }}>
                <WidgetsIcon />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontWeight: "bold" }}
                primary="Quản lý danh mục"
              />
              {openCategoryManagement ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={openCategoryManagement} timeout="auto" unmountOnExit>
              <ul className="nav-item-ul">
                <Link to={"/admin/category/all"}><li>Quản lý danh mục</li></Link>
              </ul>
            </Collapse>
            <Collapse in={openCategoryManagement} timeout="auto" unmountOnExit>
              <ul className="nav-item-ul">
                <Link to={"/admin/banner"}><li>Quản lý Banner</li></Link>
              </ul>
            </Collapse>
          </li>

          {/* Đơn đăng ký bán hàng */}
          <li className="menuItem">
            <ListItemButton onClick={handleToggleSalesRegistration}>
              <ListItemIcon sx={{ color: "black" }}>
                <AppRegistrationIcon />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontWeight: "bold" }}
                primary="Đơn đăng ký bán hàng"
              />
              {openSalesRegistration ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={openSalesRegistration} timeout="auto" unmountOnExit>
              <ul className="nav-item-ul">
                <Link to={"/admin/shop-register"}><li>Danh sách đơn đăng ký</li></Link>
              </ul>
            </Collapse>
          </li>

          <li className="menuItem">
            <ListItemButton onClick={handleOpenReport}>
              <ListItemIcon sx={{ color: "black" }}>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontWeight: "bold" }}
                primary="Quản lý báo cáo"
              />
              {openReport ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={openReport} timeout="auto" unmountOnExit>
              <ul className="nav-item-ul">
                <li>
                  <NavLink to={"/admin/customer-report"}>Quản lý báo cáo khách hàng</NavLink>
                </li>
                <li>
                  <NavLink to={"/admin/shop-report"}>Quản lý báo cáo chủ cửa hàng</NavLink>
                </li>
              </ul>
            </Collapse>
          </li>

          <li className="menuItem">
            <Link to={'/admin/change-password'}>
            <ListItemButton>
              <ListItemIcon sx={{ color: "black" }}>
                <LockIcon />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontWeight: "bold" }}
                primary="Đổi mật khẩu"
              />
            </ListItemButton>
            </Link>
          </li>

          {/* Logout */}
          <li className="menuItem">
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon sx={{ color: "black" }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontWeight: "bold" }}
                primary="Đăng xuất"
              />
            </ListItemButton>
          </li>
          
        </ul>
      </div>
    </div>
  );
}

export default NavSide;

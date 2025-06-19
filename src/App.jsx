import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import ClientLayout from "./layout/ClientLayout";
import Home from "./module/client-module/home/Home";
import Product from "./module/client-module/product/Product";
import Cart from "./module/client-module/cart/Cart";
import Login from "./module/client-module/login/Login";
import Register from "./module/client-module/register/Register";
import Detail from "./module/client-module/product-detail/Detail";
import SellerLayout from "./layout/SellerLayout";
import SellerDashboard from "./module/seller-module/dashboard/SellerDashboard";
import "./app.css";
import AdminLayout from "./layout/AdminLayout";
import ShipperLayout from "./layout/ShipperLayout";
import AdminDashboard from "./module/admin-module/dashboard/AdminDashboard";
import Favourite from "./module/client-module/favourite/Favourite";
import ProductManagement from "./module/seller-module/product/ProductManagement";
import AddProduct from "./module/seller-module/product/AddProduct";
import Profile from "./module/client-module/profile/Profile";
import { useEffect, useState } from "react";
import { fetch } from "./api/Fetch";
import { useDispatch, useSelector } from "react-redux";
import {
  IN_LOADING,
  LOGOUT,
  OUT_LOADING,
  SET_LOGIN,
} from "./redux/slice/AuthSlice";
import Loading from "./module/client-module/loading/Loading";
import ProfileHome from "./module/client-module/profile/ProfileHome";
import ProfileAccount from "./module/client-module/profile/ProfileAccount";
import ProfileAddress from "./module/client-module/profile/ProfileAddress";
import "bootstrap/dist/css/bootstrap.min.css";
import ShopRegister from "./module/client-module/shop-register/ShopRegister";
import ShopRegisterAdmin from "./module/admin-module/shop-resgiter/ShopRegisterAdmin";
import dayjs from "dayjs";
import CategoryManagement from "./module/admin-module/category/GetAllCategories";
import ProductByCategory from "./module/client-module/home/ProductByCategory";
import SetUp from "./module/seller-module/setUp/SetUp";
import LoginSeller from "./module/seller-module/login/LoginSeller";

import ShopOwner from "./module/admin-module/user/ShopOwner";
import Customer from "./module/admin-module/user/Customer";
import AdminsManager from "./module/admin-module/user/AdminManager";

import ProductReview from "./module/client-module/profile/ProductReview";
import SellerShop from "./module/seller-module/shop/SellerShop";
import Order from "./module/client-module/order/Order";
import GeneralUpdate from "./module/seller-module/shop/GeneralUpdate";
import AdminLogin from "./module/admin-module/login/AdminLogin";
import Payment from "./module/client-module/payment/Payment";
import ForgotPassword from "./module/client-module/forgotPassword/ForgotPassword";
import CheckCode from "./module/client-module/forgotPassword/CheckCode";
import UpdatePassword from "./module/client-module/forgotPassword/UpdatePassword";

import SellerProfileAccount from "./module/seller-module/profile/SellerProfileAccount";
import SetUpShop from "./module/seller-module/setUpv2/SetUpShop";
import UpdateProduct from "./module/seller-module/updateproduct/UpdateProduct";
import Search from "./module/client-module/search/Search";
import ProductSearch from "./module/client-module/search/ProductSearch";
import ShopSearch from "./module/client-module/search/ShopSearch";
import { MyFeedback } from "./module/client-module/profile/MyFeedback";
import PaymentError from "./module/client-module/payment/PaymentError";
import SellerOrder from "./module/seller-module/order/SellerOrder";
import CreateOrder from "./module/seller-module/createOrder/CreateOrder";
import OrderDetails from "./module/seller-module/viewOrder/ViewOrder";
import ManageShop from "./module/admin-module/shop/ManageShop";
import ShopProduct from "./module/admin-module/shop/ShopProduct";
import ForgotPasswordShop from "./module/seller-module/forgotPassword/ForgotPasswordShop";
import Sendcode from "./module/seller-module/forgotPassword/Sendcode";
import ResetPassword from "./module/seller-module/forgotPassword/ResetPassword";
import { Reportr } from "./module/client-module/profile/Reportr";
import { ShopDetail } from "./module/client-module/shop/ShopDetail";
import ShopDetailAdmin from "./module/admin-module/shop/ShopDetailAdmin";
import Transaction from "./module/seller-module/transaction/Transaction";
import VoucherList from "./module/seller-module/voucher/Voucher";
import AllOrderHistory from "./module/client-module/historyOrder/AllOrderHistory";
import OrderHistoryDetail from "./module/client-module/historyOrder/OrderDetailHisotry";
import OrderHistory from "./module/client-module/historyOrder/OrderHistory";
import OrderHistoryShip from "./module/client-module/historyOrder/OrderHistoryShip";
import OrderHistorySuccess from "./module/client-module/historyOrder/OrderHistorySuccess";
import CustomerReport from "./module/admin-module/report/CustomerReport";
import { ShopOwnerReport } from "./module/seller-module/report/ShopOwnerReport";
import { ShopReport } from "./module/admin-module/report/ShopReport";
import ForgotPasswordAdmin from "./module/admin-module/forgotPassword/ForgotpasswordAdmin";
import SendCode from "./module/admin-module/forgotPassword/SendCode";
import ResetPasswordAdmin from "./module/admin-module/forgotPassword/ResetPasswordAdmin";
import ChangePasswordAdmin from "./module/admin-module/changePassword/ChangePasswordAdmin";
import ProductOrderSuccess from "./module/client-module/profile/ProductOrderSuccess";
import ShopResponse from "./module/seller-module/report/ShopResponse";
import Response from "./module/client-module/response/Response";
import OrderHistoryCancel from "./module/client-module/historyOrder/OrderHisrotyFail";
import Messager from "./module/client-module/message/Messger";
import MessagerShop from "./module/seller-module/message/Messger";
import BannerManager from "./module/admin-module/banner/BannerManager";
import BlogManagement from "./module/seller-module/Blog/BlogManagement";



function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch
      .get("/auth/check-login")
      .then((data) => {
        dispatch(SET_LOGIN({ role: data.data.data.role, email:data.data.data.email }));
      })
      .catch((e) => {
        console.log("log out", e);
        dispatch(LOGOUT());
      })
      .finally(() => {
        setLoading(!loading);
      });
  }, []);

  if (loading) {
    return <Loading></Loading>;
  }

  return (
    <>
      <Routes>
       
        {/* Route for Client Layout */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
         
          <Route path="/product" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/favourite" element={<Favourite />} />
          <Route path="product-detail/:id" element={<Detail />} />
          <Route path="/search" element={<Search></Search>}></Route>
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/send-code" element={<CheckCode />} />
          <Route path="/reset-password" element={<UpdatePassword />} />
          <Route path="/shop/:id" element={<ShopDetail />}></Route>
          <Route path="/chat" element={<Messager></Messager>}></Route>
          <Route
            path="/search-product"
            element={<ProductSearch></ProductSearch>}
          ></Route>
          <Route
            path="/search-shop"
            element={<ShopSearch></ShopSearch>}
          ></Route>
          <Route path="/order" element={<Order></Order>}></Route>
          <Route path="/payment-success" element={<Payment></Payment>}></Route>
          <Route
            path="/payment-err"
            element={<PaymentError></PaymentError>}
          ></Route>
          {/* Route mới cho sản phẩm theo danh mục */}
          <Route
            path="/category/:categoryId/products"
            element={<ProductByCategory />}
          />{" "}
          {/* Route mới */}
          <Route path="profile" element={<Profile />}>
            <Route
              path="history-order-all"
              element={<OrderHistory></OrderHistory>}
            ></Route>
            <Route
              path="history-order-ship"
              element={<OrderHistoryShip></OrderHistoryShip>}
            ></Route>
             <Route
              path="history-order-success"
              element={<OrderHistorySuccess></OrderHistorySuccess>}
            ></Route>
            <Route path="history-order-cancel" element={<OrderHistoryCancel></OrderHistoryCancel>}></Route>
            <Route path="product-feedback" element={<ProductOrderSuccess></ProductOrderSuccess>}></Route>
            <Route index element={<ProfileHome />} />
            <Route path="account" element={<ProfileAccount />} />
            <Route path="address" element={<ProfileAddress />} />
            <Route path="shop-register" element={<ShopRegister />} />
            <Route path="feedback/:id" element={<ProductReview />} />
            <Route path="response" element={<Response></Response>}></Route>
            <Route path="my-feedback" element={<MyFeedback />} />
            <Route path="report" element={<Reportr />}></Route>
            <Route path="order-detail/:id" element={<OrderHistoryDetail></OrderHistoryDetail>}></Route>
          </Route>
        </Route>
        <Route path="shop/set-up" element={<SetUp></SetUp>}></Route>
        <Route path="shop/login" element={<LoginSeller></LoginSeller>}></Route>
        
        <Route
          path="admin-gate/login"
          element={<AdminLogin></AdminLogin>}
        ></Route>
       
        <Route path="/admin-gate/forgot-password" element={< ForgotPasswordAdmin /> } />
        <Route path="/admin-gate/send-code" element={< SendCode /> } />
        <Route path="/admin-gate/reset-password" element={< ResetPasswordAdmin /> } />
        <Route path="/shop/forgot-password" element={<ForgotPasswordShop />} />
        <Route path="/shop/send-code" element={<Sendcode />} />
        <Route path="/shop/reset-password" element={<ResetPassword />} />
        <Route path="set-up" element={<SetUpShop />}></Route>

        <Route
          path="create-order"
          element={<CreateOrder></CreateOrder>}
        ></Route>
        {/* Route for Seller Layout */}
        <Route path="/seller" element={<SellerLayout />}>
          <Route index element={<SellerDashboard />} />
          <Route path="order" element={<SellerOrder></SellerOrder>}></Route>
          <Route path="product" element={<ProductManagement />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="transaction" element={<Transaction/>}></Route>
          <Route path="voucher" element={<VoucherList/>} />
          <Route path="transaction" element={<Transaction />}></Route>
          <Route path="response" element={<ShopResponse></ShopResponse>}></Route>
          <Route path="chat" element={<MessagerShop></MessagerShop>}></Route>
          <Route path="blog" element={<BlogManagement></BlogManagement>}></Route>
          <Route
            path="view-order/:id"
            element={<OrderDetails></OrderDetails>}
          ></Route>
          <Route
            path="update-product/:id"
            element={<UpdateProduct></UpdateProduct>}
          ></Route>
          <Route path="shop" element={<SellerShop></SellerShop>}></Route>
          <Route
            path="update-shop"
            element={<GeneralUpdate></GeneralUpdate>}
          ></Route>
          <Route path="profile" element={<SellerProfileAccount />}></Route>
          <Route path="shop-report" element={<ShopOwnerReport/>}></Route>
        </Route>
        {/* Route for Admin Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="shopOwner" element={<ShopOwner />} />
          <Route path="customer" element={<Customer />} />
          <Route path="admins" element={<AdminsManager />} />
          <Route path="shop-register" element={<ShopRegisterAdmin />} />
          <Route path="category/all" element={<CategoryManagement />} />
          <Route path="banner" element={<BannerManager />} />
          <Route path="change-password" element={< ChangePasswordAdmin /> } />
          <Route path="shop" element={<ManageShop></ManageShop>}></Route>

          <Route
            path="shop-detail/:id"
            element={<ShopDetailAdmin></ShopDetailAdmin>}
          ></Route>
          <Route path="customer-report" element={<CustomerReport/>}/>
          <Route path="shop-report" element={<ShopReport/>} />
        </Route>

        {/* route shipper */}
        <Route path="/shipper" element={<ShipperLayout />}>
          {/* <Route index element={<AdminDashboard />} />
          <Route path="shopOwner" element={<ShopOwner />} /> */}
        </Route>
      </Routes>
    </>
  );
}
export default App;

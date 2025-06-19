import React, { useState } from "react";
import "./order.scss";
import { Box, Button, Stack, Typography } from "@mui/material";
import VoucherModal from "./VoucherModal";

const OrderDetail = ({ orderData, onUpdateOrderData }) => {
  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [selectedVouchers, setSelectedVouchers] = useState({});

  const handleOpenVoucherModal = (shopId) => {
    setSelectedShopId(shopId);
    setShowVoucherModal(true);
  };

  const handleVoucherSelect = (shopId, voucher) => {
    setSelectedVouchers((prev) => ({
      ...prev,
      [shopId]: voucher,
    }));

    const updatedOrderData = orderData.map((item) => {
      if (item.shop.id === shopId) {
        const originalTotal = item.orderList.reduce(
          (total, order) =>
            total +
            order.product.price * order.quantity +
            (order.productAddOns || []).reduce((sum, addon) => sum + addon.price, 0) * order.quantity,
          0
        );
        return {
          ...item,
          discountAmount: voucher.discountAmount,
          totalCost: originalTotal - voucher.discountAmount,
        };
      }
      return item;
    });

    if (onUpdateOrderData) {
      onUpdateOrderData(updatedOrderData);
    }

    setShowVoucherModal(false);
  };

  return (
    <div id="order-detail" style={{ width: "100%" }}>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "white",
          padding: "20px",
          marginBottom: "20px",
          border: "1px solid #e7e7e7",
        }}
      >
        <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
          <Typography className="title" variant="body1" color="initial">
            Bạn đang có {orderData.length} đơn hàng
          </Typography>
          <Stack
            direction={"row"}
            width={"40%"}
            sx={{ justifyContent: "space-between" }}
          >
            <Typography className="item-general" variant="body1" color="initial">
              Đơn giá
            </Typography>
            <Typography className="item-general" variant="body1" color="initial">
              Số lượng
            </Typography>
            <Typography className="item-general" variant="body1" color="initial">
              Tổng giá
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {orderData.map((item) => {
        const subTotalPrice = item.orderList.reduce((total, order) => {
          return (
            total +
            order.product.price * order.quantity +
            (order.productAddOns || []).reduce((sum, addon) => sum + addon.price, 0) * order.quantity
          );
        }, 0);

        return (
          <Box
            key={item.shop.id}
            sx={{
              width: "100%",
              backgroundColor: "white",
              padding: "20px",
              border: "1px solid #e7e7e7",
              marginBottom: "20px",
            }}
          >
            <Box sx={{ borderBottom: "1px solid #ccc", paddingBottom: "15px" }}>
              <Stack direction={"row"} spacing={1} sx={{ alignItems: "start" }}>
                <img
                  width={35}
                  height={35}
                  className="mt-1"
                  src={item.shop.logo}
                  style={{ borderRadius: "10px" }}
                  alt=""
                />
                <Stack>
                  <h6 className="shop-name">Cửa hàng {item.shop.name}</h6>
                  <p className="shop-address mb-0">
                    Đơn hàng có {item.orderList.length} sản phẩm từ {item.shop.name}
                  </p>
                </Stack>
              </Stack>
            </Box>

            <Box sx={{ marginTop: "20px", marginBottom: "10px" }}>
              {item.orderList.map((itemList) => (
                <Stack
                  key={itemList.product.id}
                  direction={"row"}
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <Stack
                    direction={"row"}
                    spacing={2}
                    sx={{ alignItems: "start", width: "50%" }}
                  >
                    <img
                      width={90}
                      src={itemList.product.avatar}
                      alt=""
                      style={{ borderRadius: "10px" }}
                    />
                    <Stack>
                      <Typography className="product-name" variant="body1" color="initial">
                        {itemList.product.name}
                      </Typography>
                      <Stack direction={"row"} spacing={1} className="mt-2">
                        <Typography className="option option-general" variant="body1" color="initial">
                          Option:
                        </Typography>
                        <Typography className="option-item option-general-item" variant="body1" color="initial">
                          {itemList.productOption.name}
                        </Typography>
                      </Stack>
                      <Stack direction={"row"} spacing={1} className="mt-2">
                        {itemList.productAddOns.length !== 0 && (
                          <>
                            <Typography className="addon option-general">
                              Lựa chọn:{" "}
                            </Typography>
                            <Typography className="addon-item option-general-item" variant="body1" color="initial">
                              {itemList.productAddOns.map((addon) => addon.name).join(", ")}
                            </Typography>
                          </>
                        )}
                      </Stack>
                    </Stack>
                  </Stack>

                  <Stack direction={"row"} sx={{ justifyContent: "space-between", width: "40%" }}>
                    <Stack>
                      <Typography className="item-general">
                        {itemList.productAddOns.length !== 0
                          ? formatCurrency(
                              itemList.product.price +
                                itemList.productAddOns.reduce((total, addon) => total + addon.price, 0)
                            )
                          : formatCurrency(itemList.product.price)}
                      </Typography>
                    </Stack>
                    <Stack>
                      <Typography className="item-general" variant="body1" color="initial">
                        x {itemList.quantity}
                      </Typography>
                    </Stack>
                    <Stack>
                      <Typography className="item-general" sx={{ fontWeight: "bold" }}>
                        {itemList.productAddOns.length !== 0
                          ? formatCurrency(
                              (itemList.product.price +
                                itemList.productAddOns.reduce((total, addon) => total + addon.price, 0)) *
                                itemList.quantity
                            )
                          : formatCurrency(itemList.product.price * itemList.quantity)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              ))}

              <Stack
                direction={"row"}
                spacing={15}
                sx={{
                  justifyContent: "end",
                  alignItems: "center",
                  padding: "10px 20px",
                  borderBottom: "1px dashed #ccc",
                }}
              >
                <Stack direction={"row"} spacing={1} sx={{ alignItems: "center" }}>
                  <svg
                    className="chus_mr-1"
                    width="24"
                    height="16"
                    viewBox="0 0 24 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_1185_122641)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M21.7809 0L7.62435 0.0208696H6.90087L1.45391 0.0278261C0.646957 0.0278261 0 0.681739 0 1.48174V2.93565V4.38957V5.84348C1.20348 5.84348 2.18435 6.81739 2.18435 8.02087C2.18435 9.22435 1.21043 10.1983 0.00695652 10.2052V11.6591V13.113V14.567C0.00695652 15.367 0.66087 16.0209 1.46087 16.0139H6.90783L7.6313 16.007L21.7878 15.9861C22.5878 15.9861 23.2417 15.3322 23.2348 14.5322V13.8087V11.6313V10.1774C22.0313 10.1774 21.0504 9.20348 21.0504 8C21.0504 6.79652 22.0243 5.82261 23.2278 5.81565V4.36174V3.63826V1.44696C23.2348 0.646957 22.5809 0 21.7809 0ZM21.7878 4.66087C20.5078 5.22435 19.6104 6.49739 19.6174 7.98609C19.6174 9.47478 20.5217 10.7478 21.8017 11.3043V13.7878C21.8017 14.1913 21.4748 14.5322 21.0713 14.5322H8.00696V13.44C8.00696 13.2383 7.84 13.0783 7.64522 13.0783H6.92174C6.72 13.0783 6.56 13.2452 6.56 13.44V14.5322H2.20522C1.80174 14.5322 1.48174 14.2052 1.48174 13.8087V11.3252C2.75478 10.7617 3.65217 9.4887 3.65217 8C3.65217 6.5113 2.74783 5.23826 1.46783 4.68174V2.20522C1.46783 1.80174 1.78783 1.48174 2.1913 1.47478H6.54609V2.56C6.54609 2.76174 6.71304 2.92174 6.91478 2.92174H7.63826C7.84 2.92174 8 2.75478 8 2.56V1.47478H21.0643C21.4678 1.47478 21.7878 1.77391 21.7948 2.17739V4.66087H21.7878ZM7.63141 4.37568H6.90794C6.7062 4.37568 6.5462 4.54264 6.5462 4.73742V6.91481C6.5462 7.11655 6.71315 7.27655 6.91489 7.27655H7.63837C7.84011 7.27655 8.00011 7.10959 8.00011 6.91481V4.73742C8.00011 4.53568 7.83315 4.37568 7.63141 4.37568ZM6.90794 8.73047H7.63141H7.63837C7.84011 8.73047 8.00707 8.89047 8.00707 9.09221V11.2696C8.00707 11.4644 7.84707 11.6313 7.64533 11.6313H6.91489C6.71315 11.6313 6.5462 11.4713 6.5462 11.2696V9.09221C6.5462 8.89742 6.7062 8.73047 6.90794 8.73047Z"
                        fill="#FFCF20"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1185_122641">
                        <rect width="23.2487" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <p className="sub-item">Voucher của shop</p>
                </Stack>

                <Button onClick={() => handleOpenVoucherModal(item.shop.id)}>
                  Chọn Voucher
                </Button>
              </Stack>

              {selectedVouchers[item.shop.id] && (
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: "flex-end",
                    padding: "10px 20px",
                    color: "#00a76f",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ marginRight: 1 }}>
                    Voucher đã chọn:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {selectedVouchers[item.shop.id].code} - Giảm{" "}
                    {formatCurrency(selectedVouchers[item.shop.id].discountAmount)}
                  </Typography>
                </Stack>
              )}

              <Stack
                className="mt-3"
                direction={"column"}
                sx={{ justifyContent: "end", alignItems: "end" }}
              >
                <Typography className="sub-item mt-3" variant="body1" color="initial">
                  Phí vận chuyển:{" "}
                  {item.shipCost === 0 ? (
                    <span className="ship-total">Chưa xác định</span>
                  ) : (
                    <span className="ship-total">{formatCurrency(item.shipCost)}</span>
                  )}
                </Typography>
                {item.shipCost === 0 && (
                  <Typography sx={{ fontSize: "12px", color: "gray" }} variant="body1" color="initial">
                    (Cửa hàng sẽ liên hệ báo giá sau khi bạn đặt hàng thành công)
                  </Typography>
                )}
                {item.shipCost === 2 && (
                  <Typography sx={{ fontSize: "12px", color: "gray" }} variant="body1" color="initial">
                    (Đây chỉ là giá ước tính, có thể đơn hàng sẽ liên hệ để báo giá chính xác)
                  </Typography>
                )}
                <Typography className="sub-item mt-3" variant="body1" color="initial">
                  Tổng giá: <span className="total-price">{formatCurrency(item.totalCost + item.shipCost)}</span>
                </Typography>
              </Stack>
            </Box>
          </Box>
        );
      })}

      <VoucherModal
        shopId={selectedShopId}
        open={showVoucherModal}
        onClose={() => setShowVoucherModal(false)}
        orderAmount={orderData.find((item) => item.shop.id === selectedShopId)?.orderList.reduce(
          (total, order) =>
            total +
            order.product.price * order.quantity +
            (order.productAddOns || []).reduce((sum, addon) => sum + addon.price, 0) * order.quantity,
          0
        ) || 0} // Truyền subTotalPrice của shop
        onSelectVoucher={handleVoucherSelect}
      />
    </div>
  );
};

export default OrderDetail;
import React from "react";
import "./ReturnOrderHeader.scss";

const ReturnOrderHeader = () => {
  const currentDate = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="return-order-header">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span>Trang chủ</span> &gt; <span>Đơn hàng</span> &gt; <strong>Quản lý đơn hoàn trả</strong>
      </div>

      {/* Header content */}
      <div className="header-content">
        <div className="title-section">
          <h1>📦 Quản lý đơn hoàn trả</h1>
          <p>
            Trang này cho phép bạn theo dõi và xử lý các yêu cầu hoàn trả sản phẩm từ khách hàng.
            Bao gồm thông tin chi tiết về đơn hàng, lý do yêu cầu hoàn trả, tình trạng xử lý hiện tại và phản hồi từ bộ phận hỗ trợ khách hàng.
          </p>
          <ul className="features-list">
            <li>📝 Xem chi tiết đơn hàng và lý do hoàn trả</li>
            <li>🔄 Cập nhật trạng thái xử lý: Đang chờ, Đã duyệt, Từ chối</li>
            <li>💬 Gửi phản hồi hoặc ghi chú từ quản trị viên</li>
            <li>📊 Theo dõi lịch sử hoàn trả và thống kê</li>
          </ul>
        </div>

        {/* Date */}
        <div className="date-info">
          <span>📅 Hôm nay: {currentDate}</span>
        </div>
      </div>
    </div>
  );
};

export default ReturnOrderHeader;
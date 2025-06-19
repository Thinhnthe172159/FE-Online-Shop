import './ClientFooter.css';
import React from 'react';
import { Col, Row, Container, Form } from 'react-bootstrap';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const ClientFooter = () => {
  return (
    <Container>
      <footer>
        <Row className="border-bottom pt-5">
          <Col sm={6} md={3} className="mb-4">
            <h5>Customer Service</h5>
            <ul className="list-unstyled">
              <li><p onClick={() => window.location.href = '/help'}>Trung tâm trợ giúp</p></li>
              <li><p onClick={() => window.location.href = '/blog'}>Bài viết Của 6MEMs</p></li>
              <li><p onClick={() => window.location.href = '/return-refund'}>Trả lại & Hoàn tiền</p></li>
              <li><p onClick={() => window.location.href = '/contact'}>Liên hệ với chúng tôi</p></li>
            </ul>
          </Col>

          <Col sm={6} md={3} className="mb-4">
            <h5>About 6MEMs</h5>
            <ul className="list-unstyled">
              <li><p onClick={() => window.location.href = '/our-story'}>Về chúng tôi</p></li>
              <li><p onClick={() => window.location.href = '/chus-policies'}>Chính sách 6MEMs</p></li>
              <li><p onClick={() => window.location.href = '/privacy-policy'}>Chính sách bảo mật</p></li>
              <li><p onClick={() => window.location.href = '/payment-policy'}>Chính sách thanh toán</p></li>
              <li><p onClick={() => window.location.href = '/refund-return'}>Hoàn Tiền và Trả lại</p></li>
              <li><p onClick={() => window.location.href = '/become-chus-artisan'}>Trở thành thành viên bán hàng cùng 6MEMs</p></li>
            </ul>
          </Col>

          <Col sm={6} md={3} className="mb-4">
            <h5>Payment Methods</h5>
            <div className="payment-method-icons">
              <img src="https://chus.vn/design/themes/chus/media/images/payment/visa-3x.png" alt="Visa" className="payment-icon" />
              <img src="https://chus.vn/design/themes/chus/media/images/payment/mastercard-3x.png" alt="Mastercard" className="payment-icon" />
              <img src="https://chus.vn/design/themes/chus/media/images/payment/cod-3x.png" alt="COD" className="payment-icon" />
              <img src="https://chus.vn/design/themes/chus/media/images/payment/vnpay-3x.png" alt="VNPay" className="payment-icon" />
            </div>

            <h5 className="mt-4">Hình thức vận chuyển</h5>
            <img className="shipping-icon" src="https://th.bing.com/th?id=OIP.cVzZe2hgkt1MBOzyemobegHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2" alt="Shipping icon" />
          </Col>

          <Col sm={6} md={3} className="mb-4">
            <h5>Liên lạc với chúng tôi</h5>
            <img src="https://th.bing.com/th?id=OIP.SO6nDj9UT1t6GxgnYEP94AHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2" alt="Zalo" className="social-icon" />
            
            <h5 className="mt-4">Đăng ký nhận tin</h5>
            <Form>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Email</Form.Label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Form.Control type="email" placeholder="Your email" style={{ borderRadius: '50px' }} />
                  <button type="submit" className="btn-subscribe">
                    <ArrowRightIcon />
                  </button>
                </div>
              </Form.Group>
            </Form>
          </Col>
        </Row>

        <Row className="text-center mt-4">
          <Col>
            <p>© 2024 6MEMs. All rights reserved.</p>
            <img width={100} src="https://chus.vn/images/chus/logo/logo-bct.png" alt="logo-bct" className="logo-bct" />
            <p>Address: FPT University, Hoa Lac, Ha Noi</p>
          </Col>
        </Row>
      </footer>
    </Container>
  );
}

export default ClientFooter;

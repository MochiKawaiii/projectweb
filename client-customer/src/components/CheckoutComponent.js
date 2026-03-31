import axios from 'axios';
import React, { Component } from 'react';
import { Link, Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';
import withRouter from '../utils/withRouter';

class Checkout extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      fullName: '',
      phone: '',
      email: '',
      country: 'Vietnam',
      addressLine: '',
      region: '',
      note: '',
      invoiceRequested: false,
      prefilled: false,
      submitting: false,
    };
  }

  componentDidMount() {
    this.prefillCustomerInfo();
  }

  componentDidUpdate() {
    if (!this.state.prefilled && this.context.customer) {
      this.prefillCustomerInfo();
    }
  }

  prefillCustomerInfo() {
    const customer = this.context.customer;
    if (!customer) return;
    this.setState({
      fullName: customer.name || '',
      phone: customer.phone || '',
      email: customer.email || '',
      prefilled: true,
    });
  }

  updateQuantity(id, delta) {
    const mycart = [...this.context.mycart];
    const index = mycart.findIndex((x) => x.product._id === id);
    if (index !== -1) {
      mycart[index].quantity += delta;
      if (mycart[index].quantity <= 0) {
        mycart.splice(index, 1);
      }
      this.context.setMycart(mycart);
    }
  }

  removeItem(id) {
    const mycart = [...this.context.mycart];
    const index = mycart.findIndex((x) => x.product._id === id);
    if (index !== -1) {
      mycart.splice(index, 1);
      this.context.setMycart(mycart);
    }
  }

  btnPlaceOrderClick = async (e) => {
    e.preventDefault();
    const { fullName, phone, email, country, addressLine, region, note, invoiceRequested } = this.state;
    const shipping = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      country: country.trim() || 'Vietnam',
      addressLine: addressLine.trim(),
      region: region.trim(),
      shippingMethod: 'Giao hàng tận nơi',
    };

    if (!shipping.fullName || !shipping.phone || !shipping.email || !shipping.addressLine || !shipping.region) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng.');
      return;
    }

    if (this.context.mycart.length === 0) {
      alert('Giỏ hàng của bạn đang trống.');
      return;
    }

    try {
      this.setState({ submitting: true });
      const body = {
        total: CartUtil.getTotal(this.context.mycart),
        items: this.context.mycart,
        customer: this.context.customer,
        shipping,
        payment: { method: 'COD', label: 'Thanh toán khi giao hàng (COD)' },
        note: note.trim(),
        invoiceRequested,
      };
      const config = { headers: { 'x-access-token': this.context.token } };
      const res = await axios.post('/api/customer/checkout', body, config);
      if (res.data?.success === false) {
        alert(res.data.message || 'Đặt hàng thất bại.');
        return;
      }
      alert('Đặt hàng thành công!');
      this.context.setMycart([]);
      this.props.navigate('/myorders');
    } catch (error) {
      const message = error.response?.data?.message || 'Đặt hàng thất bại.';
      alert(message);
    } finally {
      this.setState({ submitting: false });
    }
  };

  renderCartItem(item) {
    return (
      <div key={item.product._id} className="checkout-summary-item">
        <img src={item.product.image} alt={item.product.name} className="checkout-summary-image" />
        <div className="checkout-summary-copy">
          <div className="checkout-summary-name">{item.product.name}</div>
          <div className="checkout-summary-price">{item.product.price?.toLocaleString('vi-VN')}₫</div>
          <div className="checkout-summary-qty">
            <button type="button" onClick={() => this.updateQuantity(item.product._id, -1)}>-</button>
            <span>{item.quantity}</span>
            <button type="button" onClick={() => this.updateQuantity(item.product._id, 1)}>+</button>
            <button type="button" className="checkout-summary-remove" onClick={() => this.removeItem(item.product._id)}>
              Xóa
            </button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.context.token === '' || !this.context.customer) {
      return <Navigate replace to="/login" />;
    }

    if (this.context.mycart.length === 0) {
      return (
        <div className="checkout-empty">
          <h1>Thanh toán</h1>
          <p>Chưa có sản phẩm nào để thanh toán.</p>
          <Link to="/product/category/all" className="checkout-primary-btn">
            Tiếp tục mua sắm
          </Link>
        </div>
      );
    }

    const total = CartUtil.getTotal(this.context.mycart);

    return (
      <div className="checkout-page">
        <div className="checkout-layout">
          <div className="checkout-main">
            <div className="checkout-card checkout-login-card">
              <div>
                <strong>{this.context.customer?.email}</strong>
                <p>Đăng nhập để đặt hàng nhanh hơn và theo dõi đơn mua dễ dàng.</p>
              </div>
              <Link to="/myprofile" className="checkout-inline-btn">
                Tài khoản
              </Link>
            </div>

            <div className="checkout-card">
              <h2>Thông tin giao hàng</h2>
              <div className="checkout-form-grid">
                <input
                  type="text"
                  placeholder="Nhập họ và tên"
                  value={this.state.fullName}
                  onChange={(e) => this.setState({ fullName: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Nhập số điện thoại"
                  value={this.state.phone}
                  onChange={(e) => this.setState({ phone: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Nhập email"
                  value={this.state.email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Quốc gia"
                  value={this.state.country}
                  onChange={(e) => this.setState({ country: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Địa chỉ, tên đường"
                  value={this.state.addressLine}
                  onChange={(e) => this.setState({ addressLine: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Tỉnh/TP, Quận/Huyện, Phường/Xã"
                  value={this.state.region}
                  onChange={(e) => this.setState({ region: e.target.value })}
                />
              </div>
            </div>

            <div className="checkout-card">
              <h2>Phương thức giao hàng</h2>
              <div className="checkout-static-field">Giao hàng tận nơi. Phí ship sẽ được xác nhận khi xử lý đơn.</div>
            </div>

            <div className="checkout-card">
              <h2>Phương thức thanh toán</h2>
              <label className="checkout-payment-option">
                <input type="radio" checked readOnly />
                <span>Thanh toán khi giao hàng (COD)</span>
              </label>
            </div>

            <div className="checkout-card checkout-inline-card">
              <div>
                <h2>Hóa đơn điện tử</h2>
                <p>Bật nếu bạn muốn admin hỗ trợ xuất hóa đơn cho đơn hàng này.</p>
              </div>
              <label className="checkout-switch">
                <input
                  type="checkbox"
                  checked={this.state.invoiceRequested}
                  onChange={(e) => this.setState({ invoiceRequested: e.target.checked })}
                />
                <span>{this.state.invoiceRequested ? 'Yêu cầu xuất' : 'Không yêu cầu'}</span>
              </label>
            </div>

            <div className="checkout-card">
              <h2>Ghi chú đơn hàng</h2>
              <textarea
                rows="4"
                placeholder="Ghi chú cho admin hoặc shipper..."
                value={this.state.note}
                onChange={(e) => this.setState({ note: e.target.value })}
              />
            </div>
          </div>

          <div className="checkout-sidebar">
            <div className="checkout-card">
              <h2>Giỏ hàng</h2>
              <div className="checkout-summary-list">
                {this.context.mycart.map((item) => this.renderCartItem(item))}
              </div>
            </div>

            <div className="checkout-card">
              <h2>Tóm tắt đơn hàng</h2>
              <div className="checkout-total-row">
                <span>Tổng tiền hàng</span>
                <strong>{total.toLocaleString('vi-VN')}₫</strong>
              </div>
              <div className="checkout-total-row">
                <span>Phương thức thanh toán</span>
                <span>COD</span>
              </div>
              <div className="checkout-total-row checkout-total-row--grand">
                <span>Tổng thanh toán</span>
                <strong>{total.toLocaleString('vi-VN')}₫</strong>
              </div>
              <button className="checkout-primary-btn" onClick={this.btnPlaceOrderClick} disabled={this.state.submitting}>
                {this.state.submitting ? 'Đang đặt hàng...' : 'Đặt hàng'}
              </button>
              <Link to="/mycart" className="checkout-back-link">
                Quay lại giỏ hàng
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Checkout);

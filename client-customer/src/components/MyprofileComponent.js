import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import OrderHistorySection from './OrderHistorySection';

class Myprofile extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
      txtName: '',
      txtPhone: '',
      txtEmail: '',
      orders: [],
      order: null,
      hydratedCustomerId: '',
      loadingOrders: false,
    };
  }

  componentDidMount() {
    this.hydrateCustomerData();
  }

  componentDidUpdate() {
    this.hydrateCustomerData();
  }

  hydrateCustomerData() {
    const customer = this.context.customer;
    if (!customer || this.state.hydratedCustomerId === customer._id) return;

    this.setState(
      {
        txtUsername: customer.username || '',
        txtPassword: customer.password || '',
        txtName: customer.name || '',
        txtPhone: customer.phone || '',
        txtEmail: customer.email || '',
        hydratedCustomerId: customer._id,
      },
      () => this.loadOrders(customer._id)
    );
  }

  loadOrders(customerId) {
    const config = { headers: { 'x-access-token': this.context.token } };
    this.setState({ loadingOrders: true });
    axios
      .get('/api/customer/orders/customer/' + customerId, config)
      .then((res) => {
        const orders = Array.isArray(res.data)
          ? [...res.data].sort((a, b) => Number(b.cdate || 0) - Number(a.cdate || 0))
          : [];
        this.setState({
          orders,
          order: orders[0] || null,
          loadingOrders: false,
        });
      })
      .catch(() => this.setState({ orders: [], order: null, loadingOrders: false }));
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const { txtUsername, txtPassword, txtName, txtPhone, txtEmail } = this.state;
    if (txtUsername && txtPassword && txtName && txtPhone && txtEmail) {
      const config = { headers: { 'x-access-token': this.context.token } };
      axios
        .put(
          '/api/customer/customers/' + this.context.customer._id,
          { username: txtUsername, password: txtPassword, name: txtName, phone: txtPhone, email: txtEmail },
          config
        )
        .then((res) => {
          if (res.data) {
            alert('Cập nhật thành công!');
            this.context.setCustomer(res.data);
            this.setState({
              txtUsername: res.data.username || '',
              txtPassword: res.data.password || '',
              txtName: res.data.name || '',
              txtPhone: res.data.phone || '',
              txtEmail: res.data.email || '',
            });
          } else {
            alert('Cập nhật thất bại!');
          }
        });
    }
  }

  render() {
    if (this.context.token === '') return <Navigate replace to="/login" />;

    return (
      <div className="auth-page account-page">
        <h1>Hồ sơ của tôi</h1>

        <div className="account-profile-card">
          <form className="auth-form">
            <div className="form-group">
              <label>Username</label>
              <input type="text" value={this.state.txtUsername} onChange={(e) => this.setState({ txtUsername: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Mật khẩu</label>
              <input type="password" value={this.state.txtPassword} onChange={(e) => this.setState({ txtPassword: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Tên</label>
              <input type="text" value={this.state.txtName} onChange={(e) => this.setState({ txtName: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input type="tel" value={this.state.txtPhone} onChange={(e) => this.setState({ txtPhone: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={this.state.txtEmail} onChange={(e) => this.setState({ txtEmail: e.target.value })} />
            </div>
            <button type="submit" className="form-submit" onClick={(e) => this.btnUpdateClick(e)}>
              Cập nhật
            </button>
          </form>
        </div>

        <div className="account-page-divider" />

        <OrderHistorySection
          orders={this.state.orders}
          selectedOrder={this.state.order}
          onSelectOrder={(order) => this.setState({ order })}
          showStandaloneLink={true}
          isLoading={this.state.loadingOrders}
          subtitle={
            this.state.loadingOrders
              ? 'Đang tải danh sách đơn hàng của bạn...'
              : 'Bạn có thể xem nhanh đơn hàng gần đây ngay trong trang hồ sơ.'
          }
        />
      </div>
    );
  }
}

export default Myprofile;

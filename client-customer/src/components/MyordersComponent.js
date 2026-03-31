import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import OrderHistorySection from './OrderHistorySection';

class Myorders extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null,
      hydratedCustomerId: '',
      loadingOrders: false,
    };
  }

  componentDidMount() {
    this.hydrateCustomerOrders();
  }

  componentDidUpdate() {
    this.hydrateCustomerOrders();
  }

  hydrateCustomerOrders() {
    const customerId = this.context.customer?._id || '';
    if (!customerId || this.state.hydratedCustomerId === customerId) return;
    this.setState({ hydratedCustomerId: customerId }, () => this.loadOrders(customerId));
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

  render() {
    if (this.context.token === '') return <Navigate replace to="/login" />;

    return (
      <div className="account-page orders-page">
        <h1>Đơn hàng của tôi</h1>
        <OrderHistorySection
          orders={this.state.orders}
          selectedOrder={this.state.order}
          onSelectOrder={(order) => this.setState({ order })}
          isLoading={this.state.loadingOrders}
          subtitle={
            this.state.loadingOrders
              ? 'Đang tải danh sách đơn hàng của bạn...'
              : 'Chọn một đơn hàng để xem chi tiết sản phẩm và thông tin giao nhận.'
          }
        />
      </div>
    );
  }
}

export default Myorders;

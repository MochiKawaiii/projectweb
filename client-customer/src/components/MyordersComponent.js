import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import OrderHistorySection from './OrderHistorySection';

const ORDER_HISTORY_RETRY_MESSAGE =
  'Chưa tải được lịch sử đơn hàng. Máy chủ có thể đang khởi động lại, bạn thử lại sau vài giây nhé.';

class Myorders extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null,
      hydratedCustomerId: '',
      loadingOrders: false,
      loadError: '',
      cancelingOrderId: '',
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

  loadOrders = (customerId = this.context.customer?._id || '') => {
    if (!customerId) return;
    const config = { headers: { 'x-access-token': this.context.token } };
    this.setState({ loadingOrders: true, loadError: '' });
    axios
      .get(`/api/customer/orders/customer/${customerId}`, config)
      .then((res) => {
        const orders = Array.isArray(res.data)
          ? [...res.data].sort((a, b) => Number(b.cdate || 0) - Number(a.cdate || 0))
          : [];
        this.setState({
          orders,
          order: orders[0] || null,
          loadingOrders: false,
          loadError: '',
        });
      })
      .catch(() =>
        this.setState({
          orders: [],
          order: null,
          loadingOrders: false,
          loadError: ORDER_HISTORY_RETRY_MESSAGE,
        })
      );
  };

  syncUpdatedOrder = (updatedOrder) => {
    this.setState((prevState) => {
      const nextOrders = prevState.orders.map((item) => (item._id === updatedOrder._id ? updatedOrder : item));
      return {
        orders: nextOrders,
        order: prevState.order?._id === updatedOrder._id ? updatedOrder : prevState.order,
      };
    });
  };

  handleCancelOrder = (order) => {
    if (!order?._id || order.status !== 'PENDING') return;
    if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này không?')) return;

    const config = { headers: { 'x-access-token': this.context.token } };
    this.setState({ cancelingOrderId: order._id });
    axios
      .put(`/api/customer/orders/cancel/${order._id}`, {}, config)
      .then((res) => {
        if (res.data?.success && res.data.order) {
          this.syncUpdatedOrder(res.data.order);
          alert('Đơn hàng đã được hủy.');
        } else {
          alert(res.data?.message || 'Không thể hủy đơn hàng này.');
        }
      })
      .catch((error) => {
        alert(error.response?.data?.message || 'Không thể hủy đơn hàng này lúc này.');
      })
      .finally(() => {
        this.setState({ cancelingOrderId: '' });
      });
  };

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
          loadError={this.state.loadError}
          onRetry={() => this.loadOrders()}
          onCancelOrder={this.handleCancelOrder}
          cancelingOrderId={this.state.cancelingOrderId}
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

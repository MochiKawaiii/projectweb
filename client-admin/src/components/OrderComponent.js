import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

const ORDER_LOAD_ERROR =
  'Khong tai duoc danh sach don hang. May chu co the dang khoi dong lai, ban thu lai sau vai giay nhe.';

const ORDER_FLOW = ['PENDING', 'APPROVED', 'SHIPPING', 'DELIVERED'];

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('vi-VN')}d`;

class Order extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null,
      isLoading: true,
      loadError: '',
      updatingOrderId: '',
    };
  }

  componentDidMount() {
    this.apiGetOrders();
  }

  getOrderActions(order) {
    if (!order) return [];

    switch (order.status) {
      case 'PENDING':
        return [
          { label: 'APPROVE', nextStatus: 'APPROVED' },
          { label: 'CANCEL', nextStatus: 'CANCELED', tone: 'is-danger' },
        ];
      case 'APPROVED':
        return [
          { label: 'SHIP', nextStatus: 'SHIPPING' },
          { label: 'CANCEL', nextStatus: 'CANCELED', tone: 'is-danger' },
        ];
      case 'SHIPPING':
        return [{ label: 'DELIVER', nextStatus: 'DELIVERED' }];
      default:
        return [];
    }
  }

  getStatusTone(status) {
    return `is-${String(status || 'pending').toLowerCase()}`;
  }

  getDisplayCustomer(order) {
    return order.shipping?.fullName || order.customer?.name || order.customer?.email || '';
  }

  getDisplayPhone(order) {
    return order.shipping?.phone || order.customer?.phone || '';
  }

  trItemClick(order) {
    this.setState({ order });
  }

  apiPutOrderStatus = (order, status) => {
    const body = { status };
    const config = { headers: { 'x-access-token': this.context.token } };
    this.setState({ updatingOrderId: order._id });
    axios
      .put(`/api/admin/orders/status/${order._id}`, body, config)
      .then((res) => {
        const updatedOrder = res.data?.order || (res.data?._id ? res.data : null);
        if (res.data?.success || updatedOrder) {
          this.apiGetOrders(updatedOrder?._id || order._id);
        } else {
          alert(res.data?.message || 'Không cập nhật được trạng thái đơn hàng.');
        }
      })
      .catch((error) => {
        alert(error.response?.data?.message || 'Không cập nhật được trạng thái đơn hàng.');
      })
      .finally(() => {
        this.setState({ updatingOrderId: '' });
      });
  };

  apiGetOrders = (preferredOrderId = this.state.order?._id || '') => {
    const config = { headers: { 'x-access-token': this.context.token } };
    this.setState({ isLoading: true, loadError: '' });
    axios
      .get('/api/admin/orders', config)
      .then((res) => {
        const orders = Array.isArray(res.data) ? res.data : [];
        const selectedOrder = orders.find((item) => item._id === preferredOrderId) || orders[0] || null;
        this.setState({
          orders,
          order: selectedOrder,
          isLoading: false,
          loadError: '',
        });
      })
      .catch(() => {
        this.setState({
          orders: [],
          order: null,
          isLoading: false,
          loadError: ORDER_LOAD_ERROR,
        });
      });
  };

  renderSkeletonRows() {
    return Array.from({ length: 5 }, (_, index) => (
      <tr key={`order-skeleton-${index}`} className="admin-skeleton-table">
        <td><div className="admin-skeleton-line is-medium"></div></td>
        <td><div className="admin-skeleton-line is-medium"></div></td>
        <td><div className="admin-skeleton-line is-long"></div></td>
        <td><div className="admin-skeleton-line is-medium"></div></td>
        <td><div className="admin-skeleton-line is-short"></div></td>
        <td><div className="admin-skeleton-line is-short"></div></td>
        <td><div className="admin-skeleton-line is-long"></div></td>
      </tr>
    ));
  }

  renderStatusFlow(order) {
    if (!order) return null;

    if (order.status === 'CANCELED') {
      return (
        <div className="admin-order-flow is-canceled">
          <span className="admin-status-pill is-canceled">CANCELED</span>
          <p>Don hang nay da bi huy va khong di tiep trong quy trinh giao hang.</p>
        </div>
      );
    }

    const currentIndex = ORDER_FLOW.indexOf(order.status);
    return (
      <div className="admin-order-flow">
        {ORDER_FLOW.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <div
              key={step}
              className={`admin-order-flow-step ${isCompleted ? 'is-completed' : ''} ${isCurrent ? 'is-current' : ''}`}
            >
              <span>{index + 1}</span>
              <strong>{step}</strong>
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const orderRows = this.state.orders.map((item) => (
      <tr key={item._id} onClick={() => this.trItemClick(item)}>
        <td>{item._id.substring(0, 8)}...</td>
        <td>{new Date(item.cdate).toLocaleString('vi-VN')}</td>
        <td>{this.getDisplayCustomer(item)}</td>
        <td>{this.getDisplayPhone(item)}</td>
        <td>{formatCurrency(item.total)}</td>
        <td>
          <span className={`admin-status-pill ${this.getStatusTone(item.status)}`}>
            {item.status}
          </span>
        </td>
        <td>
          <div className="admin-order-actions">
            {this.getOrderActions(item).map((action) => (
              <button
                key={`${item._id}-${action.nextStatus}`}
                type="button"
                className={`admin-order-action ${action.tone || ''}`}
                disabled={this.state.updatingOrderId === item._id}
                onClick={(e) => {
                  e.stopPropagation();
                  this.apiPutOrderStatus(item, action.nextStatus);
                }}
              >
                {this.state.updatingOrderId === item._id ? 'WORKING...' : action.label}
              </button>
            ))}
          </div>
        </td>
      </tr>
    ));

    const selectedOrder = this.state.order;
    const selectedItems = Array.isArray(selectedOrder?.items) ? selectedOrder.items : [];

    return (
      <div>
        <h2 className="section-title">Order List</h2>
        {this.state.loadError ? (
          <div className="admin-async-state">
            <h3>Chua tai duoc don hang</h3>
            <p>{this.state.loadError}</p>
            <button type="button" className="admin-async-button" onClick={() => this.apiGetOrders()}>
              Thu lai
            </button>
          </div>
        ) : (
          <table className="datatable">
            <tbody>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
              {this.state.isLoading ? this.renderSkeletonRows() : orderRows}
            </tbody>
          </table>
        )}

        {selectedOrder && !this.state.loadError ? (
          <div className="admin-subsection">
            <h2 className="section-title">Order Detail</h2>
            {this.renderStatusFlow(selectedOrder)}

            <div className="admin-order-detail-grid">
              <div className="detail-panel">
                <h2 className="section-title">Shipping Info</h2>
                <table>
                  <tbody>
                    <tr><td>Full name</td><td>{selectedOrder.shipping?.fullName || selectedOrder.customer?.name || '-'}</td></tr>
                    <tr><td>Phone</td><td>{selectedOrder.shipping?.phone || selectedOrder.customer?.phone || '-'}</td></tr>
                    <tr><td>Email</td><td>{selectedOrder.shipping?.email || selectedOrder.customer?.email || '-'}</td></tr>
                    <tr><td>Country</td><td>{selectedOrder.shipping?.country || '-'}</td></tr>
                    <tr><td>Address</td><td>{selectedOrder.shipping?.addressLine || '-'}</td></tr>
                    <tr><td>Region</td><td>{selectedOrder.shipping?.region || '-'}</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="detail-panel">
                <h2 className="section-title">Order Meta</h2>
                <table>
                  <tbody>
                    <tr><td>Shipping method</td><td>{selectedOrder.shipping?.shippingMethod || '-'}</td></tr>
                    <tr><td>Payment</td><td>{selectedOrder.payment?.label || selectedOrder.payment?.method || 'COD'}</td></tr>
                    <tr><td>Invoice</td><td>{selectedOrder.invoiceRequested ? 'Requested' : 'No'}</td></tr>
                    <tr><td>Note</td><td>{selectedOrder.note || '-'}</td></tr>
                    <tr>
                      <td>Status</td>
                      <td>
                        <span className={`admin-status-pill ${this.getStatusTone(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
                      </td>
                    </tr>
                    <tr><td>Total</td><td>{formatCurrency(selectedOrder.total)}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="admin-subsection">
              <table className="datatable">
                <tbody>
                  <tr>
                    <th>No.</th>
                    <th>Product</th>
                    <th>Image</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Amount</th>
                  </tr>
                  {selectedItems.map((item, index) => (
                    <tr key={item.product?._id || index}>
                      <td>{index + 1}</td>
                      <td>{item.product?.name}</td>
                      <td>
                        <img
                          src={item.product?.image}
                          width="60"
                          height="60"
                          alt={item.product?.name || 'Product'}
                          style={{ objectFit: 'cover', borderRadius: '4px' }}
                        />
                      </td>
                      <td>{formatCurrency(item.product?.price)}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(Number(item.product?.price || 0) * Number(item.quantity || 0))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Order;

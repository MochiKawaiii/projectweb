import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Order extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = { orders: [], order: null };
  }

  componentDidMount() {
    this.apiGetOrders();
  }

  trItemClick(item) {
    this.setState({ order: item });
  }

  lnkApproveClick(id) {
    this.apiPutOrderStatus(id, 'APPROVED');
  }

  lnkCancelClick(id) {
    this.apiPutOrderStatus(id, 'CANCELED');
  }

  apiPutOrderStatus(id, status) {
    const body = { status };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put(`/api/admin/orders/status/${id}`, body, config).then((res) => {
      if (res.data) {
        this.apiGetOrders();
      } else {
        alert('SORRY BABY!');
      }
    });
  }

  apiGetOrders() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders', config).then((res) => {
      this.setState({ orders: res.data });
    });
  }

  getDisplayCustomer(order) {
    return order.shipping?.email || order.customer?.email || order.customer?.name || '';
  }

  getDisplayPhone(order) {
    return order.shipping?.phone || order.customer?.phone || '';
  }

  render() {
    const orders = this.state.orders.map((item) => (
      <tr key={item._id} onClick={() => this.trItemClick(item)}>
        <td>{item._id.substring(0, 8)}...</td>
        <td>{new Date(item.cdate).toLocaleString()}</td>
        <td>{this.getDisplayCustomer(item)}</td>
        <td>{this.getDisplayPhone(item)}</td>
        <td>{item.total?.toLocaleString('vi-VN')}₫</td>
        <td>
          <b style={{ color: item.status === 'APPROVED' ? 'green' : item.status === 'CANCELED' ? 'red' : '#e68a00' }}>
            {item.status}
          </b>
        </td>
        <td>
          {item.status === 'PENDING' ? (
            <div>
              <span className="link" onClick={(e) => { e.stopPropagation(); this.lnkApproveClick(item._id); }}>APPROVE</span>
              {' || '}
              <span className="link" style={{ color: 'red' }} onClick={(e) => { e.stopPropagation(); this.lnkCancelClick(item._id); }}>CANCEL</span>
            </div>
          ) : <div />}
        </td>
      </tr>
    ));

    let items = null;
    let shippingCard = null;
    if (this.state.order) {
      items = this.state.order.items.map((item, index) => (
        <tr key={item.product?._id || index}>
          <td>{index + 1}</td>
          <td>{item.product?.name}</td>
          <td><img src={item.product?.image} width="60" height="60" alt="" style={{ objectFit: 'cover', borderRadius: '4px' }} /></td>
          <td>{item.product?.price?.toLocaleString('vi-VN')}₫</td>
          <td>{item.quantity}</td>
          <td>{(item.product?.price * item.quantity)?.toLocaleString('vi-VN')}₫</td>
        </tr>
      ));

      const order = this.state.order;
      shippingCard = (
        <div style={{ marginTop: '24px', display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div className="detail-panel" style={{ minWidth: 0 }}>
            <h2 className="section-title">Shipping Info</h2>
            <table><tbody>
              <tr><td>Full name</td><td>{order.shipping?.fullName || order.customer?.name || '-'}</td></tr>
              <tr><td>Phone</td><td>{order.shipping?.phone || order.customer?.phone || '-'}</td></tr>
              <tr><td>Email</td><td>{order.shipping?.email || order.customer?.email || '-'}</td></tr>
              <tr><td>Country</td><td>{order.shipping?.country || '-'}</td></tr>
              <tr><td>Address</td><td>{order.shipping?.addressLine || '-'}</td></tr>
              <tr><td>Region</td><td>{order.shipping?.region || '-'}</td></tr>
            </tbody></table>
          </div>

          <div className="detail-panel" style={{ minWidth: 0 }}>
            <h2 className="section-title">Order Meta</h2>
            <table><tbody>
              <tr><td>Shipping method</td><td>{order.shipping?.shippingMethod || '-'}</td></tr>
              <tr><td>Payment</td><td>{order.payment?.label || order.payment?.method || 'COD'}</td></tr>
              <tr><td>Invoice</td><td>{order.invoiceRequested ? 'Requested' : 'No'}</td></tr>
              <tr><td>Note</td><td>{order.note || '-'}</td></tr>
              <tr><td>Status</td><td>{order.status}</td></tr>
              <tr><td>Total</td><td>{order.total?.toLocaleString('vi-VN')}₫</td></tr>
            </tbody></table>
          </div>
        </div>
      );
    }

    return (
      <div>
        <h2 className="section-title">Order List</h2>
        <table className="datatable">
          <tbody>
            <tr><th>ID</th><th>Date</th><th>Customer</th><th>Phone</th><th>Total</th><th>Status</th><th>Action</th></tr>
            {orders}
          </tbody>
        </table>

        {this.state.order && (
          <div style={{ marginTop: '30px' }}>
            <h2 className="section-title">Order Detail</h2>
            {shippingCard}
            <div style={{ marginTop: '24px' }}>
              <table className="datatable">
                <tbody>
                  <tr><th>No.</th><th>Product</th><th>Image</th><th>Price</th><th>Qty</th><th>Amount</th></tr>
                  {items}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Order;

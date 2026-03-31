import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CustomerDetail from './CustomerDetailComponent';

class Customer extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = { customers: [], orders: [], order: null, itemSelected: null };
  }

  componentDidMount() {
    this.apiGetCustomers();
  }

  trCustomerClick(item) {
    this.setState({ itemSelected: item, orders: [], order: null });
    this.apiGetOrdersByCustID(item._id);
  }

  trOrderClick(item) {
    this.setState({ order: item });
  }

  lnkDeactiveClick(item) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put(`/api/admin/customers/deactive/${item._id}`, {}, config).then((res) => {
      if (res.data) {
        this.apiGetCustomers();
      } else {
        alert('SORRY BABY!');
      }
    });
  }

  lnkActiveClick(item) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put(`/api/admin/customers/active/${item._id}`, {}, config).then((res) => {
      if (res.data) {
        this.apiGetCustomers();
      } else {
        alert('SORRY BABY!');
      }
    });
  }

  lnkEmailClick(item) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get(`/api/admin/customers/sendmail/${item._id}`, config).then((res) => {
      alert(res.data.message);
    });
  }

  updateCustomers = (customers) => {
    this.setState({ customers });
  };

  setSelectedCustomer = (itemSelected) => {
    this.setState({ itemSelected });
  };

  apiGetCustomers() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers', config).then((res) => {
      this.setState({ customers: res.data });
    });
  }

  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get(`/api/admin/orders/customer/${cid}`, config).then((res) => {
      this.setState({ orders: res.data });
    });
  }

  render() {
    const customers = this.state.customers.map((item) => (
      <tr key={item._id} onClick={() => this.trCustomerClick(item)}>
        <td>{item._id.substring(0, 8)}...</td>
        <td>{item.username}</td>
        <td>{item.name}</td>
        <td>{item.phone}</td>
        <td>{item.email}</td>
        <td>{item.active === 1 ? <b style={{ color: 'green' }}>Active</b> : <b style={{ color: 'red' }}>Inactive</b>}</td>
        <td>
          {item.active === 0 ? (
            <>
              <span className="link" onClick={(e) => { e.stopPropagation(); this.lnkEmailClick(item); }}>SEND OTP</span>
              {' | '}
              <span className="link" onClick={(e) => { e.stopPropagation(); this.lnkActiveClick(item); }}>ACTIVE</span>
            </>
          ) : (
            <span className="link" style={{ color: 'red' }} onClick={(e) => { e.stopPropagation(); this.lnkDeactiveClick(item); }}>DEACTIVE</span>
          )}
        </td>
      </tr>
    ));

    const orders = this.state.orders.map((item) => (
      <tr key={item._id} onClick={() => this.trOrderClick(item)}>
        <td>{item._id.substring(0, 8)}...</td>
        <td>{new Date(item.cdate).toLocaleString()}</td>
        <td>{item.total?.toLocaleString()}₫</td>
        <td>{item.status}</td>
      </tr>
    ));

    let items = null;
    if (this.state.order) {
      items = this.state.order.items.map((item, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item.product?.name}</td>
          <td>{item.product?.price?.toLocaleString()}₫</td>
          <td>{item.quantity}</td>
          <td>{(item.product?.price * item.quantity)?.toLocaleString()}₫</td>
        </tr>
      ));
    }

    return (
      <div className="admin-content">
        <div className="list-panel">
          <h2 className="section-title">Customer List</h2>
          <table className="datatable">
            <tbody>
              <tr><th>ID</th><th>Username</th><th>Name</th><th>Phone</th><th>Email</th><th>Status</th><th>Action</th></tr>
              {customers}
            </tbody>
          </table>

          {this.state.orders.length > 0 && (
            <div style={{ marginTop: '30px' }}>
              <h2 className="section-title">Orders by Customer</h2>
              <table className="datatable">
                <tbody>
                  <tr><th>ID</th><th>Date</th><th>Total</th><th>Status</th></tr>
                  {orders}
                </tbody>
              </table>
            </div>
          )}

          {this.state.order && (
            <div style={{ marginTop: '20px' }}>
              <h2 className="section-title">Order Detail</h2>
              <table className="datatable">
                <tbody>
                  <tr><th>No.</th><th>Product</th><th>Price</th><th>Qty</th><th>Amount</th></tr>
                  {items}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <CustomerDetail
          item={this.state.itemSelected}
          updateCustomers={this.updateCustomers}
          setSelectedCustomer={this.setSelectedCustomer}
        />
      </div>
    );
  }
}

export default Customer;

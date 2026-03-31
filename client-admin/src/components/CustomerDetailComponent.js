import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class CustomerDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtUsername: '',
      txtPassword: '',
      txtName: '',
      txtPhone: '',
      txtEmail: '',
      cmbActive: '0',
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      if (this.props.item) {
        this.setState({
          txtID: this.props.item._id || '',
          txtUsername: this.props.item.username || '',
          txtPassword: this.props.item.password || '',
          txtName: this.props.item.name || '',
          txtPhone: this.props.item.phone || '',
          txtEmail: this.props.item.email || '',
          cmbActive: String(this.props.item.active || 0),
        });
      } else {
        this.resetForm();
      }
    }
  }

  resetForm = () => {
    this.setState({
      txtID: '',
      txtUsername: '',
      txtPassword: '',
      txtName: '',
      txtPhone: '',
      txtEmail: '',
      cmbActive: '0',
    });
  };

  btnAddClick = (e) => {
    e.preventDefault();
    const customer = this.buildPayload();
    if (!customer) return;
    this.apiPostCustomer(customer);
  };

  btnUpdateClick = (e) => {
    e.preventDefault();
    const id = this.state.txtID;
    const customer = this.buildPayload();
    if (!id) {
      alert('Please select a customer first.');
      return;
    }
    if (!customer) return;
    this.apiPutCustomer(id, customer);
  };

  btnDeleteClick = (e) => {
    e.preventDefault();
    const id = this.state.txtID;
    if (!id) {
      alert('Please select a customer first.');
      return;
    }
    if (window.confirm('ARE YOU SURE?')) {
      this.apiDeleteCustomer(id);
    }
  };

  buildPayload() {
    const customer = {
      username: this.state.txtUsername.trim(),
      password: this.state.txtPassword.trim(),
      name: this.state.txtName.trim(),
      phone: this.state.txtPhone.trim(),
      email: this.state.txtEmail.trim(),
      active: Number(this.state.cmbActive || 0),
    };

    if (!customer.username || !customer.password || !customer.name || !customer.phone || !customer.email) {
      alert('Please fill all required fields.');
      return null;
    }
    return customer;
  }

  apiPostCustomer(customer) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/customers', customer, config).then((res) => {
      if (res.data?.success === false) {
        alert(res.data.message || 'SORRY BABY!');
        return;
      }
      if (res.data) {
        alert('OK BABY!');
        this.resetForm();
        this.props.setSelectedCustomer(null);
        this.apiGetCustomers();
      } else {
        alert('SORRY BABY!');
      }
    });
  }

  apiPutCustomer(id, customer) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put(`/api/admin/customers/${id}`, customer, config).then((res) => {
      if (res.data?.success === false) {
        alert(res.data.message || 'SORRY BABY!');
        return;
      }
      if (res.data) {
        alert('OK BABY!');
        this.apiGetCustomers();
      } else {
        alert('SORRY BABY!');
      }
    });
  }

  apiDeleteCustomer(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete(`/api/admin/customers/${id}`, config).then((res) => {
      if (res.data) {
        alert('OK BABY!');
        this.resetForm();
        this.props.setSelectedCustomer(null);
        this.apiGetCustomers();
      } else {
        alert('SORRY BABY!');
      }
    });
  }

  apiGetCustomers() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers', config).then((res) => {
      this.props.updateCustomers(res.data);
    });
  }

  render() {
    return (
      <div className="detail-panel">
        <h2 className="section-title">Customer Detail</h2>
        <form>
          <table><tbody>
            <tr><td>ID</td><td><input type="text" value={this.state.txtID} readOnly={true} /></td></tr>
            <tr><td>Username</td><td><input type="text" value={this.state.txtUsername} onChange={(e) => this.setState({ txtUsername: e.target.value })} /></td></tr>
            <tr><td>Password</td><td><input type="text" value={this.state.txtPassword} onChange={(e) => this.setState({ txtPassword: e.target.value })} /></td></tr>
            <tr><td>Name</td><td><input type="text" value={this.state.txtName} onChange={(e) => this.setState({ txtName: e.target.value })} /></td></tr>
            <tr><td>Phone</td><td><input type="text" value={this.state.txtPhone} onChange={(e) => this.setState({ txtPhone: e.target.value })} /></td></tr>
            <tr><td>Email</td><td><input type="text" value={this.state.txtEmail} onChange={(e) => this.setState({ txtEmail: e.target.value })} /></td></tr>
            <tr><td>Status</td><td>
              <select value={this.state.cmbActive} onChange={(e) => this.setState({ cmbActive: e.target.value })}>
                <option value="0">Inactive</option>
                <option value="1">Active</option>
              </select>
            </td></tr>
            <tr><td></td><td>
              <input type="submit" value="ADD NEW" onClick={this.btnAddClick} />
              <input type="submit" value="UPDATE" onClick={this.btnUpdateClick} />
              <input type="submit" value="DELETE" onClick={this.btnDeleteClick} />
              <button type="button" onClick={this.resetForm}>CLEAR</button>
            </td></tr>
          </tbody></table>
        </form>
      </div>
    );
  }
}

export default CustomerDetail;

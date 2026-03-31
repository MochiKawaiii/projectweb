import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';

class Login extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
      submitting: false,
    };
  }

  getAdminDashboardUrl = () => {
    const configuredUrl = (process.env.REACT_APP_ADMIN_DASHBOARD_URL || '').trim();
    if (configuredUrl) {
      return configuredUrl.endsWith('/home')
        ? configuredUrl
        : `${configuredUrl.replace(/\/+$/, '')}/home`;
    }
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:3001/home`;
  };

  buildAdminTransferUrl = (baseUrl, token, username) => {
    const params = new URLSearchParams();
    params.set('adminToken', token || '');
    params.set('adminUsername', username || '');
    return `${baseUrl}#${params.toString()}`;
  };

  btnLoginClick = async (e) => {
    e.preventDefault();
    const txtUsername = this.state.txtUsername.trim();
    const txtPassword = this.state.txtPassword.trim();

    if (!txtUsername || !txtPassword) {
      alert('Please enter your username/email and password.');
      return;
    }

    try {
      this.setState({ submitting: true });
      const res = await axios.post('/api/customer/login', { username: txtUsername, password: txtPassword });
      if (res.data.success) {
        if (res.data.role === 'admin') {
          const adminUrl = this.buildAdminTransferUrl(
            this.getAdminDashboardUrl(),
            res.data.token,
            res.data.admin?.username || txtUsername
          );
          window.location.assign(adminUrl);
          return;
        }
        this.context.setToken(res.data.token);
        this.context.setCustomer(res.data.customer);
        this.props.navigate('/home');
        return;
      }
      alert(res.data.message || 'Login failed.');
    } catch (error) {
      alert('Unable to login right now. Please try again.');
    } finally {
      this.setState({ submitting: false });
    }
  };

  render() {
    if (this.context.token !== '') {
      this.props.navigate('/home');
      return null;
    }

    return (
      <div className="auth-page">
        <h1>Login</h1>
        <form className="auth-form">
          <div className="form-group">
            <label>Username or email</label>
            <input
              type="text"
              value={this.state.txtUsername}
              onChange={(e) => this.setState({ txtUsername: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={this.state.txtPassword}
              onChange={(e) => this.setState({ txtPassword: e.target.value })}
            />
          </div>
          <button type="submit" className="form-submit" onClick={this.btnLoginClick} disabled={this.state.submitting}>
            {this.state.submitting ? 'Logging in...' : 'Login'}
          </button>
          <a
            href="/signup"
            className="auth-link"
            onClick={(e) => {
              e.preventDefault();
              this.props.navigate('/signup');
            }}
          >
            Create a new account ->
          </a>
        </form>
      </div>
    );
  }
}

export default withRouter(Login);

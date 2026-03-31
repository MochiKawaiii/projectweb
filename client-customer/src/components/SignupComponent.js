import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../utils/withRouter';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
      txtName: '',
      txtPhone: '',
      txtEmail: '',
      submitting: false,
    };
  }

  btnSignupClick = async (e) => {
    e.preventDefault();
    const payload = {
      username: this.state.txtUsername.trim(),
      password: this.state.txtPassword.trim(),
      name: this.state.txtName.trim(),
      phone: this.state.txtPhone.trim(),
      email: this.state.txtEmail.trim(),
    };

    if (!payload.username || !payload.password || !payload.name || !payload.phone || !payload.email) {
      alert('Please fill all required fields.');
      return;
    }

    try {
      this.setState({ submitting: true });
      const res = await axios.post('/api/customer/signup', payload);
      alert(res.data.message || 'Signup completed.');

      if (res.data.success) {
        if (res.data.email) {
          window.sessionStorage.setItem('pendingSignupEmail', res.data.email);
        }
        if (res.data.requiresActivation) this.props.navigate('/active');
        else this.props.navigate('/login');
      }
    } catch (error) {
      alert('Unable to create your account right now. Please try again.');
    } finally {
      this.setState({ submitting: false });
    }
  };

  render() {
    return (
      <div className="auth-page">
        <h1>Signup</h1>
        <form className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input type="text" value={this.state.txtUsername} onChange={(e) => this.setState({ txtUsername: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={this.state.txtPassword} onChange={(e) => this.setState({ txtPassword: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Full name</label>
            <input type="text" value={this.state.txtName} onChange={(e) => this.setState({ txtName: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="tel" value={this.state.txtPhone} onChange={(e) => this.setState({ txtPhone: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={this.state.txtEmail} onChange={(e) => this.setState({ txtEmail: e.target.value })} />
          </div>
          <button type="submit" className="form-submit" onClick={this.btnSignupClick} disabled={this.state.submitting}>
            {this.state.submitting ? 'Sending OTP...' : 'Create account'}
          </button>
          <a
            href="/login"
            className="auth-link"
            onClick={(e) => {
              e.preventDefault();
              this.props.navigate('/login');
            }}
          >
            Already have an account? Login ->
          </a>
        </form>
      </div>
    );
  }
}

export default withRouter(Signup);

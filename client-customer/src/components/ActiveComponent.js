import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../utils/withRouter';

class Active extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtEmail: window.sessionStorage.getItem('pendingSignupEmail') || '',
      txtOtp: '',
      submitting: false,
      resending: false,
    };
  }

  btnActiveClick = async (e) => {
    e.preventDefault();
    const email = this.state.txtEmail.trim();
    const otp = this.state.txtOtp.replace(/\D/g, '').slice(0, 6);

    if (!email || otp.length !== 6) {
      alert('Please enter your email and the 6-digit OTP.');
      return;
    }

    try {
      this.setState({ submitting: true });
      const res = await axios.post('/api/customer/active', { email, otp });
      alert(res.data.message || 'Verification completed.');
      if (res.data.success) {
        window.sessionStorage.removeItem('pendingSignupEmail');
        this.props.navigate('/login');
      }
    } catch (error) {
      alert('Unable to verify OTP right now. Please try again.');
    } finally {
      this.setState({ submitting: false });
    }
  };

  btnResendOtpClick = async (e) => {
    e.preventDefault();
    const email = this.state.txtEmail.trim();
    if (!email) {
      alert('Please enter your email first.');
      return;
    }

    try {
      this.setState({ resending: true });
      const res = await axios.post('/api/customer/active/resend', { email });
      alert(res.data.message || 'OTP resent.');
    } catch (error) {
      alert('Unable to resend OTP right now. Please try again.');
    } finally {
      this.setState({ resending: false });
    }
  };

  render() {
    return (
      <div className="auth-page">
        <h1>Verify OTP</h1>
        <form className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={this.state.txtEmail}
              onChange={(e) => this.setState({ txtEmail: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>OTP code</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength="6"
              value={this.state.txtOtp}
              onChange={(e) => this.setState({ txtOtp: e.target.value.replace(/\D/g, '').slice(0, 6) })}
            />
          </div>
          <button type="submit" className="form-submit" onClick={this.btnActiveClick} disabled={this.state.submitting}>
            {this.state.submitting ? 'Verifying...' : 'Verify account'}
          </button>
          <button type="button" className="form-submit secondary" onClick={this.btnResendOtpClick} disabled={this.state.resending}>
            {this.state.resending ? 'Resending OTP...' : 'Resend OTP'}
          </button>
          <a
            href="/login"
            className="auth-link"
            onClick={(e) => {
              e.preventDefault();
              this.props.navigate('/login');
            }}
          >
            Back to login ->
          </a>
        </form>
      </div>
    );
  }
}

export default withRouter(Active);

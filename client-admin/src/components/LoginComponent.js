import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

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

  btnLoginClick(e) {
    e.preventDefault();
    const username = this.state.txtUsername.trim();
    const password = this.state.txtPassword.trim();
    if (username && password) {
      const account = { username, password };
      this.apiLogin(account);
    } else {
      alert('Please input username and password');
    }
  }

  apiLogin(account) {
    this.setState({ submitting: true });
    axios
      .post('/api/admin/login', account)
      .then((res) => {
        const result = res.data;
        if (result.success === true) {
          this.context.setToken(result.token);
          this.context.setUsername(account.username);
        } else {
          alert(result.message);
        }
      })
      .catch(() => {
        alert('Unable to login right now. Please try again.');
      })
      .finally(() => {
        this.setState({ submitting: false });
      });
  }

  render() {
    if (this.context.token === '') {
      return (
        <div className="align-valign-center">
          <h2 className="text-center">WHENEVER ADMIN</h2>
          <form>
            <table className="align-center">
              <tbody>
                <tr><td colSpan="2"><input type="text" placeholder="Username" value={this.state.txtUsername} onChange={(e) => this.setState({ txtUsername: e.target.value })} /></td></tr>
                <tr><td colSpan="2"><input type="password" placeholder="Password" value={this.state.txtPassword} onChange={(e) => this.setState({ txtPassword: e.target.value })} /></td></tr>
                <tr>
                  <td colSpan="2">
                    <input
                      type="submit"
                      value={this.state.submitting ? 'LOGGING IN...' : 'LOGIN'}
                      onClick={(e) => this.btnLoginClick(e)}
                      style={{ width: '100%' }}
                      disabled={this.state.submitting}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      );
    }
    return <div />;
  }
}

export default Login;

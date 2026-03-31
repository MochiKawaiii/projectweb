import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Login extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = { txtUsername: '', txtPassword: '' };
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
                <tr><td colSpan="2"><input type="submit" value="LOGIN" onClick={(e) => this.btnLoginClick(e)} style={{width:'100%'}} /></td></tr>
              </tbody>
            </table>
          </form>
        </div>
      );
    }
    return (<div />);
  }
  btnLoginClick(e) {
    e.preventDefault();
    const username = this.state.txtUsername;
    const password = this.state.txtPassword;
    if (username && password) {
      const account = { username, password };
      this.apiLogin(account);
    } else {
      alert('Please input username and password');
    }
  }
  apiLogin(account) {
    axios.post('/api/admin/login', account).then((res) => {
      const result = res.data;
      if (result.success === true) {
        this.context.setToken(result.token);
        this.context.setUsername(account.username);
      } else {
        alert(result.message);
      }
    });
  }
}
export default Login;

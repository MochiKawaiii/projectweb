import React, { Component } from 'react';
import MyContext from './MyContext';

class MyProvider extends Component {
  static readTransferredSession() {
    if (typeof window === 'undefined') return null;
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) return null;
    const params = new URLSearchParams(hash);
    const token = params.get('adminToken') || '';
    const username = params.get('adminUsername') || '';
    if (!token) return null;
    return { token, username };
  }

  constructor(props) {
    super(props);
    const transferredSession = MyProvider.readTransferredSession();
    const storedToken = transferredSession?.token || window.localStorage.getItem('wheneverAdminToken') || '';
    const storedUsername = transferredSession?.username || window.localStorage.getItem('wheneverAdminUsername') || '';
    this.state = {
      token: storedToken,
      username: storedUsername,
      setToken: this.setToken,
      setUsername: this.setUsername
    };
  }
  componentDidMount() {
    const transferredSession = MyProvider.readTransferredSession();
    if (!transferredSession) return;

    if (transferredSession.token) {
      window.localStorage.setItem('wheneverAdminToken', transferredSession.token);
    }
    if (transferredSession.username) {
      window.localStorage.setItem('wheneverAdminUsername', transferredSession.username);
    }

    this.setState({
      token: transferredSession.token,
      username: transferredSession.username
    });

    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  }
  setToken = (value) => {
    if (value) window.localStorage.setItem('wheneverAdminToken', value);
    else window.localStorage.removeItem('wheneverAdminToken');
    this.setState({ token: value });
  }
  setUsername = (value) => {
    if (value) window.localStorage.setItem('wheneverAdminUsername', value);
    else window.localStorage.removeItem('wheneverAdminUsername');
    this.setState({ username: value });
  }
  render() {
    return (
      <MyContext.Provider value={this.state}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}
export default MyProvider;

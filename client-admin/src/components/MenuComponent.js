import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { Link } from 'react-router-dom';

class Menu extends Component {
  static contextType = MyContext;
  render() {
    return (
      <div className="admin-header">
        <div className="logo">WHENEVER ADMIN</div>
        <div className="admin-nav">
          <Link to='/home'>Home</Link>
          <Link to='/category'>Category</Link>
          <Link to='/product'>Product</Link>
          <Link to='/order'>Order</Link>
          <Link to='/customer'>Customer</Link>
        </div>
        <div className="admin-user">
          Hello <b>{this.context.username}</b>
          <a href="#logout" onClick={(e) => { e.preventDefault(); this.lnkLogoutClick(); }}>Logout</a>
        </div>
      </div>
    );
  }
  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setUsername('');
  }
}
export default Menu;

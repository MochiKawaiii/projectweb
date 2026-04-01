import React, { Component } from 'react';
import MyContext from './MyContext';

const STORAGE_KEYS = {
  token: 'whenever_customer_token',
  customer: 'whenever_customer_profile',
  mycart: 'whenever_customer_cart',
};

const readJson = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
};

class MyProvider extends Component {
  constructor(props) {
    super(props);
    const token = typeof window === 'undefined' ? '' : window.localStorage.getItem(STORAGE_KEYS.token) || '';
    const customer = readJson(STORAGE_KEYS.customer, null);
    const mycart = readJson(STORAGE_KEYS.mycart, []);
    this.state = {
      token,
      customer,
      mycart: Array.isArray(mycart) ? mycart : [],
      setToken: this.setToken,
      setCustomer: this.setCustomer,
      setMycart: this.setMycart,
      logout: this.logout,
    };
  }

  setToken = (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        window.localStorage.setItem(STORAGE_KEYS.token, value);
      } else {
        window.localStorage.removeItem(STORAGE_KEYS.token);
      }
    }
    this.setState({ token: value || '' });
  };

  setCustomer = (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        window.localStorage.setItem(STORAGE_KEYS.customer, JSON.stringify(value));
      } else {
        window.localStorage.removeItem(STORAGE_KEYS.customer);
      }
    }
    this.setState({ customer: value || null });
  };

  setMycart = (value) => {
    const nextCart = Array.isArray(value) ? [...value] : [];
    if (typeof window !== 'undefined') {
      if (nextCart.length) {
        window.localStorage.setItem(STORAGE_KEYS.mycart, JSON.stringify(nextCart));
      } else {
        window.localStorage.removeItem(STORAGE_KEYS.mycart);
      }
    }
    this.setState({ mycart: nextCart });
  };

  logout = () => {
    this.setToken('');
    this.setCustomer(null);
    this.setMycart([]);
  };

  render() {
    return (
      <MyContext.Provider value={this.state}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}
export default MyProvider;

import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import Menu from './MenuComponent';
import Home from './HomeComponent';
import Category from './CategoryComponent';
import Product from './ProductComponent';
import Order from './OrderComponent';
import Customer from './CustomerComponent';
import { Routes, Route, Navigate } from 'react-router-dom';

class Main extends Component {
  static contextType = MyContext;
  render() {
    if (this.context.token !== '') {
      return (
        <div className="body-admin">
          <Menu />
          <Routes>
            <Route path='/' element={<Navigate replace to='/home' />} />
            <Route path='/home' element={<Home />} />
            <Route path='/category' element={<Category />} />
            <Route path='/product' element={<Product />} />
            <Route path='/order' element={<Order />} />
            <Route path='/customer' element={<Customer />} />
          </Routes>
        </div>
      );
    }
    return (<div />);
  }
}
export default Main;

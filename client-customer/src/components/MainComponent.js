import React, { Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from './HomeComponent';
import ProductList from './ProductListComponent';
import ProductDetail from './ProductDetailComponent';
import Search from './SearchComponent';
import Login from './LoginComponent';
import Signup from './SignupComponent';
import Active from './ActiveComponent';
import Myprofile from './MyprofileComponent';
import Mycart from './MycartComponent';
import Checkout from './CheckoutComponent';
import Myorders from './MyordersComponent';
import PolicyPage from './PolicyPageComponent';

class Main extends Component {
  render() {
    return (
      <div className="site-wrapper">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path='/' element={<Navigate replace to='/home' />} />
            <Route path='/home' element={<Home />} />
            <Route path='/product/category/:cid' element={<ProductList />} />
            <Route path='/product/search/:keyword' element={<ProductList />} />
            <Route path='/product/:id' element={<ProductDetail />} />
            <Route path='/search' element={<Search />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/active' element={<Active />} />
            <Route path='/myprofile' element={<Myprofile />} />
            <Route path='/mycart' element={<Mycart />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/myorders' element={<Myorders />} />
            <Route path='/pages/:slug' element={<PolicyPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    );
  }
}
export default Main;

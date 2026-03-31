import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import ProductDetail from './ProductDetailComponent';

class Product extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = { products: [], noPages: 0, curPage: 1, itemSelected: null };
  }
  render() {
    const prods = this.state.products.map((item) => {
      return (
        <tr key={item._id} onClick={() => this.trItemClick(item)}>
          <td>{item._id.substring(0,8)}...</td>
          <td>{item.name}</td>
          <td>{item.price?.toLocaleString()}₫</td>
          <td>{new Date(item.cdate).toLocaleDateString()}</td>
          <td>{item.category?.name}</td>
          <td><img src={item.image} width="70" height="70" alt="" style={{objectFit:'cover',borderRadius:'4px'}} /></td>
        </tr>
      );
    });
    const pagination = Array.from({ length: this.state.noPages }, (_, index) => {
      if ((index + 1) === this.state.curPage) {
        return (<span key={index}>| <b>{index + 1}</b> |</span>);
      } else {
        return (<span key={index} className="link" onClick={() => this.lnkPageClick(index + 1)}>| {index + 1} |</span>);
      }
    });
    return (
      <div className="admin-content">
        <div className="list-panel">
          <h2 className="section-title">Product List</h2>
          <table className="datatable">
            <tbody>
              <tr><th>ID</th><th>Name</th><th>Price</th><th>Date</th><th>Category</th><th>Image</th></tr>
              {prods}
              <tr><td colSpan="6" className="pagination">{pagination}</td></tr>
            </tbody>
          </table>
        </div>
        <ProductDetail item={this.state.itemSelected} curPage={this.state.curPage} updateProducts={this.updateProducts} />
      </div>
    );
  }
  componentDidMount() { this.apiGetProducts(this.state.curPage); }
  lnkPageClick(index) { this.apiGetProducts(index); }
  trItemClick(item) { this.setState({ itemSelected: item }); }
  updateProducts = (products, noPages) => { this.setState({ products: products, noPages: noPages }); }
  apiGetProducts(page) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/products?page=' + page, config).then((res) => {
      const result = res.data;
      this.setState({ products: result.products, noPages: result.noPages, curPage: result.curPage });
    });
  }
}
export default Product;

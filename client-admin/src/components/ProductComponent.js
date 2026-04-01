import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import ProductDetail from './ProductDetailComponent';

const PRODUCT_LOAD_ERROR =
  'Không tải được danh sách sản phẩm. Máy chủ có thể đang khởi động lại, bạn thử lại sau vài giây nhé.';

class Product extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      noPages: 0,
      curPage: 1,
      itemSelected: null,
      isLoading: true,
      loadError: '',
    };
  }

  componentDidMount() {
    this.apiGetProducts(this.state.curPage);
  }

  lnkPageClick(index) {
    this.apiGetProducts(index);
  }

  trItemClick(item) {
    this.setState({ itemSelected: item });
  }

  updateProducts = (products, noPages, curPage = this.state.curPage) => {
    this.setState({
      products,
      noPages,
      curPage,
      isLoading: false,
      loadError: '',
    });
  };

  apiGetProducts = (page) => {
    const config = { headers: { 'x-access-token': this.context.token } };
    this.setState({ isLoading: true, loadError: '' });
    axios
      .get('/api/admin/products?page=' + page, config)
      .then((res) => {
        const result = res.data || {};
        this.setState({
          products: Array.isArray(result.products) ? result.products : [],
          noPages: Number(result.noPages || 0),
          curPage: Number(result.curPage || page || 1),
          isLoading: false,
          loadError: '',
        });
      })
      .catch(() => {
        this.setState({
          products: [],
          noPages: 0,
          curPage: page,
          isLoading: false,
          loadError: PRODUCT_LOAD_ERROR,
        });
      });
  };

  renderSkeletonRows() {
    return Array.from({ length: 4 }, (_, index) => (
      <tr key={`product-skeleton-${index}`} className="admin-skeleton-table">
        <td><div className="admin-skeleton-line is-medium"></div></td>
        <td><div className="admin-skeleton-line is-long"></div></td>
        <td><div className="admin-skeleton-line is-short"></div></td>
        <td><div className="admin-skeleton-line is-medium"></div></td>
        <td><div className="admin-skeleton-line is-medium"></div></td>
        <td><div className="admin-skeleton-line is-short"></div></td>
      </tr>
    ));
  }

  render() {
    const prods = this.state.products.map((item) => {
      return (
        <tr key={item._id} onClick={() => this.trItemClick(item)}>
          <td>{item._id.substring(0, 8)}...</td>
          <td>{item.name}</td>
          <td>{item.price?.toLocaleString('vi-VN')}₫</td>
          <td>{new Date(item.cdate).toLocaleDateString()}</td>
          <td>{item.category?.name}</td>
          <td><img src={item.image} width="70" height="70" alt="" style={{ objectFit: 'cover', borderRadius: '4px' }} /></td>
        </tr>
      );
    });

    const pagination = Array.from({ length: this.state.noPages }, (_, index) => {
      if (index + 1 === this.state.curPage) {
        return <span key={index}>| <b>{index + 1}</b> |</span>;
      }
      return <span key={index} className="link" onClick={() => this.lnkPageClick(index + 1)}>| {index + 1} |</span>;
    });

    return (
      <div className="admin-content">
        <div className="list-panel">
          <h2 className="section-title">Product List</h2>
          {this.state.loadError ? (
            <div className="admin-async-state">
              <h3>Chưa tải được sản phẩm</h3>
              <p>{this.state.loadError}</p>
              <button type="button" className="admin-async-button" onClick={() => this.apiGetProducts(this.state.curPage)}>
                Thử lại
              </button>
            </div>
          ) : (
            <table className="datatable">
              <tbody>
                <tr><th>ID</th><th>Name</th><th>Price</th><th>Date</th><th>Category</th><th>Image</th></tr>
                {this.state.isLoading ? this.renderSkeletonRows() : prods}
                {!this.state.isLoading ? (
                  <tr><td colSpan="6" className="pagination">{pagination}</td></tr>
                ) : null}
              </tbody>
            </table>
          )}
        </div>
        <ProductDetail item={this.state.itemSelected} curPage={this.state.curPage} updateProducts={this.updateProducts} />
      </div>
    );
  }
}

export default Product;

import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import { enhanceProduct } from '../content/siteContent';

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      sortBy: 'default',
    };
  }

  componentDidMount() {
    this.loadProducts(this.props.params);
  }

  componentDidUpdate(prevProps) {
    const prevParams = prevProps.params || {};
    const nextParams = this.props.params || {};
    if (prevParams.cid !== nextParams.cid || prevParams.keyword !== nextParams.keyword) {
      this.loadProducts(nextParams);
    }
  }

  isObjectId(value) {
    return /^[a-f\d]{24}$/i.test(String(value || '').trim());
  }

  formatCategoryTitle(value) {
    return decodeURIComponent(String(value || 'san-pham'))
      .split('-')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  getProductTimestamp(product) {
    if (!product) return 0;
    if (Number(product.importedAt)) return Number(product.importedAt);
    if (Number(product.cdate)) return Number(product.cdate);
    if (this.isObjectId(product._id)) {
      return parseInt(String(product._id).slice(0, 8), 16) * 1000;
    }
    return 0;
  }

  getSortedProducts(products) {
    const sortedProducts = [...products];
    switch (this.state.sortBy) {
      case 'price-asc':
        return sortedProducts.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
      case 'price-desc':
        return sortedProducts.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
      case 'newest':
        return sortedProducts.sort((a, b) => this.getProductTimestamp(b) - this.getProductTimestamp(a));
      default:
        return sortedProducts;
    }
  }

  handleSortChange = (event) => {
    this.setState({ sortBy: event.target.value });
  };

  apiGetProductsByCatID(cid) {
    const categoryRef = String(cid || '').trim();
    const directCategoryRequest = categoryRef === 'all' || this.isObjectId(categoryRef);
    const endpoint = directCategoryRequest ? `/api/customer/products/category/${categoryRef}` : '/api/customer/products/category/all';

    axios
      .get(endpoint)
      .then((res) => {
        const products = res.data.map(enhanceProduct);
        const filteredProducts = directCategoryRequest
          ? products
          : products.filter((item) => item.category?.slug === categoryRef);
        this.setState({ products: filteredProducts });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ products: [] });
      });
  }

  apiGetProductsByKeyword(keyword) {
    axios
      .get(`/api/customer/products/search/${encodeURIComponent(keyword)}`)
      .then((res) => this.setState({ products: res.data.map(enhanceProduct) }))
      .catch((error) => {
        console.error(error);
        this.setState({ products: [] });
      });
  }

  loadProducts(params) {
    if (params?.cid) this.apiGetProductsByCatID(params.cid);
    else if (params?.keyword) this.apiGetProductsByKeyword(params.keyword);
    else this.setState({ products: [] });
  }

  render() {
    const products = this.getSortedProducts(this.state.products);
    const productCards = products.map((item) => (
      <div key={item._id} className="product-card">
        <Link to={`/product/${item._id}`}>
          <div className="product-image">
            <img src={item.image} alt={item.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div className="add-to-cart-overlay">{'Th\u00eam v\u00e0o gi\u1ecf'}</div>
          </div>
          <div className="product-info">
            <div className="brand-label">WHENEVER</div>
            <div className="product-name">{item.name}</div>
            <div className="product-price">{`${Number(item.price || 0).toLocaleString('vi-VN')}\u20ab`}</div>
            <div className="product-type">{item.marketing?.subtitle || item.category?.name}</div>
          </div>
        </Link>
      </div>
    ));

    const pageTitle = this.props.params.keyword
      ? `K\u1ebft qu\u1ea3 t\u00ecm ki\u1ebfm: "${decodeURIComponent(this.props.params.keyword)}"`
      : products[0]?.category?.name || this.formatCategoryTitle(this.props.params.cid);

    return (
      <div>
        <div className="collection-header">
          <h1>{pageTitle}</h1>
        </div>
        <div className="collection-sort" style={{ padding: '0 40px' }}>
          <select value={this.state.sortBy} onChange={this.handleSortChange} aria-label="Sort products">
            <option value="default">{'S\u1eafp x\u1ebfp'}</option>
            <option value="price-asc">{'Gi\u00e1: Th\u1ea5p \u0111\u1ebfn Cao'}</option>
            <option value="price-desc">{'Gi\u00e1: Cao \u0111\u1ebfn Th\u1ea5p'}</option>
            <option value="newest">{'M\u1edbi nh\u1ea5t'}</option>
          </select>
        </div>
        <div className="collection-grid">{productCards}</div>
        {products.length === 0 && (
          <p className="empty-message" style={{ padding: '40px', textAlign: 'center' }}>
            {'Kh\u00f4ng t\u00ecm th\u1ea5y s\u1ea3n ph\u1ea9m n\u00e0o ph\u00f9 h\u1ee3p.'}
          </p>
        )}
      </div>
    );
  }
}

export default withRouter(ProductList);

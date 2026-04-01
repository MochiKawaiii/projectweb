import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import { enhanceProduct } from '../content/siteContent';

const PRODUCT_LIST_RETRY_MESSAGE =
  'Chưa tải được danh sách sản phẩm. Render có thể đang khởi động lại, bạn thử lại sau vài giây nhé.';

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      sortBy: 'default',
      isLoading: true,
      loadError: '',
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

  handleLoadError = (error) => {
    console.error(error);
    this.setState({
      products: [],
      isLoading: false,
      loadError: PRODUCT_LIST_RETRY_MESSAGE,
    });
  };

  apiGetProductsByCatID(cid) {
    const categoryRef = String(cid || '').trim();
    const directCategoryRequest = categoryRef === 'all' || this.isObjectId(categoryRef);
    const endpoint = directCategoryRequest ? `/api/customer/products/category/${categoryRef}` : '/api/customer/products/category/all';

    axios
      .get(endpoint)
      .then((res) => {
        const products = Array.isArray(res.data) ? res.data.map(enhanceProduct) : [];
        const filteredProducts = directCategoryRequest ? products : products.filter((item) => item.category?.slug === categoryRef);
        this.setState({ products: filteredProducts, isLoading: false, loadError: '' });
      })
      .catch(this.handleLoadError);
  }

  apiGetProductsByKeyword(keyword) {
    axios
      .get(`/api/customer/products/search/${encodeURIComponent(keyword)}`)
      .then((res) => this.setState({ products: Array.isArray(res.data) ? res.data.map(enhanceProduct) : [], isLoading: false, loadError: '' }))
      .catch(this.handleLoadError);
  }

  loadProducts = (params) => {
    this.setState({ isLoading: true, loadError: '' });
    if (params?.cid) this.apiGetProductsByCatID(params.cid);
    else if (params?.keyword) this.apiGetProductsByKeyword(params.keyword);
    else this.setState({ products: [], isLoading: false, loadError: '' });
  };

  renderAsyncState(title, message) {
    return (
      <div className="collection-state-wrap">
        <div className="async-state-panel">
          <div className="async-state-eyebrow">WHENEVER ATELIER</div>
          <h3>{title}</h3>
          <p>{message}</p>
          {!this.state.isLoading ? (
            <button type="button" className="async-state-button" onClick={() => this.loadProducts(this.props.params)}>
              Thử lại
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  renderSkeletonCard = (key) => (
    <div key={key} className="product-card skeleton-card">
      <div className="product-image skeleton-box"></div>
      <div className="product-info">
        <div className="skeleton-line skeleton-line-xs"></div>
        <div className="skeleton-line skeleton-line-lg"></div>
        <div className="skeleton-line skeleton-line-sm"></div>
      </div>
    </div>
  );

  render() {
    const products = this.getSortedProducts(this.state.products);
    const productCards = products.map((item) => (
      <div key={item._id} className="product-card">
        <Link to={`/product/${item._id}`}>
          <div className="product-image">
            <img src={item.image} alt={item.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div className="add-to-cart-overlay">Thêm vào giỏ</div>
          </div>
          <div className="product-info">
            <div className="brand-label">WHENEVER</div>
            <div className="product-name">{item.name}</div>
            <div className="product-price">{`${Number(item.price || 0).toLocaleString('vi-VN')}₫`}</div>
            <div className="product-type">{item.marketing?.subtitle || item.category?.name}</div>
          </div>
        </Link>
      </div>
    ));

    const pageTitle = this.props.params.keyword
      ? `Kết quả tìm kiếm: "${decodeURIComponent(this.props.params.keyword)}"`
      : products[0]?.category?.name || this.formatCategoryTitle(this.props.params.cid);

    return (
      <div>
        <div className="collection-header">
          <h1>{pageTitle}</h1>
        </div>
        <div className="collection-sort" style={{ padding: '0 40px' }}>
          <select value={this.state.sortBy} onChange={this.handleSortChange} aria-label="Sort products" disabled={this.state.isLoading}>
            <option value="default">Sắp xếp</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
            <option value="newest">Mới nhất</option>
          </select>
        </div>

        {this.state.isLoading ? (
          <>
            <div className="collection-grid">
              {Array.from({ length: 8 }, (_, index) => this.renderSkeletonCard(`collection-skeleton-${index}`))}
            </div>
            <div className="loading-state-caption collection-loading-caption">Đang tải danh sách sản phẩm...</div>
          </>
        ) : this.state.loadError ? (
          this.renderAsyncState('Chưa tải được danh mục', this.state.loadError)
        ) : (
          <>
            <div className="collection-grid">{productCards}</div>
            {products.length === 0 && (
              <p className="empty-message" style={{ padding: '40px', textAlign: 'center' }}>
                Không tìm thấy sản phẩm nào phù hợp.
              </p>
            )}
          </>
        )}
      </div>
    );
  }
}

export default withRouter(ProductList);

import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { enhanceProduct } from '../content/siteContent';

const SEARCH_RETRY_MESSAGE =
  'Chưa tải được kết quả tìm kiếm. Máy chủ có thể đang khởi động lại, bạn thử lại sau vài giây nhé.';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
      results: [],
      isSearching: false,
      loadError: '',
    };
  }

  doSearch = (keyword) => {
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword.length < 2) {
      this.setState({ results: [], isSearching: false, loadError: '' });
      return;
    }

    this.setState({ isSearching: true, loadError: '' });
    axios
      .get(`/api/customer/products/search/${encodeURIComponent(trimmedKeyword)}`)
      .then((res) => {
        this.setState({
          results: Array.isArray(res.data) ? res.data.map(enhanceProduct) : [],
          isSearching: false,
          loadError: '',
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          results: [],
          isSearching: false,
          loadError: SEARCH_RETRY_MESSAGE,
        });
      });
  };

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
    const results = this.state.results.map((item) => (
      <div key={item._id} className="product-card">
        <Link to={`/product/${item._id}`}>
          <div className="product-image">
            <img src={item.image} alt={item.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="product-info">
            <div className="brand-label">WHENEVER</div>
            <div className="product-name">{item.name}</div>
            <div className="product-price">{item.price?.toLocaleString('vi-VN')}₫</div>
            <div className="product-type">{item.marketing?.subtitle || item.category?.name}</div>
          </div>
        </Link>
      </div>
    ));

    return (
      <div className="page-content" style={{ maxWidth: '1180px' }}>
        <h1>Tìm kiếm</h1>
        <div className="search-input-wrap">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            autoFocus
            value={this.state.keyword}
            onChange={(e) => {
              const keyword = e.target.value;
              this.setState({ keyword });
              this.doSearch(keyword);
            }}
          />
        </div>

        {this.state.keyword.trim().length >= 2 && this.state.isSearching ? (
          <>
            <div className="collection-grid" style={{ paddingTop: '30px' }}>
              {Array.from({ length: 4 }, (_, index) => this.renderSkeletonCard(`search-skeleton-${index}`))}
            </div>
            <p className="loading-state-caption">Đang tìm sản phẩm phù hợp...</p>
          </>
        ) : this.state.loadError ? (
          <div className="collection-state-wrap">
            <div className="async-state-panel">
              <div className="async-state-eyebrow">WHENEVER ATELIER</div>
              <h3>Chưa tải được kết quả tìm kiếm</h3>
              <p>{this.state.loadError}</p>
              <button type="button" className="async-state-button" onClick={() => this.doSearch(this.state.keyword)}>
                Thử lại
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="collection-grid" style={{ paddingTop: '30px' }}>
              {results}
            </div>
            {this.state.keyword.trim().length >= 2 && this.state.results.length === 0 ? (
              <p className="empty-message" style={{ padding: '16px 0 0', textAlign: 'center' }}>
                Không tìm thấy sản phẩm phù hợp với từ khóa này.
              </p>
            ) : null}
          </>
        )}
      </div>
    );
  }
}

export default Search;

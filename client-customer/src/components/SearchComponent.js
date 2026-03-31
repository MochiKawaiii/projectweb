import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { enhanceProduct } from '../content/siteContent';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = { keyword: '', results: [] };
  }

  doSearch(keyword) {
    if (keyword.length >= 2) {
      axios
        .get(`/api/customer/products/search/${keyword}`)
        .then((res) => this.setState({ results: res.data.map(enhanceProduct) }));
    } else {
      this.setState({ results: [] });
    }
  }

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
            <div className="product-price">{item.price?.toLocaleString()}₫</div>
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
        <div className="collection-grid" style={{ paddingTop: '30px' }}>{results}</div>
        {this.state.keyword.length >= 2 && this.state.results.length === 0 && (
          <p className="empty-message" style={{ padding: '16px 0 0', textAlign: 'center' }}>
            Không tìm thấy sản phẩm phù hợp với từ khóa này.
          </p>
        )}
      </div>
    );
  }
}

export default Search;

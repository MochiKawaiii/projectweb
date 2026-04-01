import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import withRouter from '../utils/withRouter';
import MyContext from '../contexts/MyContext';
import { SITE_INFO, getProductContent } from '../content/siteContent';

class Header extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      categoriesLoading: true,
      categoriesError: '',
      menuOpen: false,
      searchOpen: false,
      searchText: '',
      cartOpen: false,
      shopSubmenu: false,
      scrolled: false,
    };
  }

  componentDidMount() {
    this.loadCategories();
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const shouldScroll = window.scrollY > 20;
    if (shouldScroll !== this.state.scrolled) {
      this.setState({ scrolled: shouldScroll });
    }
  };

  loadCategories = () => {
    this.setState({ categoriesLoading: true, categoriesError: '' });
    axios
      .get('/api/customer/categories')
      .then((res) =>
        this.setState({
          categories: Array.isArray(res.data) ? res.data : [],
          categoriesLoading: false,
          categoriesError: '',
        })
      )
      .catch(() =>
        this.setState({
          categories: [],
          categoriesLoading: false,
          categoriesError: 'Chưa tải được danh mục. Bạn thử lại sau vài giây nhé.',
        })
      );
  };

  closeSearch = () => this.setState({ searchOpen: false, searchText: '' });

  submitSearch = () => {
    const keyword = this.state.searchText.trim();
    this.closeSearch();
    if (keyword) {
      this.props.navigate(`/product/search/${encodeURIComponent(keyword)}`);
    } else {
      this.props.navigate('/search');
    }
  };

  renderCartItem = (item) => {
    const content = getProductContent(item.product);
    return (
      <div key={item.product._id} className="cart-mini-item">
        <img src={item.product.image} alt={item.product.name} className="cart-mini-image" />
        <div className="cart-mini-copy">
          <div className="cart-mini-title">{item.product.name}</div>
          <div className="cart-mini-price">{item.product.price.toLocaleString()}₫</div>
          <div className="cart-mini-meta">
            {content?.subtitle || item.product.category?.name || 'WHENEVER'} · SL {item.quantity}
          </div>
        </div>
      </div>
    );
  };

  render() {
    const totalCart = this.context.mycart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return (
      <>
        <div className="announcement-bar">{SITE_INFO.announcement}</div>

        <header className={`site-header ${this.state.scrolled ? 'scrolled' : ''}`} id="site-header">
          <div className="header-inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button className="mobile-menu-toggle" aria-label="Menu" onClick={() => this.setState({ menuOpen: true })}>
                <span></span>
                <span></span>
                <span></span>
              </button>
              <nav className="header-nav">
                <Link to="/product/category/all">SHOP</Link>
                <Link to="/pages/about-us">ABOUT</Link>
                <Link to="/pages/philanthropy">WHENEVER CARE</Link>
                <Link to="/pages/faq">FAQ</Link>
              </nav>
            </div>

            <Link to="/home" className="site-logo">
              <img src={SITE_INFO.logo} alt="WHENEVER Atelier" className="logo-img" />
            </Link>

            <div className="header-actions">
              <button id="search-btn" onClick={() => this.setState({ searchOpen: true })}>
                SEARCH
              </button>
              <Link to={this.context.token ? '/myprofile' : '/login'} className="hide-mobile">
                ACCOUNT
              </Link>
              <button id="cart-btn" onClick={() => this.setState({ cartOpen: true })}>
                CART ({this.context.mycart.reduce((sum, item) => sum + item.quantity, 0)})
              </button>
            </div>
          </div>
        </header>

        <div className="search-overlay" style={{ display: this.state.searchOpen ? 'flex' : 'none' }}>
          <div className="search-overlay-inner">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              autoFocus
              value={this.state.searchText}
              onChange={(e) => this.setState({ searchText: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') this.submitSearch();
                if (e.key === 'Escape') this.closeSearch();
              }}
            />
          </div>
          <span className="search-overlay-close" onClick={this.closeSearch}>
            ×
          </span>
        </div>

        <div
          className="cart-overlay"
          style={{ display: this.state.cartOpen ? 'block' : 'none' }}
          onClick={() => this.setState({ cartOpen: false })}
        ></div>
        <div
          className={`cart-drawer ${this.state.cartOpen ? 'open' : ''}`}
          style={{ display: this.state.cartOpen ? 'flex' : 'none', right: this.state.cartOpen ? 0 : '-420px' }}
        >
          <div className="cart-drawer-header">
            <h3>Giỏ hàng</h3>
            <span className="cart-drawer-close" onClick={() => this.setState({ cartOpen: false })}>
              ×
            </span>
          </div>
          <div className="cart-drawer-body">
            <div className="cart-drawer-notice">
              PHÍ SHIP DAO ĐỘNG TỪ 17K - 30K TÙY KHU VỰC VÀ GIÁ TRỊ ĐƠN HÀNG.
            </div>
            {this.context.mycart.length === 0 ? (
              <div className="cart-drawer-empty">Giỏ hàng đang trống</div>
            ) : (
              <div>{this.context.mycart.map(this.renderCartItem)}</div>
            )}
          </div>
          <div className="cart-drawer-footer">
            <div className="cart-drawer-total">
              <span>Tổng cộng</span>
              <span>{totalCart.toLocaleString()}₫</span>
            </div>
            <Link to="/mycart" className="cart-drawer-checkout" onClick={() => this.setState({ cartOpen: false })}>
              Đến trang giỏ hàng
            </Link>
          </div>
        </div>

        <div
          className={`mobile-menu ${this.state.menuOpen ? 'open' : ''}`}
          style={{ display: this.state.menuOpen ? 'flex' : 'none', left: this.state.menuOpen ? '0' : '-300px' }}
        >
          <div className="mobile-menu-header">
            <Link to="/home" className="site-logo" onClick={() => this.setState({ menuOpen: false })}>
              <img src={SITE_INFO.logo} alt="WHENEVER Atelier" className="logo-img" style={{ height: '28px' }} />
            </Link>
            <span className="mobile-menu-close" onClick={() => this.setState({ menuOpen: false })}>
              ×
            </span>
          </div>

          <div className="mobile-menu-nav">
            <a
              href="#!"
              onClick={(e) => {
                e.preventDefault();
                this.setState({ shopSubmenu: !this.state.shopSubmenu });
              }}
            >
              SHOP ▾
            </a>
            <div className="mobile-submenu" style={{ display: this.state.shopSubmenu ? 'block' : 'none' }}>
              <Link to="/product/category/all" onClick={() => this.setState({ menuOpen: false })}>
                TẤT CẢ SẢN PHẨM
              </Link>
              {this.state.categoriesLoading ? <div style={{ padding: '12px 0', color: '#777', fontSize: '12px' }}>Đang tải danh mục...</div> : null}
              {!this.state.categoriesLoading && this.state.categoriesError ? (
                <div style={{ padding: '12px 0' }}>
                  <div style={{ color: '#777', fontSize: '12px', lineHeight: '1.7' }}>{this.state.categoriesError}</div>
                  <button
                    type="button"
                    onClick={this.loadCategories}
                    style={{ marginTop: '10px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}
                  >
                    Thử lại
                  </button>
                </div>
              ) : null}
              {!this.state.categoriesLoading && !this.state.categoriesError
                ? this.state.categories.map((category) => (
                    <Link
                      key={category._id}
                      to={`/product/category/${category._id}`}
                      onClick={() => this.setState({ menuOpen: false })}
                    >
                      {category.name}
                    </Link>
                  ))
                : null}
            </div>
            <Link to="/pages/about-us" onClick={() => this.setState({ menuOpen: false })}>
              ABOUT
            </Link>
            <Link to="/pages/philanthropy" onClick={() => this.setState({ menuOpen: false })}>
              WHENEVER CARE
            </Link>
            <Link to="/pages/faq" onClick={() => this.setState({ menuOpen: false })}>
              FAQ
            </Link>
            <Link to="/pages/lien-he" onClick={() => this.setState({ menuOpen: false })}>
              LIÊN HỆ
            </Link>
          </div>

          <div className="mobile-menu-auth">
            {this.context.token ? (
              <>
                <Link to="/myprofile" onClick={() => this.setState({ menuOpen: false })}>
                  Hồ sơ {this.context.customer?.name}
                </Link>
                <Link to="/myorders" onClick={() => this.setState({ menuOpen: false })}>
                  Đơn hàng
                </Link>
                <button
                  onClick={() => {
                    this.context.logout();
                    this.setState({ menuOpen: false });
                  }}
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    width: '100%',
                    color: '#666',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                  }}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => this.setState({ menuOpen: false })}>
                  Đăng nhập
                </Link>
                <Link to="/signup" onClick={() => this.setState({ menuOpen: false })}>
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(Header);

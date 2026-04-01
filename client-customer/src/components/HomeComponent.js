import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  HOME_COLLECTIONS,
  HOME_COLLECTION_TICKER,
  HOME_EDITORIAL,
  HOME_MEDIA,
  enhanceProduct,
} from '../content/siteContent';

const HOME_RETRY_MESSAGE =
  'Máy chủ đang khởi động hoặc mạng chưa ổn định. Bạn thử lại sau vài giây để tải đầy đủ sản phẩm.';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allProducts: [],
      activeTab: 0,
      isLoadingProducts: true,
      loadError: '',
    };
    this.carouselTrackRef = React.createRef();
  }

  componentDidMount() {
    this.loadProducts();

    const fadeEls = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    fadeEls.forEach((item) => observer.observe(item));
    this.observer = observer;
  }

  componentWillUnmount() {
    if (this.observer) this.observer.disconnect();
  }

  loadProducts = () => {
    this.setState({ isLoadingProducts: true, loadError: '' });
    axios
      .get('/api/customer/products/category/all')
      .then((res) => {
        this.setState({
          allProducts: Array.isArray(res.data) ? res.data.map(enhanceProduct) : [],
          isLoadingProducts: false,
          loadError: '',
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          allProducts: [],
          isLoadingProducts: false,
          loadError: HOME_RETRY_MESSAGE,
        });
      });
  };

  scrollCarousel = (direction) => {
    if (this.carouselTrackRef.current) {
      this.carouselTrackRef.current.scrollBy({ left: direction * 320, behavior: 'smooth' });
    }
  };

  getProductsBySlug = (slug) => {
    return this.state.allProducts.filter((product) => product.category?.slug === slug);
  };

  renderAsyncState = ({ title, copy, compact = false }) => (
    <div className={`async-state-panel ${compact ? 'is-compact' : ''}`}>
      <div className="async-state-eyebrow">WHENEVER ATELIER</div>
      <h3>{title}</h3>
      <p>{copy}</p>
      {!this.state.isLoadingProducts ? (
        <button type="button" className="async-state-button" onClick={this.loadProducts}>
          Thử lại
        </button>
      ) : null}
    </div>
  );

  renderSkeletonCard = (key, carousel = false) => (
    <div key={key} className={carousel ? 'product-card-carousel skeleton-card' : 'product-card skeleton-card'}>
      <div className="product-image skeleton-box"></div>
      <div className="product-info">
        {!carousel ? <div className="skeleton-line skeleton-line-xs"></div> : null}
        <div className="skeleton-line skeleton-line-lg"></div>
        <div className="skeleton-line skeleton-line-sm"></div>
      </div>
    </div>
  );

  renderFeaturedProductSkeleton = (key) => (
    <div key={key} className="featured-product featured-product-skeleton">
      <div className="skeleton-line skeleton-line-lg"></div>
      <div className="skeleton-line skeleton-line-md"></div>
      <div className="skeleton-line skeleton-line-xs"></div>
    </div>
  );

  renderProductCard = (product, carousel = false) => {
    if (carousel) {
      return (
        <div key={product._id} className="product-card-carousel">
          <Link to={`/product/${product._id}`}>
            <div className="product-image">
              <img src={product.image} alt={product.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="product-info">
              <div className="product-name">{product.name}</div>
              <div className="product-category">{product.marketing?.subtitle || product.category?.name || 'WHENEVER'}</div>
            </div>
          </Link>
        </div>
      );
    }

    return (
      <div key={product._id} className="product-card">
        <Link to={`/product/${product._id}`}>
          <div className="product-image">
            <img src={product.image} alt={product.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div className="add-to-cart-overlay">Thêm vào giỏ</div>
          </div>
          <div className="product-info">
            <div className="brand-label">WHENEVER</div>
            <div className="product-name">{product.name}</div>
            <div className="product-price">{product.price?.toLocaleString('vi-VN')}₫</div>
            <div className="product-type">{product.marketing?.subtitle || product.category?.name}</div>
          </div>
        </Link>
      </div>
    );
  };

  renderCarouselContent(products) {
    if (this.state.isLoadingProducts) {
      return (
        <>
          <div className="carousel-track active" ref={this.carouselTrackRef}>
            {Array.from({ length: 4 }, (_, index) => this.renderSkeletonCard(`carousel-skeleton-${index}`, true))}
          </div>
          <div className="loading-state-caption">Đang tải bộ sưu tập nổi bật...</div>
        </>
      );
    }

    if (this.state.loadError) {
      return this.renderAsyncState({
        title: 'Chưa tải được bộ sưu tập',
        copy: this.state.loadError,
      });
    }

    return <div className="carousel-track active" ref={this.carouselTrackRef}>{products.map((product) => this.renderProductCard(product, true))}</div>;
  }

  renderGridContent(products) {
    if (this.state.isLoadingProducts) {
      return (
        <>
          <div className="product-grid">
            {Array.from({ length: 8 }, (_, index) => this.renderSkeletonCard(`grid-skeleton-${index}`))}
          </div>
          <div className="loading-state-caption">Đang tải sản phẩm mới nhất...</div>
        </>
      );
    }

    if (this.state.loadError) {
      return this.renderAsyncState({
        title: 'Chưa tải được sản phẩm',
        copy: this.state.loadError,
      });
    }

    return <div className="product-grid">{products.map((product) => this.renderProductCard(product))}</div>;
  }

  renderFeaturedProducts(products) {
    if (this.state.isLoadingProducts) {
      return Array.from({ length: 2 }, (_, index) => this.renderFeaturedProductSkeleton(`featured-skeleton-${index}`));
    }

    if (this.state.loadError) {
      return this.renderAsyncState({
        title: 'Chưa tải được sản phẩm denim',
        copy: this.state.loadError,
        compact: true,
      });
    }

    return products.map((product) => (
      <div key={product._id} className="featured-product">
        <div className="fp-name">{product.name}</div>
        <div className="fp-desc">{product.marketing?.material || product.marketing?.subtitle || 'Denim capsule by Whenever Atelier'}</div>
        <div className="fp-price">{product.price?.toLocaleString('vi-VN')}₫</div>
      </div>
    ));
  }

  render() {
    const activeCollection = HOME_COLLECTIONS[this.state.activeTab];
    const carouselProducts = this.getProductsBySlug(activeCollection.slug).slice(0, 4);
    const activeProducts = this.getProductsBySlug('whenever-active').slice(0, 8);
    const denimProducts = this.getProductsBySlug('denim').slice(0, 2);
    const disableCarouselNav = this.state.isLoadingProducts || Boolean(this.state.loadError) || carouselProducts.length === 0;

    return (
      <div>
        <section className="hero-section" id="hero">
          <video className="hero-video" autoPlay muted loop playsInline poster={HOME_MEDIA.heroPoster}>
            <source src={HOME_MEDIA.heroVideo} type="video/mp4" />
          </video>
          <div className="hero-overlay"></div>
          <div className="hero-text">
            <img src={HOME_MEDIA.logo || undefined} alt="WHENEVER Atelier" className="hero-logo-img" />
          </div>
          <div className="hero-cta">
            <Link to="/product/category/all">WHENEVER</Link>
          </div>
        </section>

        <section className="carousel-section" id="carousel-section">
          <div className="carousel-tabs" id="carousel-tabs">
            {HOME_COLLECTIONS.map((collection, index) => (
              <div
                key={collection.slug}
                className={`carousel-tab ${this.state.activeTab === index ? 'active' : ''}`}
                onClick={() => this.setState({ activeTab: index })}
              >
                {collection.name}
              </div>
            ))}
          </div>
          <div className="section-header" style={{ padding: '0 40px' }}>
            <div></div>
            <div className="carousel-nav">
              <button aria-label="Previous" disabled={disableCarouselNav} onClick={() => this.scrollCarousel(-1)}>
                ‹
              </button>
              <button aria-label="Next" disabled={disableCarouselNav} onClick={() => this.scrollCarousel(1)}>
                ›
              </button>
            </div>
          </div>

          {this.renderCarouselContent(carouselProducts)}

          <div style={{ textAlign: 'center', padding: '20px 40px 0' }}>
            <Link to={`/product/category/${activeCollection.slug}`} className="buy-now-btn">
              Buy now
            </Link>
          </div>
        </section>

        <section className="marquee-section">
          <div className="marquee-track">
            {Array(10)
              .fill(null)
              .map((_, index) => (
                <span key={index} className="marquee-item">
                  WHENEVER
                </span>
              ))}
          </div>
        </section>

        <section className="category-ticker">
          <div className="category-ticker-track">
            {[...HOME_COLLECTION_TICKER, ...HOME_COLLECTION_TICKER].map((item, index) => (
              <Link key={`${item.slug}-${index}`} className="category-ticker-item" to={`/product/category/${item.slug}`}>
                {item.name}
              </Link>
            ))}
          </div>
        </section>

        <section className="product-grid-section fade-in" id="active-grid">
          <h2 className="section-title">WHENEVER ACTIVE</h2>
          {this.renderGridContent(activeProducts)}
        </section>

        <section className="featured-section fade-in" id="featured">
          <div className="featured-inner">
            <div className="featured-image">
              <img
                src={HOME_MEDIA.slide1}
                alt="Star Washed Denim"
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
              />
            </div>
            <div className="featured-content">
              <h2>{HOME_EDITORIAL.starWashed.title}</h2>
              {HOME_EDITORIAL.starWashed.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {this.renderFeaturedProducts(denimProducts)}
              <Link to={HOME_EDITORIAL.starWashed.cta.to} className="buy-now-btn" style={{ display: 'inline-block' }}>
                {HOME_EDITORIAL.starWashed.cta.label}
              </Link>
            </div>
          </div>
        </section>

        <section className="featured-section fade-in">
          <div className="featured-inner" style={{ direction: 'rtl' }}>
            <div className="featured-image" style={{ direction: 'ltr' }}>
              <img
                src={HOME_MEDIA.slide2}
                alt="Cloudline Collection"
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
              />
            </div>
            <div className="featured-content" style={{ direction: 'ltr' }}>
              <h2>{HOME_EDITORIAL.cloudline.title}</h2>
              {HOME_EDITORIAL.cloudline.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <Link to={HOME_EDITORIAL.cloudline.cta.to} className="buy-now-btn" style={{ display: 'inline-block' }}>
                {HOME_EDITORIAL.cloudline.cta.label}
              </Link>
            </div>
          </div>
        </section>

        <section className="featured-section fade-in">
          <div className="featured-inner">
            <div className="featured-image">
              <img
                src={HOME_MEDIA.wheneverCare}
                alt="Whenever Care"
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
              />
            </div>
            <div className="featured-content">
              <h2>{HOME_EDITORIAL.care.title}</h2>
              {HOME_EDITORIAL.care.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <Link to={HOME_EDITORIAL.care.cta.to} className="buy-now-btn" style={{ display: 'inline-block' }}>
                {HOME_EDITORIAL.care.cta.label}
              </Link>
            </div>
          </div>
        </section>

        <section className="social-section fade-in" id="social">
          <h2>Find Us On Social</h2>
          <div className="social-grid">
            {HOME_MEDIA.ugc.map((url, index) => (
              <a
                key={url}
                className="social-grid-item"
                href="https://www.instagram.com/whenever.atelier/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={url} alt={`@whenever.atelier ${index + 1}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </a>
            ))}
          </div>
        </section>
      </div>
    );
  }
}

export default Home;

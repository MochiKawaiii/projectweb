import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../utils/withRouter';
import MyContext from '../contexts/MyContext';
import { SITE_INFO, enhanceProduct, getProductContent } from '../content/siteContent';

const PRODUCT_DETAIL_RETRY_MESSAGE =
  'Chưa tải được thông tin sản phẩm. Máy chủ có thể đang khởi động lại, bạn thử lại sau ít giây nhé.';

class ProductDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      product: null,
      txtQuantity: 1,
      selectedSize: '',
      selectedColor: '',
      isLoading: true,
      loadError: '',
    };
  }

  componentDidMount() {
    this.apiGetProduct(this.props.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.params.id !== this.props.params.id) {
      this.apiGetProduct(this.props.params.id);
    }
  }

  btnAdd2CartClick = (e, navigateAfter = false) => {
    e.preventDefault();
    const product = this.state.product;
    const quantity = parseInt(this.state.txtQuantity, 10);
    if (!product || !quantity) {
      alert('Vui lòng nhập số lượng');
      return;
    }

    const mycart = [...this.context.mycart];
    const index = mycart.findIndex((item) => item.product._id === product._id);
    if (index === -1) {
      mycart.push({ product, quantity });
    } else {
      mycart[index] = { ...mycart[index], quantity: mycart[index].quantity + quantity };
    }

    this.context.setMycart(mycart);
    if (navigateAfter) {
      this.props.navigate('/checkout');
      return;
    }
    alert('Đã thêm vào giỏ hàng!');
  };

  apiGetProduct(id) {
    this.setState({ isLoading: true, loadError: '' });
    axios
      .get(`/api/customer/products/${id}`)
      .then((res) => {
        const product = enhanceProduct(res.data);
        this.setState({
          product,
          selectedSize: product?.sizes?.[0] || '',
          selectedColor: product?.colors?.[0] || '',
          isLoading: false,
          loadError: '',
          txtQuantity: 1,
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          product: null,
          isLoading: false,
          loadError: PRODUCT_DETAIL_RETRY_MESSAGE,
        });
      });
  }

  renderSizeButtons(prod) {
    if (!prod.sizes || prod.sizes.length === 0) return null;
    return (
      <div className="variant-options">
        <div className="variant-label">Kích thước</div>
        <div className="size-buttons">
          {prod.sizes.map((size) => (
            <button
              key={size}
              className={`size-btn ${this.state.selectedSize === size ? 'active' : ''}`}
              onClick={() => this.setState({ selectedSize: size })}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    );
  }

  renderColorButtons(prod) {
    if (!prod.colors || prod.colors.length === 0) return null;
    return (
      <div className="variant-options">
        <div className="variant-label">Màu sắc</div>
        <div className="size-buttons">
          {prod.colors.map((color) => (
            <button
              key={color}
              className={`size-btn ${this.state.selectedColor === color ? 'active' : ''}`}
              onClick={() => this.setState({ selectedColor: color })}
            >
              {color}
            </button>
          ))}
        </div>
      </div>
    );
  }

  renderDescription(description, fallbackText) {
    return String(description || fallbackText || '')
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => <p key={`${index}-${line}`}>{line}</p>);
  }

  renderLoadingState() {
    return (
      <div className="product-page-wrapper">
        <div className="async-state-inline">
          <div className="async-state-eyebrow">WHENEVER ATELIER</div>
          <h3>Đang tải sản phẩm</h3>
          <p>Máy chủ đang chuẩn bị dữ liệu. Nếu bạn vừa mở web sau một lúc, Render có thể cần thêm vài giây.</p>
        </div>
        <div className="product-page-inner product-page-inner-loading">
          <div className="product-gallery">
            <div className="product-gallery-skeleton skeleton-box"></div>
          </div>
          <div className="product-details-content product-details-skeleton">
            <div className="skeleton-line skeleton-line-xs"></div>
            <div className="skeleton-line skeleton-line-xl"></div>
            <div className="skeleton-line skeleton-line-sm"></div>
            <div className="product-origin-card product-origin-card-skeleton">
              <div className="skeleton-line skeleton-line-lg"></div>
              <div className="skeleton-line skeleton-line-lg"></div>
              <div className="skeleton-line skeleton-line-md"></div>
            </div>
            <div className="variant-options">
              <div className="skeleton-line skeleton-line-xs"></div>
              <div className="size-buttons">
                {Array.from({ length: 4 }, (_, index) => (
                  <div key={`size-skeleton-${index}`} className="size-btn skeleton-pill"></div>
                ))}
              </div>
            </div>
            <div className="product-spec-grid">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={`spec-skeleton-${index}`} className="product-spec-item">
                  <div className="skeleton-line skeleton-line-xs"></div>
                  <div className="skeleton-line skeleton-line-md"></div>
                </div>
              ))}
            </div>
            <div className="add-to-cart-wrapper">
              <div className="quantity-selector skeleton-button-row"></div>
              <div className="btn-add-cart skeleton-button-row"></div>
            </div>
            <div className="btn-buy-now skeleton-button-row"></div>
          </div>
        </div>
      </div>
    );
  }

  renderRetryState() {
    return (
      <div className="product-page-wrapper">
        <div className="async-state-panel async-state-page">
          <div className="async-state-eyebrow">WHENEVER ATELIER</div>
          <h3>Chưa tải được sản phẩm</h3>
          <p>{this.state.loadError}</p>
          <button type="button" className="async-state-button" onClick={() => this.apiGetProduct(this.props.params.id)}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  render() {
    const prod = this.state.product;

    if (this.state.isLoading) return this.renderLoadingState();
    if (!prod && this.state.loadError) return this.renderRetryState();
    if (!prod) return null;

    const marketing = getProductContent(prod) || {};
    const categoryName = prod.category?.name || 'WHENEVER ATELIER';
    const detailItems = marketing.details || [];
    const noteItems = marketing.notes || [];

    return (
      <div className="product-page-wrapper">
        <div className="product-page-inner">
          <div className="product-gallery">
            <img src={prod.image} alt={prod.name} className="gallery-main-img" />
          </div>

          <div className="product-details-content">
            <div className="breadcrumb">Trang chủ / {categoryName} / {prod.name}</div>
            <h1 className="product-title">{prod.name}</h1>
            <div className="product-price-wrapper">
              <span className="current-price">{prod.price?.toLocaleString('vi-VN')}₫</span>
            </div>

            <div className="product-origin-card">
              <p>
                <strong>Xuất xứ:</strong> {marketing.origin || 'Việt Nam'}
              </p>
              <p>
                <strong>Phân phối bởi:</strong> {marketing.distributor || SITE_INFO.companyName}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {marketing.address || SITE_INFO.address}
              </p>
            </div>

            {this.renderSizeButtons(prod)}
            {this.renderColorButtons(prod)}

            <div className="product-spec-grid">
              <div className="product-spec-item">
                <span>Chất liệu</span>
                <strong>{marketing.material || 'Đang cập nhật'}</strong>
              </div>
              <div className="product-spec-item">
                <span>Định lượng</span>
                <strong>{marketing.weight || 'Đang cập nhật'}</strong>
              </div>
              <div className="product-spec-item">
                <span>Phom dáng</span>
                <strong>{marketing.subtitle || categoryName}</strong>
              </div>
            </div>

            <div className="add-to-cart-wrapper">
              <div className="quantity-selector">
                <button onClick={() => this.setState({ txtQuantity: Math.max(1, this.state.txtQuantity - 1) })}>-</button>
                <input type="text" value={this.state.txtQuantity} readOnly />
                <button onClick={() => this.setState({ txtQuantity: this.state.txtQuantity + 1 })}>+</button>
              </div>
              <button className="btn-add-cart" onClick={(e) => this.btnAdd2CartClick(e, false)}>
                THÊM VÀO GIỎ
              </button>
            </div>
            <button className="btn-buy-now" onClick={(e) => this.btnAdd2CartClick(e, true)}>
              MUA NGAY
            </button>

            <div className="product-accordions">
              <details open>
                <summary>Mô tả sản phẩm</summary>
                <div className="details-content">
                  {this.renderDescription(
                    prod.description,
                    'Whenever Atelier phát triển sản phẩm theo tinh thần tối giản, chỉn chu và dễ mặc trong nhiều ngữ cảnh đời sống.'
                  )}
                  {marketing.form ? <p>{marketing.form}</p> : null}
                </div>
              </details>

              <details>
                <summary>Thông tin chi tiết</summary>
                <div className="details-content">
                  <ul className="detail-list">
                    {detailItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </details>

              <details>
                <summary>Lưu ý sử dụng</summary>
                <div className="details-content">
                  <ul className="detail-list">
                    {noteItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </details>

              <details>
                <summary>Chính sách đổi trả</summary>
                <div className="details-content">
                  <p>Khách hàng gửi lại sản phẩm trong vòng 3 ngày với đơn nội thành và 7 ngày với đơn ngoại thành kể từ ngày nhận hàng.</p>
                  <p>Sản phẩm cần còn tag, bao bì, hóa đơn và chưa qua sử dụng để Whenever Atelier có thể hỗ trợ nhanh nhất.</p>
                </div>
              </details>

              <details>
                <summary>Giao hàng và thanh toán</summary>
                <div className="details-content">
                  <p>Website hiện ưu tiên COD. Nếu cần hỗ trợ thanh toán trước hoặc xử lý đơn riêng, bạn có thể liên hệ đội ngũ hỗ trợ qua email hoặc mạng xã hội chính thức.</p>
                  <p>Phí ship dao động tùy khu vực và giá trị đơn hàng, sẽ được xác nhận tại bước chốt đơn.</p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ProductDetail);

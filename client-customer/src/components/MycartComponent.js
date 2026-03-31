import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';
import withRouter from '../utils/withRouter';

class Mycart extends Component {
  static contextType = MyContext;

  lnkRemoveClick(id) {
    const mycart = [...this.context.mycart];
    const index = mycart.findIndex((x) => x.product._id === id);
    if (index !== -1) {
      mycart.splice(index, 1);
      this.context.setMycart(mycart);
    }
  }

  updateQuantity(id, delta) {
    const mycart = [...this.context.mycart];
    const index = mycart.findIndex((x) => x.product._id === id);
    if (index !== -1) {
      mycart[index].quantity += delta;
      if (mycart[index].quantity <= 0) {
        mycart.splice(index, 1);
      }
      this.context.setMycart(mycart);
    }
  }

  lnkCheckoutClick() {
    if (this.context.mycart.length === 0) {
      alert('Giỏ hàng trống');
      return;
    }
    if (this.context.customer) {
      this.props.navigate('/checkout');
    } else {
      this.props.navigate('/login');
    }
  }

  render() {
    if (this.context.mycart.length === 0) {
      return (
        <div className="page-content" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '24px', borderBottom: '1px solid #ddd', paddingBottom: '12px' }}>Giỏ hàng của bạn</h1>
          <p style={{ marginBottom: '24px' }}>Giỏ hàng của bạn đang trống.</p>
          <Link to="/product/category/all" className="buy-now-btn" style={{ display: 'inline-block' }}>
            Tiếp tục mua sắm
          </Link>
        </div>
      );
    }

    const items = this.context.mycart.map((item) => (
      <div key={item.product._id} style={{ display: 'flex', padding: '16px 0', borderBottom: '1px solid #eee', textAlign: 'left' }}>
        <img src={item.product.image} alt={item.product.name} style={{ width: '100px', height: '120px', objectFit: 'cover', background: '#f5f5f5' }} />
        <div style={{ flex: 1, paddingLeft: '16px' }}>
          <Link to={`/product/${item.product._id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
            <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>{item.product.name}</div>
          </Link>
          <div style={{ color: '#888', fontSize: '13px' }}>{item.product.price?.toLocaleString('vi-VN')}₫</div>
          <div style={{ fontSize: '13px', color: '#666', margin: '8px 0' }}>Phân loại: WHENEVER STOREFRONT</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
            <div style={{ border: '1px solid #ddd', display: 'inline-flex' }}>
              <button onClick={() => this.updateQuantity(item.product._id, -1)} style={{ width: '30px', height: '30px', background: 'none', border: 'none', cursor: 'pointer' }}>-</button>
              <input type="text" value={item.quantity} readOnly style={{ width: '40px', textAlign: 'center', border: 'none', borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd' }} />
              <button onClick={() => this.updateQuantity(item.product._id, 1)} style={{ width: '30px', height: '30px', background: 'none', border: 'none', cursor: 'pointer' }}>+</button>
            </div>
            <button onClick={() => this.lnkRemoveClick(item.product._id)} style={{ color: '#000', textDecoration: 'underline', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer' }}>Xóa</button>
          </div>
        </div>
      </div>
    ));

    return (
      <div className="page-content" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '24px' }}>
        <h1 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '24px', borderBottom: '1px solid #ddd', paddingBottom: '12px' }}>Giỏ hàng của bạn</h1>
        <div style={{ background: '#f9f9f9', padding: '12px', fontSize: '13px', textAlign: 'center', marginBottom: '24px', fontWeight: '500' }}>
          PHÍ SHIP DAO ĐỘNG TỪ 17K - 30K TÙY KHU VỰC VÀ GIÁ TRỊ ĐƠN HÀNG
        </div>

        {items}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid #ddd', marginTop: '24px', fontSize: '18px', fontWeight: 'bold' }}>
          <span>TỔNG CỘNG:</span>
          <span>{CartUtil.getTotal(this.context.mycart).toLocaleString('vi-VN')}₫</span>
        </div>
        <p style={{ color: '#666', fontSize: '13px', margin: '12px 0 24px', textAlign: 'right' }}>Phí vận chuyển sẽ được xác nhận ở trang thanh toán.</p>

        <button className="buy-now-btn" style={{ width: '100%', marginBottom: '40px' }} onClick={() => this.lnkCheckoutClick()}>
          THANH TOÁN
        </button>
      </div>
    );
  }
}

export default withRouter(Mycart);

import React from 'react';
import { Link } from 'react-router-dom';

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `${amount.toLocaleString('vi-VN')}đ`;
};

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('vi-VN');
};

const getStatusClassName = (status) => {
  if (status === 'APPROVED') return 'status-badge is-approved';
  if (status === 'CANCELED') return 'status-badge is-canceled';
  return 'status-badge is-pending';
};

const getAddressText = (order) => {
  const shipping = order?.shipping || {};
  const parts = [shipping.addressLine, shipping.region, shipping.country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : '-';
};

function OrderHistorySection({
  orders = [],
  selectedOrder = null,
  onSelectOrder = () => {},
  title = 'Đơn hàng của tôi',
  subtitle = 'Theo dõi tình trạng xử lý và xem lại thông tin giao hàng của từng đơn.',
  showStandaloneLink = false,
  isLoading = false,
}) {
  const orderRows = orders.map((item) => (
    <tr
      key={item._id}
      className={selectedOrder?._id === item._id ? 'is-selected' : ''}
      onClick={() => onSelectOrder(item)}
    >
      <td>{item._id.substring(0, 8)}...</td>
      <td>{formatDate(item.cdate)}</td>
      <td>{formatCurrency(item.total)}</td>
      <td>
        <span className={getStatusClassName(item.status)}>{item.status}</span>
      </td>
    </tr>
  ));

  const selectedItems = Array.isArray(selectedOrder?.items) ? selectedOrder.items : [];

  return (
    <section className="account-orders-section">
      <div className="account-section-heading">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        {showStandaloneLink ? (
          <Link className="account-section-link" to="/myorders">
            Mở trang đơn hàng riêng
          </Link>
        ) : null}
      </div>

      {isLoading ? (
        <div className="account-orders-empty">Đang tải danh sách đơn hàng của bạn...</div>
      ) : orders.length === 0 ? (
        <div className="account-orders-empty">
          Bạn chưa có đơn hàng nào. Khi đặt hàng thành công, lịch sử đơn sẽ hiện ở đây.
        </div>
      ) : (
        <>
          <div className="account-orders-table-wrap">
            <table className="account-orders-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Ngày đặt</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>{orderRows}</tbody>
            </table>
          </div>

          {selectedOrder ? (
            <div className="account-order-detail">
              <div className="account-order-summary">
                <article className="account-order-card">
                  <h3>Thông tin giao hàng</h3>
                  <div className="account-order-meta">
                    <div className="account-order-meta-row">
                      <span>Người nhận</span>
                      <strong>{selectedOrder.shipping?.fullName || selectedOrder.customer?.name || '-'}</strong>
                    </div>
                    <div className="account-order-meta-row">
                      <span>Số điện thoại</span>
                      <strong>{selectedOrder.shipping?.phone || selectedOrder.customer?.phone || '-'}</strong>
                    </div>
                    <div className="account-order-meta-row">
                      <span>Email</span>
                      <strong>{selectedOrder.shipping?.email || selectedOrder.customer?.email || '-'}</strong>
                    </div>
                    <div className="account-order-meta-row">
                      <span>Địa chỉ</span>
                      <strong>{getAddressText(selectedOrder)}</strong>
                    </div>
                  </div>
                </article>

                <article className="account-order-card">
                  <h3>Chi tiết đơn hàng</h3>
                  <div className="account-order-meta">
                    <div className="account-order-meta-row">
                      <span>Trạng thái</span>
                      <strong className={getStatusClassName(selectedOrder.status)}>{selectedOrder.status}</strong>
                    </div>
                    <div className="account-order-meta-row">
                      <span>Thanh toán</span>
                      <strong>{selectedOrder.payment?.label || selectedOrder.payment?.method || 'COD'}</strong>
                    </div>
                    <div className="account-order-meta-row">
                      <span>Giao hàng</span>
                      <strong>{selectedOrder.shipping?.shippingMethod || 'Giao hàng tận nơi'}</strong>
                    </div>
                    <div className="account-order-meta-row">
                      <span>Ghi chú</span>
                      <strong>{selectedOrder.note || '-'}</strong>
                    </div>
                    <div className="account-order-meta-row">
                      <span>Tổng cộng</span>
                      <strong>{formatCurrency(selectedOrder.total)}</strong>
                    </div>
                  </div>
                </article>
              </div>

              <div className="account-order-items">
                <table className="account-order-items-table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Sản phẩm</th>
                      <th>Đơn giá</th>
                      <th>Số lượng</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItems.map((item, index) => (
                      <tr key={`${selectedOrder._id}-${index}`}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="account-order-product">
                            <img src={item.product?.image} alt={item.product?.name || 'Product'} />
                            <div>
                              <strong>{item.product?.name || 'Sản phẩm'}</strong>
                            </div>
                          </div>
                        </td>
                        <td>{formatCurrency(item.product?.price)}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(Number(item.product?.price || 0) * Number(item.quantity || 0))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

export default OrderHistorySection;

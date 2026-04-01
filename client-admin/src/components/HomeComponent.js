import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

const DASHBOARD_LOAD_ERROR =
  'Khong tai duoc dashboard luc nay. May chu co the dang khoi dong lai, ban thu lai sau vai giay nhe.';

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('vi-VN')}d`;

class Home extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      stats: null,
      recentOrders: [],
      isLoading: true,
      loadError: '',
    };
  }

  componentDidMount() {
    this.apiGetDashboard();
  }

  apiGetDashboard = () => {
    const config = { headers: { 'x-access-token': this.context.token } };
    this.setState({ isLoading: true, loadError: '' });
    axios
      .get('/api/admin/dashboard/summary', config)
      .then((res) => {
        this.setState({
          stats: res.data?.stats || null,
          recentOrders: Array.isArray(res.data?.recentOrders) ? res.data.recentOrders : [],
          isLoading: false,
          loadError: '',
        });
      })
      .catch(() => {
        this.setState({
          stats: null,
          recentOrders: [],
          isLoading: false,
          loadError: DASHBOARD_LOAD_ERROR,
        });
      });
  };

  renderStatSkeletons() {
    return Array.from({ length: 8 }, (_, index) => (
      <article key={`dashboard-skeleton-${index}`} className="admin-dashboard-card is-skeleton">
        <div className="admin-skeleton-line is-short"></div>
        <div className="admin-skeleton-line is-medium"></div>
        <div className="admin-skeleton-line is-long"></div>
      </article>
    ));
  }

  renderRecentOrderSkeletons() {
    return Array.from({ length: 5 }, (_, index) => (
      <tr key={`recent-order-skeleton-${index}`} className="admin-skeleton-table">
        <td><div className="admin-skeleton-line is-medium"></div></td>
        <td><div className="admin-skeleton-line is-medium"></div></td>
        <td><div className="admin-skeleton-line is-long"></div></td>
        <td><div className="admin-skeleton-line is-short"></div></td>
        <td><div className="admin-skeleton-line is-short"></div></td>
      </tr>
    ));
  }

  render() {
    const stats = this.state.stats || {};
    const statCards = [
      { label: 'Doanh thu xac nhan', value: formatCurrency(stats.totalRevenue), tone: 'is-dark' },
      { label: 'Tong don hang', value: Number(stats.totalOrders || 0).toLocaleString('vi-VN') },
      { label: 'Don cho xac nhan', value: Number(stats.pendingOrders || 0).toLocaleString('vi-VN'), tone: 'is-pending' },
      { label: 'Don da duyet', value: Number(stats.approvedOrders || 0).toLocaleString('vi-VN'), tone: 'is-approved' },
      { label: 'Don dang giao', value: Number(stats.shippingOrders || 0).toLocaleString('vi-VN'), tone: 'is-shipping' },
      { label: 'Don hoan tat', value: Number(stats.deliveredOrders || 0).toLocaleString('vi-VN'), tone: 'is-delivered' },
      { label: 'Khach hang', value: Number(stats.totalCustomers || 0).toLocaleString('vi-VN') },
      { label: 'San pham / Danh muc', value: `${Number(stats.totalProducts || 0).toLocaleString('vi-VN')} / ${Number(stats.totalCategories || 0).toLocaleString('vi-VN')}` },
    ];

    return (
      <div className="admin-dashboard">
        <section className="admin-dashboard-hero">
          <div>
            <span className="admin-dashboard-eyebrow">Whenever Atelier</span>
            <h1>Dashboard quan tri cua ban</h1>
            <p>Theo doi nhanh tinh hinh don hang, khach hang va doanh thu ngay trong mot man hinh.</p>
          </div>
          <div className="admin-dashboard-hero-meta">
            <span className="admin-status-pill is-approved">
              {Number(stats.activeCustomers || 0).toLocaleString('vi-VN')} khach dang kich hoat
            </span>
            <span className="admin-status-pill is-canceled">
              {Number(stats.canceledOrders || 0).toLocaleString('vi-VN')} don da huy
            </span>
          </div>
        </section>

        {this.state.loadError ? (
          <div className="admin-async-state">
            <h3>Chua tai duoc dashboard</h3>
            <p>{this.state.loadError}</p>
            <button type="button" className="admin-async-button" onClick={this.apiGetDashboard}>
              Thu lai
            </button>
          </div>
        ) : (
          <>
            <section className="admin-dashboard-grid">
              {this.state.isLoading
                ? this.renderStatSkeletons()
                : statCards.map((item) => (
                  <article key={item.label} className={`admin-dashboard-card ${item.tone || ''}`}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </article>
                ))}
            </section>

            <section className="admin-dashboard-panel">
              <div className="admin-dashboard-panel-header">
                <div>
                  <h2 className="section-title">Don hang gan day</h2>
                  <p>Theo doi nhanh cac don moi de xu ly dung thu tu.</p>
                </div>
                <button type="button" className="admin-async-button" onClick={this.apiGetDashboard}>
                  Lam moi
                </button>
              </div>

              <table className="datatable">
                <tbody>
                  <tr>
                    <th>ID</th>
                    <th>Ngay tao</th>
                    <th>Khach hang</th>
                    <th>Tong tien</th>
                    <th>Trang thai</th>
                  </tr>
                  {this.state.isLoading ? this.renderRecentOrderSkeletons() : this.state.recentOrders.map((item) => (
                    <tr key={item._id}>
                      <td>{item._id.substring(0, 8)}...</td>
                      <td>{new Date(item.cdate).toLocaleString('vi-VN')}</td>
                      <td>{item.shipping?.fullName || item.customer?.name || item.customer?.email || '-'}</td>
                      <td>{formatCurrency(item.total)}</td>
                      <td>
                        <span className={`admin-status-pill ${`is-${String(item.status || 'pending').toLowerCase()}`}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}
      </div>
    );
  }
}

export default Home;

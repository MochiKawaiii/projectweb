import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

const DASHBOARD_LOAD_ERROR =
  'Unable to load the dashboard right now. The server may still be waking up. Please try again in a few seconds.';

const STATUS_LABELS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  SHIPPING: 'Shipping',
  DELIVERED: 'Delivered',
  CANCELED: 'Canceled',
};

const REVENUE_STATUSES = new Set(['APPROVED', 'SHIPPING', 'DELIVERED']);

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('en-US')}₫`;
const formatNumber = (value) => Number(value || 0).toLocaleString('en-US');
const normalizeOrders = (payload) => (Array.isArray(payload) ? payload : []);
const normalizeStatsPayload = (payload) => (payload && typeof payload === 'object' ? payload.stats || null : null);

const createEmptyStats = () => ({
  totalRevenue: 0,
  totalOrders: 0,
  pendingOrders: 0,
  approvedOrders: 0,
  shippingOrders: 0,
  deliveredOrders: 0,
  canceledOrders: 0,
  totalProducts: 0,
  totalCustomers: 0,
  activeCustomers: 0,
  totalCategories: 0,
});

const sortOrdersByDate = (orders) => [...orders].sort((a, b) => Number(b?.cdate || 0) - Number(a?.cdate || 0));

const buildFallbackDashboard = ({ orders, customers, categories, products }) => {
  const stats = createEmptyStats();
  const normalizedOrders = sortOrdersByDate(normalizeOrders(orders));
  const normalizedCustomers = Array.isArray(customers) ? customers : [];
  const normalizedCategories = Array.isArray(categories) ? categories : [];
  const normalizedProducts = Array.isArray(products) ? products : [];

  normalizedOrders.forEach((item) => {
    const status = String(item?.status || 'PENDING').toUpperCase();
    stats.totalOrders += 1;

    if (status === 'PENDING') stats.pendingOrders += 1;
    if (status === 'APPROVED') stats.approvedOrders += 1;
    if (status === 'SHIPPING') stats.shippingOrders += 1;
    if (status === 'DELIVERED') stats.deliveredOrders += 1;
    if (status === 'CANCELED') stats.canceledOrders += 1;

    if (REVENUE_STATUSES.has(status)) {
      stats.totalRevenue += Number(item?.total || 0);
    }
  });

  stats.totalCustomers = normalizedCustomers.length;
  stats.activeCustomers = normalizedCustomers.filter((item) => Number(item?.active || 0) === 1).length;
  stats.totalCategories = normalizedCategories.length;
  stats.totalProducts = normalizedProducts.length;

  return {
    stats,
    recentOrders: normalizedOrders.slice(0, 6),
  };
};

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

  getStatusLabel = (status) => {
    const normalizedStatus = String(status || 'PENDING').toUpperCase();
    return STATUS_LABELS[normalizedStatus] || normalizedStatus;
  };

  loadDashboardFallback = async (config) => {
    const results = await Promise.allSettled([
      axios.get('/api/admin/orders', config),
      axios.get('/api/admin/customers', config),
      axios.get('/api/admin/categories', config),
      axios.get('/api/customer/products/category/all'),
    ]);

    const [ordersResult, customersResult, categoriesResult, productsResult] = results;
    const hasSuccess = results.some((item) => item.status === 'fulfilled');

    if (!hasSuccess) {
      throw new Error('Fallback dashboard endpoints are unavailable.');
    }

    return buildFallbackDashboard({
      orders: ordersResult.status === 'fulfilled' ? ordersResult.value?.data : [],
      customers: customersResult.status === 'fulfilled' ? customersResult.value?.data : [],
      categories: categoriesResult.status === 'fulfilled' ? categoriesResult.value?.data : [],
      products: productsResult.status === 'fulfilled' ? productsResult.value?.data : [],
    });
  };

  apiGetDashboard = () => {
    const config = { headers: { 'x-access-token': this.context.token } };
    this.setState({ isLoading: true, loadError: '' });

    axios
      .get('/api/admin/dashboard/summary', config)
      .then((res) => {
        this.setState({
          stats: normalizeStatsPayload(res.data),
          recentOrders: Array.isArray(res.data?.recentOrders) ? res.data.recentOrders : [],
          isLoading: false,
          loadError: '',
        });
      })
      .catch(async () => {
        try {
          const fallbackData = await this.loadDashboardFallback(config);
          this.setState({
            stats: fallbackData.stats,
            recentOrders: fallbackData.recentOrders,
            isLoading: false,
            loadError: '',
          });
        } catch (fallbackError) {
          this.setState({
            stats: null,
            recentOrders: [],
            isLoading: false,
            loadError: DASHBOARD_LOAD_ERROR,
          });
        }
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
      { label: 'Confirmed revenue', value: formatCurrency(stats.totalRevenue), tone: 'is-dark' },
      { label: 'Total orders', value: formatNumber(stats.totalOrders) },
      { label: 'Pending orders', value: formatNumber(stats.pendingOrders), tone: 'is-pending' },
      { label: 'Approved orders', value: formatNumber(stats.approvedOrders), tone: 'is-approved' },
      { label: 'Orders in shipping', value: formatNumber(stats.shippingOrders), tone: 'is-shipping' },
      { label: 'Delivered orders', value: formatNumber(stats.deliveredOrders), tone: 'is-delivered' },
      { label: 'Customers', value: formatNumber(stats.totalCustomers) },
      { label: 'Products / Categories', value: `${formatNumber(stats.totalProducts)} / ${formatNumber(stats.totalCategories)}` },
    ];

    return (
      <div className="admin-dashboard">
        <section className="admin-dashboard-hero">
          <div>
            <span className="admin-dashboard-eyebrow">Whenever Atelier</span>
            <h1>Your admin dashboard</h1>
            <p>Track orders, customers, and revenue at a glance from one place.</p>
          </div>
          <div className="admin-dashboard-hero-meta">
            <span className="admin-status-pill is-approved">
              {formatNumber(stats.activeCustomers)} active customers
            </span>
            <span className="admin-status-pill is-canceled">
              {formatNumber(stats.canceledOrders)} canceled orders
            </span>
          </div>
        </section>

        {this.state.loadError ? (
          <div className="admin-async-state">
            <h3>Dashboard unavailable</h3>
            <p>{this.state.loadError}</p>
            <button type="button" className="admin-async-button" onClick={this.apiGetDashboard}>
              Retry
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
                  <h2 className="section-title">Recent orders</h2>
                  <p>Keep an eye on the latest orders so you can process them in the right order.</p>
                </div>
                <button type="button" className="admin-async-button" onClick={this.apiGetDashboard}>
                  Refresh
                </button>
              </div>

              <table className="datatable">
                <tbody>
                  <tr>
                    <th>ID</th>
                    <th>Created at</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                  {this.state.isLoading ? this.renderRecentOrderSkeletons() : this.state.recentOrders.map((item) => (
                    <tr key={item._id}>
                      <td>{item._id.substring(0, 8)}...</td>
                      <td>{new Date(item.cdate).toLocaleString('en-US')}</td>
                      <td>{item.shipping?.fullName || item.customer?.name || item.customer?.email || '-'}</td>
                      <td>{formatCurrency(item.total)}</td>
                      <td>
                        <span className={`admin-status-pill ${`is-${String(item.status || 'pending').toLowerCase()}`}`}>
                          {this.getStatusLabel(item.status)}
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

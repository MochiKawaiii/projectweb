import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CategoryDetail from './CategoryDetailComponent';

const CATEGORY_LOAD_ERROR =
  'Không tải được danh sách danh mục. Máy chủ có thể đang khởi động lại, bạn thử lại sau vài giây nhé.';

class Category extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      itemSelected: null,
      isLoading: true,
      loadError: '',
    };
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  trItemClick(item) {
    this.setState({ itemSelected: item });
  }

  updateCategories = (categories) => {
    this.setState({
      categories,
      isLoading: false,
      loadError: '',
    });
  };

  apiGetCategories = () => {
    const config = { headers: { 'x-access-token': this.context.token } };
    this.setState({ isLoading: true, loadError: '' });
    axios
      .get('/api/admin/categories', config)
      .then((res) => {
        this.setState({
          categories: Array.isArray(res.data) ? res.data : [],
          isLoading: false,
          loadError: '',
        });
      })
      .catch(() => {
        this.setState({
          categories: [],
          isLoading: false,
          loadError: CATEGORY_LOAD_ERROR,
        });
      });
  };

  renderSkeletonRows() {
    return Array.from({ length: 6 }, (_, index) => (
      <tr key={`category-skeleton-${index}`} className="admin-skeleton-table">
        <td><div className="admin-skeleton-line is-medium"></div></td>
        <td><div className="admin-skeleton-line is-long"></div></td>
        <td><div className="admin-skeleton-line is-medium"></div></td>
      </tr>
    ));
  }

  render() {
    const cates = this.state.categories.map((item) => {
      return (
        <tr key={item._id} className="datatable" onClick={() => this.trItemClick(item)}>
          <td>{item._id}</td>
          <td>{item.name}</td>
          <td>{item.slug}</td>
        </tr>
      );
    });

    return (
      <div className="admin-content">
        <div className="list-panel">
          <h2 className="section-title">Category List</h2>
          {this.state.loadError ? (
            <div className="admin-async-state">
              <h3>Chưa tải được danh mục</h3>
              <p>{this.state.loadError}</p>
              <button type="button" className="admin-async-button" onClick={this.apiGetCategories}>
                Thử lại
              </button>
            </div>
          ) : (
            <table className="datatable">
              <tbody>
                <tr><th>ID</th><th>Name</th><th>Slug</th></tr>
                {this.state.isLoading ? this.renderSkeletonRows() : cates}
              </tbody>
            </table>
          )}
        </div>
        <CategoryDetail item={this.state.itemSelected} updateCategories={this.updateCategories} />
      </div>
    );
  }
}

export default Category;

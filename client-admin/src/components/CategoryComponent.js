import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CategoryDetail from './CategoryDetailComponent';

class Category extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = { categories: [], itemSelected: null };
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
          <table className="datatable">
            <tbody>
              <tr><th>ID</th><th>Name</th><th>Slug</th></tr>
              {cates}
            </tbody>
          </table>
        </div>
        <CategoryDetail item={this.state.itemSelected} updateCategories={this.updateCategories} />
      </div>
    );
  }
  componentDidMount() { this.apiGetCategories(); }
  trItemClick(item) { this.setState({ itemSelected: item }); }
  updateCategories = (categories) => { this.setState({ categories: categories }); }
  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }
}
export default Category;

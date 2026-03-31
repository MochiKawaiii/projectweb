import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class CategoryDetail extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = { txtID: '', txtName: '', txtSlug: '' };
  }
  render() {
    return (
      <div className="detail-panel">
        <h2 className="section-title">Category Detail</h2>
        <form>
          <table><tbody>
            <tr><td>ID</td><td><input type="text" value={this.state.txtID} readOnly={true} /></td></tr>
            <tr><td>Name</td><td><input type="text" value={this.state.txtName} onChange={(e) => this.setState({ txtName: e.target.value })} /></td></tr>
            <tr><td>Slug</td><td><input type="text" value={this.state.txtSlug} onChange={(e) => this.setState({ txtSlug: e.target.value })} /></td></tr>
            <tr><td></td><td>
              <input type="submit" value="ADD NEW" onClick={(e) => this.btnAddClick(e)} />
              <input type="submit" value="UPDATE" onClick={(e) => this.btnUpdateClick(e)} />
              <input type="submit" value="DELETE" onClick={(e) => this.btnDeleteClick(e)} />
            </td></tr>
          </tbody></table>
        </form>
      </div>
    );
  }
  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item && this.props.item) {
      this.setState({ txtID: this.props.item._id, txtName: this.props.item.name, txtSlug: this.props.item.slug || '' });
    }
  }
  btnAddClick(e) {
    e.preventDefault();
    const name = this.state.txtName;
    if (name) {
      const cate = { name: name, slug: this.state.txtSlug || name.toLowerCase().replace(/\s+/g, '-') };
      this.apiPostCategory(cate);
    } else { alert('Please input name'); }
  }
  btnUpdateClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const name = this.state.txtName;
    if (id && name) {
      const cate = { name: name, slug: this.state.txtSlug };
      this.apiPutCategory(id, cate);
    } else { alert('Please input id and name'); }
  }
  btnDeleteClick(e) {
    e.preventDefault();
    if (window.confirm('ARE YOU SURE?')) {
      const id = this.state.txtID;
      if (id) { this.apiDeleteCategory(id); }
      else { alert('Please input id'); }
    }
  }
  apiPostCategory(cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/categories', cate, config).then((res) => {
      const result = res.data;
      if (result) { alert('OK BABY!'); this.apiGetCategories(); }
      else { alert('SORRY BABY!'); }
    });
  }
  apiPutCategory(id, cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/categories/' + id, cate, config).then((res) => {
      const result = res.data;
      if (result) { alert('OK BABY!'); this.apiGetCategories(); }
      else { alert('SORRY BABY!'); }
    });
  }
  apiDeleteCategory(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete('/api/admin/categories/' + id, config).then((res) => {
      const result = res.data;
      if (result) { alert('OK BABY!'); this.apiGetCategories(); }
      else { alert('SORRY BABY!'); }
    });
  }
  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      const result = res.data;
      this.props.updateCategories(result);
    });
  }
}
export default CategoryDetail;

import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class ProductDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.fileInputRef = React.createRef();
    this.state = {
      categories: [],
      txtID: '',
      txtName: '',
      txtSlug: '',
      txtPrice: 0,
      txtImage: '',
      txtDescription: '',
      cmbCategory: '',
      selectedImageName: '',
      imageError: '',
      loadingCategories: true,
      categoryLoadError: '',
    };
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item && this.props.item) {
      this.setState({
        txtID: this.props.item._id,
        txtName: this.props.item.name,
        txtSlug: this.props.item.slug || '',
        txtPrice: this.props.item.price,
        txtImage: this.props.item.image || '',
        txtDescription: this.props.item.description || '',
        cmbCategory: this.props.item.category?._id || '',
        selectedImageName: '',
        imageError: '',
      });
      if (this.fileInputRef.current) this.fileInputRef.current.value = '';
    }
  }

  handleImageUrlChange = (e) => {
    this.setState({
      txtImage: e.target.value,
      selectedImageName: '',
      imageError: '',
    });
    if (this.fileInputRef.current) this.fileInputRef.current.value = '';
  };

  handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      this.setState({ selectedImageName: '', imageError: '' });
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.setState({
        imageError: 'Please choose an image file.',
        selectedImageName: '',
      });
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.setState({
        txtImage: String(reader.result || ''),
        selectedImageName: file.name,
        imageError: '',
      });
    };
    reader.onerror = () => {
      this.setState({
        imageError: 'Cannot read this image file.',
        selectedImageName: '',
      });
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  buildProductPayload() {
    const { txtName, txtSlug, txtPrice, txtImage, cmbCategory, txtDescription } = this.state;
    const normalizedImage = txtImage.trim();
    return {
      name: txtName,
      slug: txtSlug,
      price: parseInt(txtPrice, 10),
      image: normalizedImage,
      images: normalizedImage ? [normalizedImage] : [],
      category: cmbCategory,
      description: txtDescription,
    };
  }

  btnAddClick(e) {
    e.preventDefault();
    const { txtName, txtPrice, cmbCategory } = this.state;
    if (txtName && txtPrice && cmbCategory) {
      this.apiPostProduct(this.buildProductPayload());
    } else {
      alert('Please input name, price, and category');
    }
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const { txtID, txtName, txtPrice, cmbCategory } = this.state;
    if (txtID && txtName && txtPrice && cmbCategory) {
      this.apiPutProduct(txtID, this.buildProductPayload());
    } else {
      alert('Please fill all required fields');
    }
  }

  btnDeleteClick(e) {
    e.preventDefault();
    if (window.confirm('ARE YOU SURE?')) {
      const id = this.state.txtID;
      if (id) this.apiDeleteProduct(id);
    }
  }

  apiPostProduct(prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/products', prod, config).then((res) => {
      if (res.data) {
        alert('OK BABY!');
        this.apiGetProducts();
      } else {
        alert('SORRY BABY!');
      }
    });
  }

  apiPutProduct(id, prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/products/' + id, prod, config).then((res) => {
      if (res.data) {
        alert('OK BABY!');
        this.apiGetProducts();
      } else {
        alert('SORRY BABY!');
      }
    });
  }

  apiDeleteProduct(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete('/api/admin/products/' + id, config).then((res) => {
      if (res.data) {
        alert('OK BABY!');
        this.apiGetProducts();
      } else {
        alert('SORRY BABY!');
      }
    });
  }

  apiGetProducts() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/products?page=' + this.props.curPage, config).then((res) => {
      const result = res.data;
      if (result.products.length !== 0) {
        this.props.updateProducts(result.products, result.noPages);
      } else {
        axios.get('/api/admin/products?page=' + (this.props.curPage - 1), config).then((fallbackRes) => {
          const fallbackResult = fallbackRes.data;
          this.props.updateProducts(fallbackResult.products, fallbackResult.noPages);
        });
      }
    });
  }

  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    this.setState({ loadingCategories: true, categoryLoadError: '' });
    axios
      .get('/api/admin/categories', config)
      .then((res) => {
        const categories = Array.isArray(res.data) ? res.data : [];
        this.setState({
          categories,
          loadingCategories: false,
          categoryLoadError: '',
          cmbCategory: this.state.cmbCategory || categories[0]?._id || '',
        });
      })
      .catch(() => {
        this.setState({
          categories: [],
          loadingCategories: false,
          categoryLoadError: 'Không tải được danh mục cho form sản phẩm. Bạn thử lại sau vài giây nhé.',
        });
      });
  }

  render() {
    const cates = this.state.categories.map((cate) => {
      return (
        <option key={cate._id} value={cate._id}>
          {cate.name}
        </option>
      );
    });

    return (
      <div className="detail-panel">
        <h2 className="section-title">Product Detail</h2>
        <form>
          <table>
            <tbody>
              <tr>
                <td>ID</td>
                <td>
                  <input type="text" value={this.state.txtID} readOnly={true} />
                </td>
              </tr>
              <tr>
                <td>Name</td>
                <td>
                  <input type="text" value={this.state.txtName} onChange={(e) => this.setState({ txtName: e.target.value })} />
                </td>
              </tr>
              <tr>
                <td>Slug</td>
                <td>
                  <input type="text" value={this.state.txtSlug} onChange={(e) => this.setState({ txtSlug: e.target.value })} />
                </td>
              </tr>
              <tr>
                <td>Price</td>
                <td>
                  <input type="number" value={this.state.txtPrice} onChange={(e) => this.setState({ txtPrice: e.target.value })} />
                </td>
              </tr>
              <tr>
                <td>Image URL</td>
                <td>
                  <input
                    type="text"
                    value={this.state.txtImage}
                    onChange={this.handleImageUrlChange}
                    placeholder="https://cdn... or keep the uploaded image"
                  />
                </td>
              </tr>
              <tr>
                <td>Upload image</td>
                <td>
                  <input ref={this.fileInputRef} type="file" accept="image/*" onChange={this.handleImageFileChange} />
                  {this.state.selectedImageName ? <div className="field-hint">Selected: {this.state.selectedImageName}</div> : null}
                  {this.state.imageError ? <div className="field-error">{this.state.imageError}</div> : null}
                </td>
              </tr>
              <tr>
                <td>Category</td>
                <td>
                  <select
                    value={this.state.cmbCategory}
                    onChange={(e) => this.setState({ cmbCategory: e.target.value })}
                    disabled={this.state.loadingCategories || this.state.categories.length === 0}
                  >
                    {cates}
                  </select>
                  {this.state.loadingCategories ? <div className="field-hint">Loading categories...</div> : null}
                  {this.state.categoryLoadError ? (
                    <div className="detail-inline-state">
                      <p>{this.state.categoryLoadError}</p>
                      <button type="button" className="admin-async-button" onClick={() => this.apiGetCategories()}>
                        Retry
                      </button>
                    </div>
                  ) : null}
                </td>
              </tr>
              <tr>
                <td>Description</td>
                <td>
                  <textarea value={this.state.txtDescription} onChange={(e) => this.setState({ txtDescription: e.target.value })} rows="3" />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <input type="submit" value="ADD NEW" onClick={(e) => this.btnAddClick(e)} />
                  <input type="submit" value="UPDATE" onClick={(e) => this.btnUpdateClick(e)} />
                  <input type="submit" value="DELETE" onClick={(e) => this.btnDeleteClick(e)} />
                </td>
              </tr>
              {this.state.txtImage ? (
                <tr>
                  <td colSpan="2">
                    <img
                      src={this.state.txtImage}
                      width="200"
                      height="200"
                      alt=""
                      style={{ objectFit: 'cover', borderRadius: '8px', marginTop: '12px' }}
                    />
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </form>
      </div>
    );
  }
}

export default ProductDetail;

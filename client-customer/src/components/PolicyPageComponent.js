import React, { Component } from 'react';
import withRouter from '../utils/withRouter';
import { ABOUT_CONTENT, FAQ_SECTIONS, POLICY_PAGES, SITE_INFO } from '../content/siteContent';

const CARE_IMG = 'https://cdn.hstatic.net/themes/200001023102/1001450306/14/idx_iwc_img.png?v=1236';

class PolicyPage extends Component {
  renderFaqPage() {
    return (
      <div className="page-content faq-page">
        <h1>FAQ — Câu hỏi thường gặp</h1>
        {FAQ_SECTIONS.map((section) => (
          <section key={section.title} className="faq-section">
            <h2>{section.title}</h2>
            {section.items.map((item) => (
              <div key={item.question} className="faq-card">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </section>
        ))}
      </div>
    );
  }

  renderAboutPage() {
    return (
      <div>
        <div className="about-hero">
          <div className="about-hero-content">
            <img src={SITE_INFO.logo} alt="WHENEVER" style={{ height: '60px', margin: '0 auto 30px', display: 'block' }} />
            <h1>{ABOUT_CONTENT.title}</h1>
            <p>{ABOUT_CONTENT.vi[0]}</p>
          </div>
        </div>
        <div className="page-content about-rich-page">
          <section className="story-block">
            {ABOUT_CONTENT.vi.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>

          <section className="story-divider">
            <span></span>
            <strong>Whenever Atelier</strong>
            <span></span>
          </section>

          <section className="story-block story-block-english">
            {ABOUT_CONTENT.en.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        </div>
      </div>
    );
  }

  renderContactPage() {
    return (
      <div className="page-content contact-rich-page">
        <h1>Liên hệ</h1>
        <div className="contact-page-grid">
          <div className="contact-card">
            <h2>Thông tin liên hệ</h2>
            <p><strong>{SITE_INFO.companyName}</strong></p>
            <p>{SITE_INFO.registration}</p>
            <p>{SITE_INFO.address}</p>
            <p>Số điện thoại: {SITE_INFO.phone}</p>
            <p>Email: {SITE_INFO.email}</p>
            <p>{SITE_INFO.supportHours}</p>
          </div>
          <div className="contact-card">
            <h2>Gửi tin nhắn</h2>
            <div className="contact-form">
              <div className="form-group">
                <label>Tên *</label>
                <input type="text" placeholder="Tên của bạn" />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" placeholder="Email" />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input type="tel" placeholder="Số điện thoại" />
              </div>
              <div className="form-group">
                <label>Tin nhắn *</label>
                <textarea placeholder="Nội dung tin nhắn..." rows="5"></textarea>
              </div>
              <button className="form-submit" onClick={() => alert('Cảm ơn bạn! Tin nhắn đã được gửi.')}>
                Gửi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderPhilanthropyPage() {
    return (
      <div className="page-content" style={{ textAlign: 'center' }}>
        <img src={CARE_IMG} alt="Whenever Care" style={{ width: '100%', maxWidth: '720px', margin: '0 auto 30px', borderRadius: '8px' }} />
        <h1>Whenever Care</h1>
        <p>
          Whenever Care là phần mở rộng tự nhiên trong tinh thần thương hiệu: thời trang không chỉ để mặc đẹp,
          mà còn là cách giữ kết nối với cộng đồng và tạo ra những giá trị ấm áp hơn trong cuộc sống thường ngày.
        </p>
        <p>
          Chúng mình tin rằng những điều tử tế nhỏ nhưng bền bỉ luôn có ý nghĩa. Vì vậy Whenever Atelier muốn
          dành một phần năng lượng của mình cho những hoạt động gần gũi, tích cực và chạm thật vào đời sống.
        </p>
      </div>
    );
  }

  render() {
    const slug = this.props.params.slug;

    if (slug === 'faq') return this.renderFaqPage();
    if (slug === 'about-us' || slug === 'about') return this.renderAboutPage();
    if (slug === 'lien-he') return this.renderContactPage();
    if (slug === 'philanthropy') return this.renderPhilanthropyPage();

    const page = POLICY_PAGES[slug];
    if (!page) {
      return (
        <div className="page-content">
          <h1>Không tìm thấy trang</h1>
          <p>Trang bạn đang tìm kiếm hiện chưa được thiết lập trong storefront này.</p>
        </div>
      );
    }

    return (
      <div className="page-content policy-rich">
        <h1>{page.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
    );
  }
}

export default withRouter(PolicyPage);

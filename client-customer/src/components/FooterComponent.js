import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FOOTER_GROUPS, SITE_INFO } from '../content/siteContent';

class Footer extends Component {
  renderLink(item) {
    if (item.to) {
      return <Link to={item.to}>{item.label}</Link>;
    }
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer">
        {item.label}
      </a>
    );
  }

  render() {
    return (
      <footer className="site-footer">
        <div className="footer-inner footer-inner-rich">
          <div className="footer-col">
            <h4>Tham gia câu lạc bộ Whenever Atelier</h4>
            <form
              className="newsletter-form"
              style={{ maxWidth: '100%' }}
              onSubmit={(e) => {
                e.preventDefault();
                alert('Đăng ký thành công!');
              }}
            >
              <input type="email" placeholder="Nhập email của bạn" required />
              <button type="submit">→</button>
            </form>
            <p className="newsletter-privacy footer-copy">
              Khi đăng ký, bạn đồng ý với{' '}
              <Link to="/pages/chinh-sach-bao-mat">chính sách bảo mật</Link> của Whenever Atelier.
            </p>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <div key={group.title} className="footer-col">
              <h4>{group.title}</h4>
              {group.links.map((item) => (
                <div key={item.label}>{this.renderLink(item)}</div>
              ))}
            </div>
          ))}

          <div className="footer-col footer-company">
            <h4>Thông tin liên hệ</h4>
            <img
              src={SITE_INFO.footerLogo}
              alt="WHENEVER Atelier"
              style={{ height: '40px', marginBottom: '16px', display: 'block' }}
            />
            <p className="footer-copy"><strong>{SITE_INFO.companyName}</strong></p>
            <p className="footer-copy">{SITE_INFO.registration}</p>
            <p className="footer-copy">{SITE_INFO.address}</p>
            <p className="footer-copy">{SITE_INFO.phone}</p>
            <p className="footer-copy">{SITE_INFO.email}</p>
            <div className="footer-social-row">
              {SITE_INFO.socialLinks.map((item) => (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© Copyright Whenever Atelier 2026</span>
          <div className="footer-social-icons">
            <a href={SITE_INFO.socialLinks[0].href} target="_blank" rel="noopener noreferrer" title="Instagram">
              IG
            </a>
            <a href={SITE_INFO.socialLinks[1].href} target="_blank" rel="noopener noreferrer" title="YouTube">
              YT
            </a>
            <a href={SITE_INFO.socialLinks[2].href} target="_blank" rel="noopener noreferrer" title="TikTok">
              TT
            </a>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;

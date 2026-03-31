import React, { Component } from 'react';

class Home extends Component {
  render() {
    return (
      <div className="text-center" style={{padding:'60px 20px'}}>
        <h2 style={{fontSize:'28px', letterSpacing:'4px', marginBottom:'16px'}}>WHENEVER</h2>
        <p style={{fontSize:'14px', color:'#888', letterSpacing:'1px'}}>Atelier Admin Dashboard</p>
        <p style={{marginTop:'30px', color:'#aaa', fontSize:'13px'}}>Select a menu item above to manage your store.</p>
      </div>
    );
  }
}
export default Home;

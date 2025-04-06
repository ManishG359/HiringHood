

import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={{ padding: '16px 0', marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#4caf50', fontSize: '24px', fontWeight: 'bold' }}>
          Recipe Book 📖
        </Link>
        
      </div>
    </header>
  );
};

export default Header;

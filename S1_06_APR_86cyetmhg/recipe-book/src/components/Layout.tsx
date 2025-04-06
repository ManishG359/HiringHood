

import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    <div style={{ padding: '0 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

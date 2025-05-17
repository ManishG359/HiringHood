import React from 'react';
import ReactDOM from 'react-dom/client';
import GlobalStyle from './styles/GlobalStyle';
import { ThemeProviderWithToggle } from './context/ThemeContext';
import { RouterProvider } from 'react-router-dom';
import router from './router';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProviderWithToggle>
      <GlobalStyle />
      <RouterProvider router={router} />
    </ThemeProviderWithToggle>
  </React.StrictMode>
);

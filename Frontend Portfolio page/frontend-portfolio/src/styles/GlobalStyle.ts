import { createGlobalStyle } from 'styled-components';
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    palette: {
      background: {
        default: string;
        paper: string;
      };
      text: {
        primary: string;
        secondary: string;
      };
    };
  }
}

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    font-family: 'Roboto', sans-serif;
    background-color: ${({ theme }) => theme.palette.background.default};
    color: ${({ theme }) => theme.palette.text.primary};
    line-height: 1.6; /* Improved readability */
    scroll-behavior: smooth; /* Smooth scrolling */
  }

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.palette.text.primary};
    transition: color 0.3s ease; /* Smooth color transition */
    
    &:hover {
      color: ${({ theme }) => theme.palette.text.secondary}; /* Change color on hover */
    }
  }

  button {
    font-family: 'Roboto', sans-serif;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease; /* Smooth transitions */
  }

  ul, ol {
    padding-left: 1.5rem; /* Add spacing for lists */
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600; /* Make headings bold */
    margin-bottom: 1rem; /* Add spacing below headings */
  }
`;

export default GlobalStyle;

// src/theme.js

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    // The primary color is used for main UI elements like buttons and headers.
    primary: {
      // We'll use the warm yellow/orange from our previous custom button style.
      main: '#f0a500', 
    },
    // The secondary color is used for less prominent components.
    secondary: {
      // A deep, rich grey provides a professional contrast.
      main: '#424242',
    },
    // The background colors.
    background: {
      default: '#f7f7f7', // A slightly off-white for a softer look.
      paper: '#ffffff',   // The color for elements like Cards and Paper.
    },
  },
  typography: {
    // This tells MUI to use the 'Montserrat' font for all text.
    // The other fonts in the array are fallbacks.
    fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
    
    // We can customize specific typography variants.
    h1: {
      fontWeight: 700, // Make h1 headings bold.
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    // You can customize h4, h5, h6, body1, body2, etc., in the same way.
  },
  // You can also override default props for all instances of a component.
  components: {
    // Example: Give every Button a default 'contained' variant.
    MuiButton: {
      defaultProps: {
        // You could set `variant: 'contained'` or `disableElevation: true` here
        // to apply it to all buttons across the app.
      },
      styleOverrides: {
        // Example: Add a bit more padding to every button.
        root: {
          padding: '10px 20px',
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          // Add a subtle transition to cards for hover effects
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
             transform: 'translateY(-4px)',
             boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
          }
        }
      }
    }
  },
});

export default theme;
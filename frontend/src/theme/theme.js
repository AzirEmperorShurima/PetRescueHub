import { extendTheme } from '@chakra-ui/react';

// Cấu hình theme cho Chakra UI dựa trên theme hiện tại của MUI
const theme = extendTheme({
  colors: {
    primary: {
      50: '#fce4ee',
      100: '#f8bcd5',
      200: '#f394bc',
      300: '#ee6ca3',
      400: '#e94f8f',
      500: '#D34F81', // Màu chính từ theme cũ
      600: '#b83e6a',
      700: '#9c2e54',
      800: '#801e3e',
      900: '#650f28',
    },
    secondary: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#3498db', // Màu thứ hai từ theme cũ
      600: '#2980b9',
      700: '#1e6091',
      800: '#144b6e',
      900: '#0a3651',
    },
  },
  fonts: {
    heading: '"Segoe UI", "Roboto", sans-serif',
    body: '"Segoe UI", "Roboto", sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 500,
        borderRadius: 'md',
      },
      variants: {
        solid: (props) => ({
          bg: props.colorScheme === 'primary' ? 'primary.500' : 
               props.colorScheme === 'secondary' ? 'secondary.500' : 
               `${props.colorScheme}.500`,
          color: 'white',
          _hover: {
            bg: props.colorScheme === 'primary' ? 'primary.600' : 
                 props.colorScheme === 'secondary' ? 'secondary.600' : 
                 `${props.colorScheme}.600`,
          },
        }),
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'lg',
          boxShadow: 'md',
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: '#f8f9fa',
        color: '#333333',
      },
    },
  },
});

export { theme };
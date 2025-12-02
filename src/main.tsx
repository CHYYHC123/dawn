import { createRoot } from 'react-dom/client';
import App from './App';
import '@/assets/css/index.css';

import 'weather-icons/css/weather-icons.min.css';
import '@mantine/core/styles.css';
import { MantineProvider, createTheme } from '@mantine/core';
const theme = createTheme({
  cursorType: 'pointer'
});

const root = createRoot(document.getElementById('root')!);
root.render(
  <MantineProvider theme={theme}>
    <App />
  </MantineProvider>
);

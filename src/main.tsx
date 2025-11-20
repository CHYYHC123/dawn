import { createRoot } from 'react-dom/client';
import App from './App';
import '@/assets/css/index.css';

import 'weather-icons/css/weather-icons.min.css';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

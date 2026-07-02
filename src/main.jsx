import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// No StrictMode: GSAP pinned ScrollTriggers double-init under StrictMode's
// dev double-mount. Cleanup is handled per-component via gsap.context().
createRoot(document.getElementById('root')).render(<App />);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';


import App from './App.jsx';
import './styles/index.css';

const enableMocking = async () => {
  if (
    !import.meta.env.DEV ||
    import.meta.env
      .VITE_USE_MOCK_API !== 'true'
  ) {
    return;
  }

  const { worker } = await import(
    './mocks/browser'
  );

  return worker.start({
    onUnhandledRequest: 'bypass',
  });
};

enableMocking().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
});
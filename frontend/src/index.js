import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
<GoogleOAuthProvider clientId="319113493319-f4638vr2ent4e4tm1evgkso1s31u1uc8.apps.googleusercontent.com">
  <App />
</GoogleOAuthProvider>
  </React.StrictMode>
);

 
reportWebVitals();

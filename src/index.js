import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';//library used in react to navigate between pages

ReactDOM.render(
  <BrowserRouter>
     <React.StrictMode>
       <App />
     </React.StrictMode>
  </BrowserRouter>,
  document.getElementById("root")
  
);



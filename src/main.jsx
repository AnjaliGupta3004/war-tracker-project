import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Ye check karne ke liye ki main.jsx execute ho raha hai
console.log("System Initializing..."); 

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} else {
  console.error("Root element not found!");
}
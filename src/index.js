import React from 'react';
import ReactDOM from 'react-dom/client';
import Stars from './Stars';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <Stars numStars={5} size={30} />
    <Stars numStars={10} color='red' size={40} defaultRating={7} />
    <Stars numStars={3} size={50} color='blue' />
    <Stars size={60} messages={['Terrible', 'Bad', 'Okay', 'Good', 'Amazing']} defaultRating={4} /> */}
  </React.StrictMode>
);

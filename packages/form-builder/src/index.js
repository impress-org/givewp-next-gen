import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';
import App from './App';

import './blocks/fields/index'

import './blocks/donor-info/index'
import './blocks/donor-info/style.scss'

import './blocks/nameFieldGroup'
import './blocks/nameFieldGroup/style.scss'

import './blocks/donation-amount/index'
import './blocks/donation-amount/style.scss'

import './blocks/donation-levels/index'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

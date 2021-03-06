import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BrowserRouter} from "react-router-dom";
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const AppBundle = () => (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);


ReactDOM.render(
  <AppBundle />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

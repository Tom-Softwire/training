import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Loadable from 'react-loadable';
import {BrowserRouter} from "react-router-dom";
import App from "./containers/App";
import './index.css';
import registerServiceWorker from './registerServiceWorker';

window.onload = () => {
    Loadable.preloadReady().then(() => {
        ReactDOM.hydrate((
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            ),
            document.getElementById('root') as HTMLElement);
    });
};

registerServiceWorker();

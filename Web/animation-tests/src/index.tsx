import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import {Store} from "redux";
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import {IAppState} from "./store";
import configureStore from "./store/configure";

const store: Store<IAppState> = configureStore({} as IAppState);

const AppBundle = () => (
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(
  <AppBundle />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

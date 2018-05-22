import * as React from 'react';
import * as Loadable from 'react-loadable';
import {Switch} from "react-router";
import {BrowserRouter, Link, Route} from 'react-router-dom';
import './App.css';

import NotFound from "./err/NotFound";
import Loading from './Loading';

import logo from '../logo.svg';

const Home = Loadable({
    loader: () => import('./Home'),
    loading: Loading,
    timeout: 5000
});
const About = Loadable({
    loader: () => import('./About'),
    loading: Loading,
    timeout: 5000
});
const Topics = Loadable({
    loader: () => import('./Topics'),
    loading: Loading,
    timeout: 5000
});

const App = () => (
    <BrowserRouter>
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className="App-title">Welcome to React!</h1>
                <ul className="App-nav">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                    <li>
                        <Link to="/topics">Topics</Link>
                    </li>
                </ul>
            </header>

            <hr />

            <Switch>
                <Route exact={true} path="/" component={Home} />
                <Route path="/about" component={About} />
                <Route path="/topics" component={Topics} />
                <Route path="*" component={NotFound} />
            </Switch>
        </div>
    </BrowserRouter>
);

export default App;
import * as React from 'react';
import Loadable from 'react-loadable';
import {Switch} from "react-router";
import {Link, Route} from 'react-router-dom';
import './App.css';

import NotFound from "./containers/err/NotFound";
import Loading from './containers/Loading';

const Home = Loadable({
    loader: () => import(/* webpackChunkName: "home" */ './containers/Home'),
    loading: Loading,
    modules: ["home"],
    timeout: 5000
});
const About = Loadable({
    loader: () => import(/* webpackChunkName: "about" */ './containers/About'),
    loading: Loading,
    modules: ["about"],
    timeout: 5000
});
const Topics = Loadable({
    loader: () => import(/* webpackChunkName: "topics" */ './containers/Topics'),
    loading: Loading,
    modules: ["topics"],
    timeout: 5000
});

const App = () => (
    <div className="App">
        <header className="App-header">
            <img src="/images/logo.svg" className="App-logo" alt="logo" />
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
);

export default App;
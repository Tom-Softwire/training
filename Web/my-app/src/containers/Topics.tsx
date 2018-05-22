import * as React from 'react';
import * as Loadable from "react-loadable";
import {Route, RouteComponentProps, Switch} from "react-router";
import {Link} from 'react-router-dom';
import Loading from "./Loading";

const TopicsHome = Loadable({
    loader: () => import('./TopicsHome'),
    loading: Loading,
    timeout: 5000
});
const Topic = Loadable({
    loader: () => import('./Topic'),
    loading: Loading,
    timeout: 5000
});

const Topics = ({match}: RouteComponentProps<any>) => (
    <div>
        <h2>Topics</h2>
        <ul>
            <li>
                <Link to={`${match.url}/rendering`}>Rendering with React</Link>
            </li>
            <li>
                <Link to={`${match.url}/components`}>Components</Link>
            </li>
            <li>
                <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
            </li>
        </ul>

        <Switch>
            <Route exact={true} path={`${match.path}`} component={TopicsHome} />
            <Route path={`${match.path}/:topicId`} component={Topic} />
        </Switch>
    </div>
);

export default Topics;

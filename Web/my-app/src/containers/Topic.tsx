import * as React from 'react';
import {RouteComponentProps} from "react-router";

const Topic = ({match}: RouteComponentProps<any>) => (
    <div>
        <h3>{match.params.topicId}</h3>
    </div>
);

export default Topic;

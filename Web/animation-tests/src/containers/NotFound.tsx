import * as React from 'react';
import {RouteComponentProps} from "react-router";

type INotFoundProps = RouteComponentProps<{}>;

class NotFound extends React.Component<INotFoundProps, {}> {
    public render() {
        return (
            <p><code>{this.props.match.url}</code> could not be found</p>
        );
    }
}

export default NotFound;
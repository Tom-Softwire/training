import * as React from 'react';

const NotFound = ({ match }: any ) => (
    <div>
        <h2>404 Not Found</h2>
        <p><code>{match.url}</code> was not found</p>
    </div>
);

export default NotFound;

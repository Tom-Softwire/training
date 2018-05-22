import * as React from "react";

const Loading = (props: LoadableExport.LoadingComponentProps) => {
    if (props.error) {
        return <h3>Could not load content. <button onClick={ props.retry }>Retry</button></h3>;
    } else if (props.timedOut) {
        return <h2>Taking longer than expected... <button onClick={ props.retry }>Retry</button></h2>;
    } else if (props.pastDelay) {
        return <h2>Loading...</h2>;
    } else {
        return null;
    }
};

export default Loading;

import * as React from 'react';
import {Link} from "react-router-dom";

class Home extends React.Component {
    public render() {
        return (
            <>
                <h2>Home</h2>
                <Link to="/animation/">
                    Animation Demos
                </Link>
            </>
        );
    }
}

export default Home;
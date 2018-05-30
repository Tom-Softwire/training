import * as React from 'react';
import {Link} from "react-router-dom";

class Home extends React.Component {
    public render() {
        return (
            <>
                <h2>Home</h2>

                <ul>
                    <li>
                        <Link to="/animation/">Animation Demos</Link>
                    </li>
                    <li>
                        <Link to="/visualiser/">Music Visualiser Demo</Link>
                    </li>
                </ul>
            </>
        );
    }
}

export default Home;
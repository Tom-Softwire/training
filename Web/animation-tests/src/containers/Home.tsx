import * as React from 'react';
import {Link} from "react-router-dom";
import Header from "../components/Header";

class Home extends React.Component {
    public render() {
        return (
            <>
                <Header pageName="Home" />
                <main>
                    <ul>
                        <li>
                            <Link to="/animation/">Animation Demos</Link>
                        </li>
                        <li>
                            <Link to="/visualiser/">Music Visualiser Demo</Link>
                        </li>
                        <li>
                            <Link to="/music-browser/">Music Browser</Link>
                        </li>
                    </ul>
                </main>
            </>
        );
    }
}

export default Home;
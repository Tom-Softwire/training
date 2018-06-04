import * as React from 'react';

import './Header.css';

import logo from '../stc/logo.svg';

interface IHeaderProps {
    pageName: string
}

class Header extends React.PureComponent<IHeaderProps, {}> {
    public render() {
        return (
            <>
                <header className="App-header">
                    <div className="logo">
                        <img src={logo} alt="logo" />
                        <h1 className="title">React&nbsp;Demo</h1>
                    </div>
                </header>
                <div className="App-subheader">
                    <h2 className="page-title">{this.props.pageName}</h2>
                </div>
            </>
        );
    }
}

export default Header;
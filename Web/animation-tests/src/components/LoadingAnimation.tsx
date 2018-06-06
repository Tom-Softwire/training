import * as React from 'react';

import './LoadingAnimation.css';

class LoadingAnimation extends React.PureComponent {
    public render() {
        return (
            <svg className="loading-animation" version="1.1" viewBox="0 0 32 32" x="0" y="0" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                <circle className='slow-circle' cx={24} cy={16} r={8} />
                <circle className='fast-circle' cx={24} cy={16} r={8} />
            </svg>
        );
    }
}

export default LoadingAnimation;
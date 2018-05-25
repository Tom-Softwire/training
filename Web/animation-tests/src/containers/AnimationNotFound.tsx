import * as React from 'react';

interface IAnimationNotFoundProps {
    animationDemoName: string;
}

class AnimationNotFound extends React.Component<IAnimationNotFoundProps, {}> {
    public render() {
        return (
            <p>The animation <code>{this.props.animationDemoName}</code> could not be found.</p>
        );
    }
}

export default AnimationNotFound;
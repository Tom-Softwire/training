import * as React from 'react';
import {ITrackType} from "../visualiser/data/tracks";

import './TrackSelection.css';

interface ITrackSelectionProps {
    isSelected: boolean,
    isStarred: boolean,
    track: ITrackType,
    trackStarredCallback: (track: ITrackType) => void,
    trackSelectedCallback: (track: ITrackType) => void,
}

class TrackSelection extends React.PureComponent<ITrackSelectionProps, {}> {
    public constructor(props: ITrackSelectionProps) {
        super(props);

        this.trackSelected = this.trackSelected.bind(this);
    }

    public render() {
        return (
            <div className="track-selection"
                 onClick={this.trackSelected}>
                <div className="playing-indicator">
                    {this.props.isSelected &&
                            '▶'}
                </div>
                <div className="track-name">
                    {this.props.track.name}
                </div>
                <div className="star-button">
                    {this.props.isStarred ? '★' : '☆'}
                </div>
            </div>
        );
    }

    private trackSelected(): void {
        this.props.trackSelectedCallback(this.props.track);
    }
}

export default TrackSelection;
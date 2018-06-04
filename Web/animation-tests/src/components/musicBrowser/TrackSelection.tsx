import * as React from 'react';

import {ITrackType} from "../visualiser/data/tracksRepository";

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
        this.trackStarred = this.trackStarred.bind(this);
    }

    public render() {
        return (
            <div className={'track-selection' + (this.props.isSelected ? ' playing' : '')}>
                <div className="track-details"
                     onClick={this.trackSelected}>
                    <div className="playing-status">
                        ▶ {/* TODO Paused icon if paused, loader if loading, etc */}
                    </div>
                    <div className="track-name">
                        {this.props.track.name}
                    </div>
                </div>
                <div className="track-actions">
                    <div className="star-button"
                         onClick={this.trackStarred}>
                        {this.props.isStarred ? '★' : '☆'}
                    </div>
                </div>
            </div>
        );
    }

    private trackSelected(): void {
        this.props.trackSelectedCallback(this.props.track);
    }

    private trackStarred(e: React.MouseEvent<HTMLDivElement>): void {
        e.stopPropagation();
        this.props.trackStarredCallback(this.props.track);
    }
}

export default TrackSelection;
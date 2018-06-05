import * as React from 'react';

import {ITrackType} from "../visualiser/data/tracksRepository";

import './TrackSelection.css';

interface ITrackSelectionProps {
    isSelected: boolean,
    isStarred: boolean,
    track: ITrackType,
    trackStarToggleCallback: (track: ITrackType) => void,
    trackSelectedCallback: (track: ITrackType) => void,
}

class TrackSelection extends React.PureComponent<ITrackSelectionProps, {}> {
    public constructor(props: ITrackSelectionProps) {
        super(props);

        this.trackSelected = this.trackSelected.bind(this);
        this.trackStarToggle = this.trackStarToggle.bind(this);
    }

    public render() {
        return (
            <div className={'track-selection' + (this.props.isSelected ? ' playing' : '')}>
                <div className="track-details"
                     onClick={this.trackSelected}>
                    <div className="playing-status">
                        {this.renderPlayingStatus()}
                    </div>
                    <div className="track-name">
                        {this.props.track.name}
                    </div>
                </div>
                <div className="track-actions">
                    <div className={'star-button' + (this.props.isStarred ? ' starred' : '')}
                         onClick={this.trackStarToggle}>
                        {this.renderStarredStatus()}
                    </div>
                </div>
            </div>
        );
    }

    private trackSelected(): void {
        this.props.trackSelectedCallback(this.props.track);
    }

    private trackStarToggle(e: React.MouseEvent<HTMLDivElement>): void {
        e.stopPropagation();
        this.props.trackStarToggleCallback(this.props.track);
    }

    private renderPlayingStatus(): any {
        // TODO Paused icon if paused, loader if loading, etc
        return (
            <svg version="1.1" viewBox="0 0 32 32" x="0" y="0" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0 L 32 16 L 0 32 Z" />
            </svg>
        );
    }

    private renderStarredStatus(): any {
        return (
            <svg version="1.1" viewBox="0 0 32 32" x="0" y="0" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4 L 18.93893 11.95492 L 27.41268 12.29180 L 20.75528 17.54508 L 23.05342 25.70820 L 16 21 L 8.94658 25.70820 L 11.24472 17.54508 L 4.58732 12.29180 L 13.06107 11.95492 Z" />
            </svg>
        );
    }
}

export default TrackSelection;
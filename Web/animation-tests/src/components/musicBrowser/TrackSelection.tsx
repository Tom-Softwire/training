import * as React from 'react';

import {ITrackType} from "../visualiser/data/tracksRepository";

import LoadingAnimation from "../LoadingAnimation";
import './TrackSelection.css';
import {TrackStatus} from "./util/TrackStatus";

interface ITrackSelectionProps {
    isStarred: boolean,
    track: ITrackType,
    trackSelectedCallback: (track: ITrackType) => void,
    trackStarToggleCallback: (track: ITrackType) => void,
    trackStatus: TrackStatus,
}

class TrackSelection extends React.PureComponent<ITrackSelectionProps, {}> {
    public constructor(props: ITrackSelectionProps) {
        super(props);

        this.trackSelected = this.trackSelected.bind(this);
        this.trackStarToggle = this.trackStarToggle.bind(this);
    }

    public render() {
        const isNotCurrentTrack = this.props.trackStatus === TrackStatus.NotCurrent;

        return (
            <div className={'track-selection' + (isNotCurrentTrack ? '' : ' playing')}>
                <div className="track-details"
                     onClick={this.trackSelected}>
                    <div className="playing-status">
                        {isNotCurrentTrack ?
                            this.renderNonCurrentTrackHoverIcon() :
                            this.renderCurrentTrackStatus()}
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

    private renderNonCurrentTrackHoverIcon(): any {
        return (
            <div className="hover-icon">
                {this.renderPlayIcon()}
            </div>
        )
    }

    private renderPlayIcon(): any {
        return (
            <svg version="1.1" viewBox="0 0 32 32" x="0" y="0" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0 L 32 16 L 0 32 Z" />
            </svg>
        );
    }

    private renderCurrentTrackStatus(): any {
        switch (this.props.trackStatus) {
            case TrackStatus.Playing:
                return this.renderPlayingStatusPlaying();
            case TrackStatus.Paused:
                return this.renderPlayingStatusPaused();
            case TrackStatus.Loading:
                return this.renderPlayingStatusLoading();
        }
    }

    private renderPlayingStatusPlaying(): any {
        return this.renderPlayIcon();
    }

    private renderPlayingStatusPaused(): any {
        return (
            <svg version="1.1" viewBox="0 0 32 32" x="0" y="0" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 0 H 12 V 32 H 4 Z" />
                <path d="M20 0 H 28 V 32 H 20 Z" />
            </svg>
        );
    }

    private renderPlayingStatusLoading(): any {
        return <LoadingAnimation />
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
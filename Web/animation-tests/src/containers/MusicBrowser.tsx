import * as React from 'react';

import './MusicBrowser.css';

import {connect} from "react-redux";
import Header from "../components/Header";
import TrackSelection from "../components/musicBrowser/TrackSelection";
import {ITrackType} from "../components/visualiser/data/tracksRepository";
import visualisers, {IVisualiserType} from "../components/visualiser/data/visualisers";
import VisualisedAudioElement from "../components/visualiser/VisualisedAudioElement";
import {IAppState, IDispatchProps} from "../store";
import {toggleTrackStar} from "../store/music/actions";
import {IMusicAction, IMusicState} from "../store/music/types";

interface IMusicBrowserState {
    currentTrackId: number | null,
    shouldPlay: boolean,
    visualiser: IVisualiserType,
}

type IMusicBrowserProps = IDispatchProps<IMusicAction> & IMusicState;

class MusicBrowser extends React.PureComponent<IMusicBrowserProps, IMusicBrowserState> {
    public constructor(props: IMusicBrowserProps) {
        super(props);
        
        this.state = {
            currentTrackId: null,
            shouldPlay: false,
            visualiser: visualisers[0]
        };

        this.trackClicked = this.trackClicked.bind(this);
        this.trackStarClicked = this.trackStarClicked.bind(this);
    }
    
    public render() {
        return (
            <>
                <Header pageName="Music Browser" />
                <main>
                    <div className={'music-browser' + (this.hasACurrentTrack() ? ' has-track' : '')}>
                        {this.renderTrackBrowser()}
                        {this.renderNowPlaying()}
                    </div>
                </main>
            </>
        );
    }

    private renderTrackBrowser() {
        return (
            <div className="browser">
                <h4>Music Library</h4>
                <div className="list">
                    {this.renderTrackSelections()}
                </div>
                <p className="list-attribution">Music: http://www.purple-planet.com</p>
            </div>
        );
    }

    private renderTrackSelections() {
        return this.props.allTracks.map((track: ITrackType) => {
            return <TrackSelection key={track.id}
                                   isSelected={this.isTrackSelected(track)}
                                   isStarred={this.isTrackStarred(track)}
                                   track={track}
                                   trackStarToggleCallback={this.trackStarClicked}
                                   trackSelectedCallback={this.trackClicked}/>;
        });
    }

    private renderNowPlaying() {
        return (
            <div className="player">
                {this.hasACurrentTrack() &&
                <>
                    <h5 className="track-name">{this.getCurrentTrack().name}</h5>
                    <VisualisedAudioElement track={this.getCurrentTrack()}
                                            visualiser={this.state.visualiser}
                                            shouldPlay={this.state.shouldPlay}/>
                </>
                }
            </div>
        );
    }

    private hasACurrentTrack(): boolean {
        return this.state.currentTrackId !== null &&
            this.props.allTracks[this.state.currentTrackId] !== undefined;
    }

    private getCurrentTrack(): ITrackType {
        const currentTrackId = this.state.currentTrackId;
        if (currentTrackId === null) {
            throw new Error('No current track.');
        }
        return this.props.allTracks[currentTrackId];
    }

    private isTrackSelected(track: ITrackType): boolean {
        return this.state.currentTrackId === track.id;
    }

    private isTrackStarred(track: ITrackType): boolean {
        return this.props.allTracks[track.id].isStarred;
    }

    private trackClicked(track: ITrackType): void {
        this.setState({currentTrackId: track.id, shouldPlay: true});
    }

    private trackStarClicked(track: ITrackType): void {
        this.props.dispatch(toggleTrackStar(track));
    }
}


const mapStateToProps = (state: IAppState) => state.music;

export default connect(mapStateToProps)(MusicBrowser);
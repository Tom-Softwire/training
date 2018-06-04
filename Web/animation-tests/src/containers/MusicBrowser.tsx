import * as React from 'react';

import './MusicBrowser.css';

import Header from "../components/Header";
import TrackSelection from "../components/musicBrowser/TrackSelection";
import PersistentlyStarrableTrackStore from "../components/visualiser/data/StarrableTrackStore";
import {default as allTracks, ITrackType} from "../components/visualiser/data/tracksRepository";
import visualisers, {IVisualiserType} from "../components/visualiser/data/visualisers";
import VisualisedAudioElement from "../components/visualiser/VisualisedAudioElement";

interface IMusicBrowserState {
    currentTrackId: number | null,
    shouldPlay: boolean,
    trackStore: PersistentlyStarrableTrackStore,
    visualiser: IVisualiserType,
}

class MusicBrowser extends React.PureComponent<{}, IMusicBrowserState> {
    public constructor() {
        super({});
        
        this.state = {
            currentTrackId: null,
            shouldPlay: false,
            trackStore: new PersistentlyStarrableTrackStore(allTracks),
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
                    <div className="music-browser">
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
        return this.state.trackStore.getAllAsArray().map((track: ITrackType) => {
            return <TrackSelection key={track.id}
                                   isSelected={this.state.currentTrackId === track.id}
                                   isStarred={this.state.trackStore.isTrackWithIdStarred(track.id)}
                                   track={track}
                                   trackStarredCallback={this.trackStarClicked}
                                   trackSelectedCallback={this.trackClicked}/>;
        });
    }

    private renderNowPlaying() {
        return (
            <>
                {this.state.currentTrackId !== null &&
                <div className="player">
                    <h5>{this.state.trackStore.getTrackById(this.state.currentTrackId).name}</h5>
                    <VisualisedAudioElement track={this.state.trackStore.getTrackById(this.state.currentTrackId)}
                                            visualiser={this.state.visualiser}
                                            shouldPlay={this.state.shouldPlay}/>
                </div>
                }
            </>
        );
    }

    private trackClicked(track: ITrackType): void {
        this.setState({currentTrackId: track.id, shouldPlay: true});
    }

    private trackStarClicked(track: ITrackType): void {
        this.toggleTrackStar(track);
    }

    private toggleTrackStar(track: ITrackType): void {
        this.setState({trackStore: this.state.trackStore.withStarToggledForTrackWithId(track.id)});
    }
}

export default MusicBrowser;
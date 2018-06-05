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
        return this.allTracks().map((track: ITrackType) => {
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

    private allTracks(): ITrackType[] {
        return this.state.trackStore.getAllAsArray();
    }

    private hasACurrentTrack(): boolean {
        return this.state.currentTrackId !== null &&
            this.state.trackStore.hasTrackById(this.state.currentTrackId);
    }

    private getCurrentTrack(): ITrackType {
        const currentTrackId = this.state.currentTrackId;
        if (currentTrackId === null) {
            throw new Error('No current track.');
        }
        return this.state.trackStore.getTrackById(currentTrackId);
    }

    private isTrackSelected(track: ITrackType): boolean {
        return this.state.currentTrackId === track.id;
    }

    private isTrackStarred(track: ITrackType): boolean {
        return this.state.trackStore.isTrackWithIdStarred(track.id);
    }

    private trackClicked(track: ITrackType): void {
        this.setState({currentTrackId: track.id, shouldPlay: true});
    }

    private trackStarClicked(track: ITrackType): void {
        this.toggleTrackStar(track);
    }

    private toggleTrackStar(track: ITrackType): void {
        // TODO Convert to Redux action dispatch.
        this.setState({trackStore: this.state.trackStore.withStarToggledForTrackWithId(track.id)});
    }
}

export default MusicBrowser;
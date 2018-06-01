import * as React from 'react';

import './MusicBrowser.css';

import TrackSelection from "../components/musicBrowser/TrackSelection";
import tracks, {ITrackType} from '../components/visualiser/data/tracks';
import visualisers, {IVisualiserType} from "../components/visualiser/data/visualisers";
import VisualisedAudioElement from "../components/visualiser/VisualisedAudioElement";

interface IMusicBrowserState {
    currentTrack: ITrackType | null
    visualiser: IVisualiserType
}

// TODO Implement a persistent, redux-based store for the user's starred tracks

class MusicBrowser extends React.PureComponent<{}, IMusicBrowserState> {
    public constructor() {
        super({});
        
        this.state = {
            currentTrack: null,
            visualiser: visualisers[0]
        };

        this.trackSelected = this.trackSelected.bind(this);
        this.trackStarred = this.trackStarred.bind(this);
    }
    
    public render() {
        return (
            <div className="music-browser">
                {this.renderBrowser()}
                {this.renderNowPlaying()}
            </div>
        );
    }

    private renderBrowser() {
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
        return tracks.map((track: ITrackType) => {
            return <TrackSelection key={track.name}
                                   isSelected={this.state.currentTrack === track}
                                   isStarred={false} // TODO Determing from the redux store ingestion
                                   track={track}
                                   trackStarredCallback={this.trackStarred}
                                   trackSelectedCallback={this.trackSelected}/>;
        });
    }

    private renderNowPlaying() {
        return (
            <>
                {this.state.currentTrack !== null &&
                <div className="player">
                    <h5>{this.state.currentTrack.name}</h5>
                    <VisualisedAudioElement track={this.state.currentTrack}
                                            visualiser={this.state.visualiser}/>
                </div>
                }
            </>
        );
    }

    private trackSelected(track: ITrackType): void {
        this.setState({currentTrack: track});
    }

    private trackStarred(track: ITrackType): void {
        // TODO dispatch redux action
        return;
    }
}

export default MusicBrowser;
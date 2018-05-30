import * as React from 'react';
import {ReactElement} from "react";

import VisualisedAudioElement from "../components/visualiser/VisualisedAudioElement";

import {default as tracks, ITrackType} from "../components/visualiser/data/tracks";
import {default as visualisers, IVisualiserType} from "../components/visualiser/data/visualisers";

import './VisualiserDemo.css';

interface IVisualiserDemoState {
    visualiser: IVisualiserType,
    track: ITrackType | null,
}

class VisualiserDemo extends React.PureComponent<{}, IVisualiserDemoState> {

    constructor() {
        super({});

        this.state = {
            track: null,
            visualiser: visualisers[0],
        };

        this.setTrack = this.setTrack.bind(this);
        this.setVisualiserType = this.setVisualiserType.bind(this);
    }

    public render() {
        return (
            <>
                <div className='playerWithVisualiser'>
                    <h3>
                        {this.state.track ?
                            `Now playing: ${this.state.track.name}` :
                            `No track selected`}
                    </h3>
                    <VisualisedAudioElement track={this.state.track}
                                            visualiser={this.state.visualiser} />
                </div>
                <div>
                    <h4>Visualiser</h4>
                    {this.renderVisualiserTypeButtons()}
                </div>
                <div>
                    <h4>Track</h4>
                    {this.renderTrackButtons()}
                </div>
                <p>Music: http://www.purple-planet.com</p>
            </>
        );
    }

    private renderVisualiserTypeButtons(): Array<ReactElement<HTMLButtonElement>> {
        return visualisers.map((visualiserOption: IVisualiserType, index: number) => (
            // tslint:disable-next-line jsx-no-lambda
            <button onClick={() => this.setVisualiserType(visualiserOption)}
                    key={index}
                    disabled={this.state.visualiser === visualiserOption}>
                {visualiserOption.name}
            </button>
        ));
    }

    private setVisualiserType(visualiser: IVisualiserType): void {
        this.setState({visualiser});
    }

    private renderTrackButtons(): Array<ReactElement<HTMLButtonElement>> {
        return tracks.map((trackOption: ITrackType, index: number) => (
            // tslint:disable-next-line jsx-no-lambda
            <button onClick={() => this.setTrack(trackOption)}
                    key={index}
                    disabled={this.state.track === trackOption}>
                {trackOption.name}
                </button>
        ));
    }

    private setTrack(track: ITrackType): void {
        this.setState({track});
    }
}

export default VisualiserDemo;
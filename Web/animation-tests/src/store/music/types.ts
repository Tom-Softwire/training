import {Action} from "redux";
import {IStarrableTrackType, ITrackType} from "../../components/visualiser/data/tracksRepository";

export interface IMusicState {
    allTracks: IStarrableTrackType[]
}

export interface ITrackStarToggleAction extends Action {
    type: 'music/TOGGLE_TRACK_STAR',
    payload: {
        track: ITrackType
    }
}

export type IMusicAction = ITrackStarToggleAction;
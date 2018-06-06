import {ActionCreator} from "redux";
import {ITrackType} from "../../components/visualiser/data/tracksRepository";
import {ITrackStarToggleAction} from "./types";

export const toggleTrackStar: ActionCreator<ITrackStarToggleAction> = (track: ITrackType) => ({
    payload: {
        track
    },
    type: 'music/TOGGLE_TRACK_STAR',
});
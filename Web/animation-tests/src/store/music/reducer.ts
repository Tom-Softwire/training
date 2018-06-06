import {Reducer} from "redux";
import allTracks, {IStarrableTrackType, ITrackType} from "../../components/visualiser/data/tracksRepository";
import {IMusicAction, IMusicState} from "./types";

export const initialState: IMusicState = {
    allTracks: allTracks.map((track: ITrackType) => ({...track, isStarred: false}))
};

const reducer: Reducer<IMusicState, IMusicAction> = (state: IMusicState = initialState, action: IMusicAction) => {
    switch (action.type) {
        case 'music/TOGGLE_TRACK_STAR':
            return {...state, allTracks: state.allTracks.map((track: IStarrableTrackType) => {
                if (action.payload.track.id !== track.id) {
                    return track;
                } else {
                    return {...track, isStarred: !track.isStarred}
                }
            })};
        default:
            return state;
    }
};

export default reducer;
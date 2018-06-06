import {Dispatch} from "react-redux";
import {Action, combineReducers, Reducer} from "redux";
import musicReducer from "./music/reducer";
import {IMusicAction, IMusicState} from "./music/types";

export interface IAppState {
    music: IMusicState
}

export type IAppAction = IMusicAction;

export const appReducer: Reducer<IAppState, IAppAction> = combineReducers<IAppState, IAppAction>({
    music: musicReducer,
});

export interface IDispatchProps<S extends Action> {
    dispatch: Dispatch<S>;
}
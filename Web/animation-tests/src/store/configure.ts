import {createStore, Store} from "redux";
import {appReducer, IAppAction, IAppState} from "./index";

export default function configureStore(preloadedState: IAppState): Store<IAppState> {
    return createStore<IAppState, IAppAction, any, any>(
        appReducer,
        preloadedState);
}

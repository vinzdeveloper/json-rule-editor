import { combineReducers } from 'redux';
import AppReducer from './app-reducer';
import RulesetReducer from './ruleset-reducer';

const reducers = combineReducers({
    app: AppReducer,
    ruleset: RulesetReducer,
});

export default reducers;
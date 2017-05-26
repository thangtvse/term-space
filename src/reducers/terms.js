import {
  ADD_TERM,
  CLOSE_TERM,
  FORCUS_TERM,
  MOVE_TERM,
  RESIZE_TERM
} from "../actions/types";
import _ from "lodash";

const terms = (
  state = {
      byId: {},
      allIds: []
  },
  action
) => {
    switch (action.type) {
    case ADD_TERM: {
        const byId = {
            ...state.byId
        };
        byId[action.id] = {
            ...action.data,
            zIndex: findMaxZIndex(state) + 1
        };

        return {
            byId,
            allIds: [...state.allIds, action.id]
        };
    }

    case FORCUS_TERM: {
        const newById = {};

        const termZindex = getTermById(state, action.id).zIndex;

        getAllTerms(state).map(term => {
            if (term.id === action.id) {
                newById[action.id] = {
                    ...term,
                    zIndex: findMaxZIndex(state)
                };
            } else {
                if (term.zIndex > termZindex) {
                    newById[term.id] = {
                        ...term,
                        zIndex: term.zIndex - 1
                    };
                } else {
                    newById[term.id] = {
                        ...term
                    };
                }
            }
        });

        return {
            ...state,
            byId: newById
        };
    }

    case MOVE_TERM: {
        const term = getTermById(state, action.id);
        const newById = { ...state.byId };
        newById[action.id] = {
            ...term,
            x: action.x,
            y: action.y
        };

        return {
            ...state,
            byId: newById
        };
    }

    case RESIZE_TERM: {
        const term = getTermById(state, action.id);
        const newById = { ...state.byId };
        newById[action.id] = {
            ...term,
            x: action.x,
            y: action.y,
            width: action.width,
            height: action.height,
            cols: action.cols,
            rows: action.rows
        };

        return {
            ...state,
            byId: newById
        };
    }

    case CLOSE_TERM: {
        const termZindex = getTermById(state, action.id).zIndex;
        const newById = {};

        getAllTerms(state).map(term => {
            if (term.zIndex > termZindex) {
                newById[term.id] = {
                    ...term,
                    zIndex: term.zIndex - 1
                };
            } else if (term.zIndex < termZindex) {
                newById[term.id] = {
                    ...term
                };
            }
        });

        return {
            byId: newById,
            allIds: state.allIds.filter(id => id !== action.id)
        };
    }

    default:
        return state;
    }
};

const findMaxZIndex = state => {
    const term = _.maxBy(getAllTerms(state), term => term.zIndex);
    return term ? term.zIndex : 0;
};

// selectors

/**
 * Get a term by its id
 * @param {*} state 
 * @param {*} id 
 */
export const getTermById = (state, id) => state.byId[id];

/**
 * Get all term ids
 * @param {*} state 
 */
export const getAllTermIds = state => state.allIds;

/**
 * Get all terms
 * @param {*} state 
 */
export const getAllTerms = state =>
  state.allIds.map(id => ({
      ...state.byId[id],
      id
  }));

export default terms;

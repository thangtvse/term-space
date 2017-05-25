import { ADD_TERM, REMOVE_TERM, FORCUS_TERM } from "../actions/types";
import _ from "lodash";

const terms = (
  state = {
      byId: {},
      allIds: [],
      zIndexes: []
  },
  action
) => {
    let maxZIndex = _.max(state.zIndexes);
    if (isNaN(maxZIndex)) {
        maxZIndex = 0;
    }

    switch (action.type) {
    case ADD_TERM:
        const byId = {
            ...state.byId
        };
        byId[action.id] = action.data;

        return {
            byId,
            allIds: [...state.allIds, action.id],
            zIndexes: [...state.zIndexes, maxZIndex + 1]
        };

    case FORCUS_TERM:
        const indexOfZIndex = state.allIds.indexOf(action.id);

        if (indexOfZIndex === -1) {
            return state;
        }

        const termZIndex = state.zIndexes[indexOfZIndex];

        const decreaseGreater = zIndex => {
            if (zIndex > termZIndex) {
                return zIndex - 1;
            } else {
                return zIndex;
            }
        };
        return {
            ...state,
            zIndexes: [
                ...state.zIndexes.slice(0, indexOfZIndex).map(decreaseGreater),
                maxZIndex,
                ...state.zIndexes
            .slice(indexOfZIndex + 1, state.zIndexes.length)
            .map(decreaseGreater)
            ]
        };

    case REMOVE_TERM:
        return {
            byId: _.omit(state.byId, action.id),
            allIds: state.allIds.filter(id => id !== action.id)
        };

    default:
        return state;
    }
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
export const getAllTerms = state => state.allIds.map(id => state.byId[id]);

/**
 * Get zIndex for a term
 * @param {*} state 
 * @param {*} id 
 */
export const getZIndexForTerm = (state, id) =>
  state.zIndexes[state.allIds.indexOf(id)];

export default terms;

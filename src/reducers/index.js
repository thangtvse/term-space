import { combineReducers } from "redux";
import terms, * as fromTerms from "./terms";

/*
 * root reducer
 * @param {*} state asd
 * @param {*} action asd
 */
const app = combineReducers({
    terms
});

/**
 * Get a term by its id
 * @param {*} state 
 * @param {*} id 
 */
export const getTermById = (state, id) =>
  fromTerms.getTermById(state.terms, id);

/**
 * Get all term ids
 * @param {*} state 
 */
export const getAllTermIds = state => fromTerms.getAllTermIds(state.terms);

/**
 * Get all terms
 * @param {*} state 
 */
export const getAllTerms = state => fromTerms.getAllTerms(state.terms);

/**
 * Get z-index for a term
 * @param {*} state 
 * @param {*} id 
 */
export const getZIndexForTerm = (state, id) =>
  fromTerms.getZIndexForTerm(state.terms, id);

export default app;

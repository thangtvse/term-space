import uuid from "uuid";
import Term from "xterm";

import config from "../config";
import { ADD_TERM, FORCUS_TERM } from "./types";
import { getTermById } from "../reducers";
const ipcRenderer = window.require("electron").ipcRenderer;

export const addTerm = () => dispatch => {
    const checkToken = uuid();
    ipcRenderer.send("create-term", {
        token: checkToken,
        shellOptions: config.termOptions
    });

    ipcRenderer.on("term-id", (event, { token, termId }) => {
        if (token !== checkToken) return;

        const term = new Term(config.termOptions);
        const thisTermId = termId;

        dispatch({
            type: ADD_TERM,
            id: termId,
            data: term
        });

        ipcRenderer.on("shell-data", (event, { termId, data }) => {
            if (termId === thisTermId) {
                term.write(data);
            }
        });

        term.on("data", data => {
            if (data === ":") {
                return;
            }
            ipcRenderer.send("term-input", { shellId: thisTermId, data });
        });

        term.on("focus", () => {
            dispatch(focusTerm(thisTermId));
        });
    });
};

export const focusTerm = termId => dispatch => {
    dispatch({
        type: FORCUS_TERM,
        id: termId
    });
};

export const resizeTerm = (termId, cols, rows) => (dispatch, getState) => {
    const term = getTermById(getState(), termId);
    term.resize(cols, rows);
};

export const resizeShell = (shellId, cols, rows) => (dispatch, getState) => {
    ipcRenderer.send("term-resize", { shellId, cols, rows });

  //  const term = getTermById(getState(), shellId);

  //  term.refresh(0, rows - 1);
};

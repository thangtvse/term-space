import uuid from "uuid";
import Term from "xterm";

import config from "../config";
import {
  ADD_TERM,
  FORCUS_TERM,
  MOVE_TERM,
  RESIZE_TERM,
  CLOSE_TERM
} from "./types";
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

        term._flushBuffer = function() {
            term.write(term._attachSocketBuffer);
            term._attachSocketBuffer = null;
            clearTimeout(term._attachSocketBufferTimer);
            term._attachSocketBufferTimer = null;
        };

        term._pushToBuffer = function(data) {
            if (term._attachSocketBuffer) {
                term._attachSocketBuffer += data;
            } else {
                term._attachSocketBuffer = data;
                term._attachSocketBufferTimer = setTimeout(term._flushBuffer, 10);
            }
        };

        const thisTermId = termId;

        dispatch({
            type: ADD_TERM,
            id: termId,
            data: {
                xTerm: term,
                x: 0,
                y: 0,
                height: config.termHeight,
                width: config.termWidth,
                cols: config.termOptions.cols,
                rows: config.termOptions.rows
            }
        });

        ipcRenderer.on("shell-data", (event, { termId, data }) => {
            if (termId === thisTermId) {
                term._pushToBuffer(data);
            }
        });

        term.on("data", data => {
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

export const moveTerm = (termId, x, y) => ({
    type: MOVE_TERM,
    id: termId,
    x,
    y
});

export const resizeTerm = (id, x, y, width, height, cols, rows) => {
    ipcRenderer.send("term-resize", { shellId: id, cols, rows });
    return {
        type: RESIZE_TERM,
        id,
        width,
        height,
        cols,
        rows,
        x,
        y
    };
};

export const closeTerm = id => (dispatch, getState) => {
    ipcRenderer.send("term-close", id);
    dispatch({
        type: CLOSE_TERM,
        id
    });
};

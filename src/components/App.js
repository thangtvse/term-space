import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import interact from "interactjs";

import { getAllTerms } from "../reducers";
import { addTerm, resizeTerm, focusTerm, moveTerm } from "../actions/terms";
import TermComponent from "./Term";
import "./App.css";
import config from "../config";

const { ipcRenderer } = window.require("electron");

class App extends Component {
    constructor() {
        super();
        this.geometries = {};

        ipcRenderer.on("new-term", () => {
            this.props.addTerm();
        });

        ipcRenderer.on("align-horizontal", () => {
            this._alignHorizontal();
        });
    }

    componentDidMount() {
        interact(".draggable")
      .draggable({
        // enable inertial throwing
          inertia: true,
        // keep the element within the area of it's parent
          restrict: {
              restriction: ".drag-restriction",
              endOnly: true,
              elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
          },

        // enable autoScroll
          autoScroll: false,

        // call this function on every dragmove event
          onmove: this._onDragMove.bind(this),
          onstart: this._onDragStart.bind(this),
          onend: this._onDragEnd.bind(this),
          max: 1
      })
      .ignoreFrom("a")
      .on("tap", event => {
          const target = event.target;
          const parent = target.parentNode;
          this.props.focusTerm(parseInt(parent.dataset.termId, 10));
      });

    // // this is used later in the resizing and gesture demos
    //     window.dragMoveListener = dragMoveListener;

        interact(".resizable")
      .resizable({
          preserveAspectRatio: false,
          edges: { left: true, right: true, bottom: true, top: true },
          restrict: {
              restriction: "parent"
          },
          max: 1
      })
      .on("resizestart", this._onResizeStart.bind(this))
      .on("resizemove", this._onResizeMove.bind(this))
      .on("resizeend", this._onResizeEnd.bind(this));
    }

    _onDragStart(event) {
        const target = event.target;
        const parent = target.parentNode;
        this.props.focusTerm(parseInt(parent.dataset.termId, 10));
    }

    _onResizeStart(event) {
        const target = event.target;
        const termId = target.dataset.termId;
        this.props.focusTerm(parseInt(termId, 10));
    }

  /**
 * 
 * @param {*} event 
 */
    _onDragMove(event) {
        const target = event.target;
        const oldX = parseFloat(target.getAttribute("data-x")) || 0;
        const oldY = parseFloat(target.getAttribute("data-y")) || 0;

    // translate the element
        const parent = target.parentNode;

    // keep the dragged position in the data-x/data-y attributes
        const x = oldX + event.dx;
        const y = oldY + event.dy;

        parent.style.webkitTransform = parent.style.transform =
      "translate(" + x + "px, " + y + "px)";

    // update the posiion attributes
        target.setAttribute("data-x", x);
        target.setAttribute("data-y", y);
    }

    _onDragEnd(event) {
        const target = event.target;
        const id = parseInt(target.parentNode.dataset.termId, 10);
        const x = parseFloat(target.getAttribute("data-x")) || 0;
        const y = parseFloat(target.getAttribute("data-y")) || 0;

        this.props.moveTerm(id, x, y);
    }

  /**
 * 
 * @param {*} event 
 * 
 */
    _onResizeMove(event) {
        const target = event.target;
        const draggableChild = target.firstChild;

        let x = parseFloat(draggableChild.getAttribute("data-x")) || 0;
        let y = parseFloat(draggableChild.getAttribute("data-y")) || 0;

        const width = event.rect.width - 18;
        const height = event.rect.height - 18;

        if (width <= config.termMinWidth || height <= config.termMinHeight) {
            return;
        }

        target.style.width = width + "px";
        target.style.height = height + "px";

    // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.webkitTransform = target.style.transform =
      "translate(" + x + "px," + y + "px)";

        draggableChild.setAttribute("data-x", x);
        draggableChild.setAttribute("data-y", y);

    // Calculate height and width
        const cols = Math.round((width - 2) / 8);
        const rows = Math.round((height - 24) / 17);
        const termId = target.dataset.termId;

    // this.props.resizeTerm(termId, x, y, width, height, cols, rows);

        const id = parseInt(termId, 10);
        const term = this.props.terms.find(term => term.id === id);
        term.xTerm.resize(cols, rows);
    }

  /**
 * 
 * @param {*} event 
 */
    _onResizeEnd(event) {
        const target = event.target;
        const draggableChild = target.firstChild;
        const width = target.offsetWidth;
        const height = target.offsetHeight;
        const cols = Math.round((width - 16) / 8);
        const rows = Math.round((height - 18 - 8) / 17);
        const termId = target.dataset.termId;
        const x = parseFloat(draggableChild.getAttribute("data-x")) || 0;
        const y = parseFloat(draggableChild.getAttribute("data-y")) || 0;

        this.props.resizeTerm(termId, x, y, width, height, cols, rows);
    }

    _checkRestrictionForDrag(
    x,
    y,
    width,
    height,
    dx,
    dy,
    parentWidth,
    parentHight
  ) {
        if (
      x + dx >= 0 &&
      y + dy >= 0 &&
      x + width + dx <= parentWidth &&
      y + height + dy <= parentHight
    ) {
            return true;
        } else {
            return false;
        }
    }

  /**
 * 
 * @param {*} termIds 
 */
    _generateTermComponents(terms) {
        return terms.map(term => <TermComponent termId={term.id} key={term.id} />);
    }

    render() {
        const { terms } = this.props;

        return (
      <div className="App">
        <div className="drag-restriction">
          {this._generateTermComponents(terms)}
        </div>
      </div>
        );
    }
}

App.propTypes = {
    addTerm: PropTypes.func.isRequired,
    terms: PropTypes.arrayOf(PropTypes.object).isRequired,
    resizeTerm: PropTypes.func.isRequired,
    moveTerm: PropTypes.func.isRequired,
    focusTerm: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    terms: getAllTerms(state)
});

export default connect(mapStateToProps, {
    addTerm,
    resizeTerm,
    moveTerm,
    focusTerm
})(App);

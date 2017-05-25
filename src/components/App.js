import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import interact from "interactjs";

import { getAllTermIds } from "../reducers";
import { addTerm, resizeTerm, resizeShell, focusTerm } from "../actions/terms";
import TermComponent from "./Term";
import "./App.css";

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
              restriction: ".App",
              endOnly: true,
              elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
          },
        // restrict: function(x, y, element) {
        //     const parent = element.parentNode;
        //     const width = parent.offsetWidth;
        //     const height = parent.offsetHeight;
        //     const right = x + width;
        //     const bottom = y + height;
        //     const appElement = document.getElementsByClassName("App")[0];

        //     let rectX = x;
        //     let rectY = y;

        //     if (right >= appElement.offsetWidth) {
        //         rectX = appElement.offsetWidth - width;
        //     }

        //     if (bottom >= appElement.offsetHeight) {
        //         rectY = appElement.offsetHeight - height;
        //     }

        //     const rect = {
        //         x: rectX,
        //         y: rectY,
        //         width,
        //         height
        //     };

        //     return rect;
        // },
        // enable autoScroll
          autoScroll: false,

        // call this function on every dragmove event
          onmove: this._onDragMove.bind(this),
          onstart: this._onDragStart.bind(this),
          max: 1
      })
      .on("tap", event => {
          const target = event.target;
          const parent = target.parentNode;
          this.props.focusTerm(parseInt(parent.dataset.termId));
      });

    // // this is used later in the resizing and gesture demos
    //     window.dragMoveListener = dragMoveListener;

        interact(".resizable")
      .resizable({
          preserveAspectRatio: false,
          edges: { left: true, right: true, bottom: true, top: true },
          max: 1
      })
      .on("resizestart", this._onResizeStart.bind(this))
      .on("resizemove", this._onResizeMove.bind(this))
      .on("resizeend", this._onResizeEnd.bind(this));
    }

    _onDragStart(event) {
        const target = event.target;
        const parent = target.parentNode;
        this.props.focusTerm(parseInt(parent.dataset.termId));
    }

    _onResizeStart(event) {
        const target = event.target;
        const termId = target.dataset.termId;
        this.props.focusTerm(parseInt(termId));
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
        const appElement = document.getElementsByClassName("App")[0];

    //     if (
    //   !this._checkRestrictionForDrag(
    //     oldX,
    //     oldY,
    //     parent.offsetWidth,
    //     parent.offsetHeight,
    //     event.dx,
    //     event.dy,
    //     appElement.offsetWidth,
    //     appElement.offsetHeight
    //   )
    // ) {
    //         return;
    //     }

        window.console.log(event.dx + " " + event.dy);

    // keep the dragged position in the data-x/data-y attributes
        const x = oldX + event.dx;
        const y = oldY + event.dy;

        parent.style.webkitTransform = parent.style.transform =
      "translate(" + x + "px, " + y + "px)";

    // update the posiion attributes
        target.setAttribute("data-x", x);
        target.setAttribute("data-y", y);
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

    //     if (
    //   !this._checkRestriction(target, document.getElementsByClassName(".App"))
    // ) {
    //         return;
    //     }

    // update the element's style
        const width = event.rect.width;
        const height = event.rect.height;
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
        const cols = Math.round((width - 18) / 8);
        const rows = Math.round((height - 18 - 8) / 17);
        const termId = target.dataset.termId;

        this.props.resizeTerm(termId, cols, rows);
    }

  /**
 * 
 * @param {*} event 
 */
    _onResizeEnd(event) {
        const target = event.target;
        const width = target.offsetWidth;
        const height = target.offsetHeight;
        const cols = Math.round((width - 16) / 8);
        const rows = Math.round((height - 18 - 8) / 17);
        const termId = target.dataset.termId;

        this.props.resizeShell(termId, cols, rows);
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
    _generateTermComponents(termIds) {
        return termIds.map(termId => (
      <TermComponent termId={termId} key={termId} />
    ));
    }

    render() {
        const { addTerm, termIds } = this.props;

        return (
      <div className="App">
        <div className="terms">
          {this._generateTermComponents(termIds)}
        </div>
      </div>
        );
    }
}

App.propTypes = {
    addTerm: PropTypes.func.isRequired,
    termIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    resizeTerm: PropTypes.func.isRequired,
    resizeShell: PropTypes.func.isRequired,
    focusTerm: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    termIds: getAllTermIds(state)
});

export default connect(mapStateToProps, {
    addTerm,
    resizeTerm,
    resizeShell,
    focusTerm
})(App);

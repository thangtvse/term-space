import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import "./style.css";
import { getTermById, getZIndexForTerm } from "../../reducers/index";

class TermComponent extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        const { termId, term } = this.props;
        term.open(document.getElementById(termId));
    }

    render() {
        const { termId, zIndex } = this.props;

        return (
      <div
        className="termWrapper resizable"
        data-term-id={termId}
        style={{ zIndex }}
      >
        <div className="terminal-header draggable">{termId}</div>
        <div id={termId} />
      </div>
        );
    }
}

TermComponent.propTypes = {
    termId: PropTypes.number.isRequired,
    term: PropTypes.object.isRequired,
    zIndex: PropTypes.number.isRequired
};

const mapStateToProps = (state, { termId }) => ({
    term: getTermById(state, termId),
    zIndex: getZIndexForTerm(state, termId)
});

export default connect(mapStateToProps)(TermComponent);

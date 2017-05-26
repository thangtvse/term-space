import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import "./style.css";
import { getTermById } from "../../reducers/index";

class TermComponent extends React.Component {
    componentDidMount() {
        const { termId, term } = this.props;
        term.xTerm.open(document.getElementById(termId));
    }

    render() {
        const { termId, term } = this.props;

        return (
      <div
        className="termWrapper resizable"
        data-term-id={termId}
        style={{ zIndex: term.zIndex }}
      >
        <div className="terminal-header draggable">
          {termId}
        </div>
        <div id={termId} />
      </div>
        );
    }
}

TermComponent.propTypes = {
    termId: PropTypes.number.isRequired,
    term: PropTypes.object.isRequired
};

const mapStateToProps = (state, { termId }) => ({
    term: getTermById(state, termId)
});

export default connect(mapStateToProps)(TermComponent);

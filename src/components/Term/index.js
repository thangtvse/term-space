import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import "./style.css";
import { getTermById } from "../../reducers/index";
import { closeTerm } from "../../actions/terms";

class TermComponent extends React.Component {
    componentDidMount() {
        const { termId, term } = this.props;
        term.xTerm.open(document.getElementById(termId));

    // term.fit();

    // var initialGeometry = term.proposeGeometry(),

    //     cols = initialGeometry.cols,

    //     rows = initialGeometry.rows;

    // debugger;
    }

    _close(event) {
        const { closeTerm, termId } = this.props;
        event.preventDefaults;
        event.stopPropagation();
        closeTerm(termId);
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
          <a className="close-terminal" onClick={this._close.bind(this)}>
            <i className="fa fa-times-circle fa-fw" aria-hidden="true" />
          </a>
        </div>
        <div id={termId} />
      </div>
        );
    }
}

TermComponent.propTypes = {
    termId: PropTypes.number.isRequired,
    term: PropTypes.object.isRequired,
    closeTerm: PropTypes.func.isRequired
};

const mapStateToProps = (state, { termId }) => ({
    term: getTermById(state, termId)
});

export default connect(mapStateToProps, {
    closeTerm
})(TermComponent);

import React from "react";
import {click} from "@testing-library/user-event/dist/click";

export default class ListItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            message: props.message,
            expanded: false
        }
    }

    toggleExpanded() {
        this.setState({ expanded: !this.state.expanded });
    }

    render() {
        if(this.state.expanded) {
            const html = { __html: JSON.stringify(this.state.message, null, '\t').replaceAll('\n', '<br />').replaceAll('\t', '&nbsp;&nbsp;&nbsp;&nbsp;') };
            return (
                <li className="list-group-item list-group-item-action" style={{ textAlign: "start", cursor: "pointer" }} onClick={() => this.toggleExpanded()}>
                    <h3 style={{ textAlign: "start" }}>{this.state.title}</h3>
                    <div dangerouslySetInnerHTML={html} style={{ textAlign: "start" }}></div>
                </li>
            )
        } else {
            return (
                <a className="list-group-item list-group-item-action" style={{ textAlign: "start", cursor: "pointer" }} onClick={() => this.toggleExpanded()}>{this.state.title}</a>
            )
        }
    }
}
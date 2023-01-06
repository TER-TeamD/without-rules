import React from "react";

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
            return (
                <li>
                    <h3>{this.state.title}</h3>
                    <p>{this.state.message}</p>
                </li>
            )
        } else {
            return (
                <li>{this.state.title}</li>
            )
        }
    }
}
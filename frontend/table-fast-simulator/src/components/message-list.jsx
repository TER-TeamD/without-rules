import {messages, messages$} from '../services/messages.service'
import ListItem from "./list-item";
import React from "react";

export default class MessageList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: messages
        }
        this.subs = messages$.subscribe(messages => {
            this.setState({messages});
        });
    }

    destroy() {
        this.subs.unsubscribe();
    }

    render() {
        /**
         * @type {{title: string, message: string}[]} messages
         */
        const messages = this.state.messages;
        return (
            <ul>
                {messages.map(message => {
                    return (
                        <ListItem message={message.message} title={message.title}></ListItem>
                    )
                })}
            </ul>
        )
    }
}
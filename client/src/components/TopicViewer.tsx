import React from 'react';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise } from 'axios';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

interface Message {
    key: {
        type: string,
        data: number[],
    },
    value: {
        type: string,
        data: number[],
    },
    offset: number,
    timestamp: number
};

interface TopicViewerState {
    messages: Message[],
    loading: boolean;
}

export class TopicViewer extends React.Component<{}, TopicViewerState>{
    private _client: AxiosInstance = axios.create({});

    constructor(props: {}, context: {}) {
        super(props, context);
        this.state = {
            messages: new Array<Message>(),
            loading: false
        };
        this.topicChanged = this.topicChanged.bind(this);
    }

    topicChanged(topicName: string) {
        this.setState({
            messages: new Array<Message>(),
            loading: true
        });
        if (this.state.messages.length == 0) {
            this._client.request({
                method: 'GET',
                url: `/api/consumers/${topicName}`,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            }).then(async (response) => {
                this.setState({
                    messages: response.data as Array<Message>,
                    loading: false
                });
            })
        }
    }

    render() {
        return (
            <div>
                {this.state.loading && <CircularProgress />}
                <h1>Topic Viewer</h1>
                <List>
                    {
                        this.state.messages.length > 0 && this.state.messages.map(t => {
                            var td = new TextDecoder("utf-8");
                            var msg = td.decode(Int32Array.from(t.value.data));
                            return (
                                <ListItem key={t.timestamp}>
                                    <ListItemText primary={msg} />
                                </ListItem>
                            );
                        })}
                </List>
            </div>
        );
    }
}

export default TopicViewer;
import React from 'react';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise } from 'axios';
import '../css/PannelTopics.css';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';


interface TopicsState {
    topics: Topic[];
}

interface Topic {
    topic: string;
    partitions: [{
        partitionErrorCode: number;
        partitionId: number;
        leader: number;
        replicas: number[];
        isr: number[];
    }]
}

export interface PannelTopicsProps {
    topicChanged(topicName: string): void;
}

export class PannelTopics extends React.Component<PannelTopicsProps, TopicsState>{
    private _client: AxiosInstance = axios.create({});

    constructor(props: PannelTopicsProps, context: {}) {
        super(props, context);
        this.state = {
            topics: []
        };
    }

    componentDidMount() {
        this._client.request({
            method: 'GET',
            url: '/api/topics',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then(async (response) => {
            this.setState({
                topics: response.data
            });
        })
    }

    render() {
        return (
            <div>
                <h1>{this.state.topics.length} TOPICS</h1>
                <List style={{position: "fixed", left: "25px"}}>
                    {this.state.topics.map(t => {
                        var secondary = t.partitions.length + " partitions x " + Array.from(new Set(t.partitions.flatMap(p => p.replicas))).length + " replicas";
                        return (
                            <ListItem key={t.topic} onClick={() => this.props.topicChanged(t.topic)}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <ImageIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={t.topic} secondary={secondary} />
                            </ListItem>
                        );
                    })}
                </List>
            </div>
        );
    }
}

export default PannelTopics;
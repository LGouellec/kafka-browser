import React, { RefObject } from 'react';
import PannelTopics from './PannelTopics';
import TopicViewer from './TopicViewer';

import Grid from '@material-ui/core/Grid';

export class Dashboard extends React.Component<{}, {}>{

    private readonly viewer: RefObject<TopicViewer>;

    constructor(props: {}, context: {}) {
        super(props, context);
        this.viewer = React.createRef<TopicViewer>();
    }

    render() {
        return (
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <PannelTopics topicChanged={(topic) => {
                            this.viewer.current?.topicChanged(topic);
                        }} />
                    </Grid>
                    <Grid item xs={6}>
                        <TopicViewer ref={this.viewer} />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default Dashboard;
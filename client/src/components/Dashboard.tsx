import React from 'react';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise } from 'axios';

export class Dashboard extends React.Component<{}, {}>{
    private _client: AxiosInstance = axios.create({});

    constructor(props: {}, context: {}) {
        super(props, context);
    }

    componentDidMount() {
        this._client.request({
            method: 'GET',
            url: '/api/topics',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then(async (response) => {
            console.log(response.data);
        })
    }

    render() {
        return (
            <div>
                DashBoard
            </div>
        );
    }
}

export default Dashboard;
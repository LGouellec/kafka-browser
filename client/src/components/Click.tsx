import React from 'react';


export class Click extends React.Component<{}, {text: string}>{
    constructor(props: {}, context: {}){
        super(props, context);
        this.state = {
            text: ""
        };
        this.click = this.click.bind(this);
    }

    async click(){
        var response = await fetch('/api/send');
        var message = await response.text();
        this.setState({
            text: message
        });
    }

    render(){
        return (
            <div>
                <button onClick={this.click}>Click Me</button>
                <p>{this.state.text}</p>
            </div>
        );
    }
}

export default Click;
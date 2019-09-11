import React from "react"
import ReactDOM from "react-dom"
import { Nim } from "app/Nim";

class App extends React.Component{
    render() {
        return (<Nim stackLengths={[3, 5, 7]}/>);
    }
}

ReactDOM.render(<App />, document.getElementById("root"));
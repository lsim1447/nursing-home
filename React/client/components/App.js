import React from 'react';
import NavigationBar from './NavigationBar';
import imageStyle from '../css/ImageCSS.css';

class App extends React.Component{
     constructor(props) {
        super(props);
     }

    render(){
        return (
            <div> 
                <div id={imageStyle.back}>
                    <center>
                        <img  id={imageStyle.lokod} src="http://1.bp.blogspot.com/-kj9Qjl8ppnM/VSupU1qvZ3I/AAAAAAAABbM/J5mzEE6SdzU/s1600/DSC_0021.JPG" alt="" className="circle"/> 
                    </center>
                </div>
                <NavigationBar />
                <div id={imageStyle.mainPage}>
                    {this.props.children}
                </div>
            </div>
        );
    }   
}
export default App;
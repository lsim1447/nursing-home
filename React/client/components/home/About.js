import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import styles from '../../css/table-form-design.css';
import selectStyle from '../../css/select-design.css';
import imageStyle from '../../css/ImageCSS.css';

class About  extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.onChangeEvent = this.onChangeEvent.bind(this);
    }
    componentDidMount() {
    }
   
    onChangeEvent(e){
            this.setState({ [e.target.name]: e.target.value});
    }

    render() {
        const { isAuthenticated } = this.props.auth;
        if (!isAuthenticated) browserHistory.push('/signin');
        
        return (
          <div id={styles.homePage}>
                    <br/>
                    <h2 style={{textAlign: "center", fontStyle:"italic", color: "black"}}><b>Welcome to our page!</b></h2>
                    <div id = {imageStyle.container}>
                        <div id={imageStyle.main}>
                            <div className={imageStyle.blue}></div>
                            <div className={imageStyle.green}></div>
                            <div className={imageStyle.red}></div>
                            <div className={imageStyle.yellow}></div>
                        </div>
                    </div>
                    <br/>
                    <div id={styles.empty}>

                    </div>
          </div>
        );
    }
}   

About.propTypes = {
    auth: React.PropTypes.object.isRequired
}

function mapStateToProps(state){
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps) (About);
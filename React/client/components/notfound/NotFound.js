import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import styles from '../../css/table-form-design.css';
import selectStyle from '../../css/select-design.css';
import imageStyle from '../../css/ImageCSS.css';

class NotFound  extends Component {
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
          <div >
              <div id={styles.block_container} style={{marginTop: "6%"}}>
                    <img src="https://learn.getgrav.org/user/pages/11.troubleshooting/01.page-not-found/error-404.png" alt="" /> 
                    <div>
                        <a href="/"> <h5 style={{color: "red"}}><b> Click here for back to the home page</b></h5> </a>
                    </div>
              </div>
          </div>
        );
    }
}   

NotFound.propTypes = {
    auth: React.PropTypes.object.isRequired
}

function mapStateToProps(state){
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps) (NotFound);
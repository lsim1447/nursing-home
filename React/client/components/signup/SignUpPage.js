import React from 'react';
import SignUpForm from './SignUpForm';
import  { connect } from 'react-redux';
import {userSignupRequest} from '../../actions/signupActions';

class SignUpPage extends React.Component {
    render(){
        const {userSignupRequest} = this.props;
        return(
           <SignUpForm userSignupRequest={userSignupRequest}/>
        );
    }
}

SignUpPage.propTypes = {
    userSignupRequest: React.PropTypes.func.isRequired
}


export default connect(null, { userSignupRequest })(SignUpPage);
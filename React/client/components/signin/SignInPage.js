import React from 'react';
import SignInForm from './SignInForm';
import  { connect } from 'react-redux';
import {login} from '../../actions/loginActions';

class SignInPage extends React.Component {
    render(){
        const { login } = this.props;
        return(
           <SignInForm login={login}/>
        );
    }
}

SignInForm.propTypes = {
    login: React.PropTypes.func.isRequired
}

export default connect(null , { login }) (SignInPage);
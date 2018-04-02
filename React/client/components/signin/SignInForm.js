import React from 'react';
import validateInput from '../../../server/shared/validations/login';
import { connect } from 'react-redux';
import  { login } from '../../actions/loginActions';
import { browserHistory} from 'react-router';
import styles from '../../css/table-form-design.css';

class SignInForm extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                email: '',
                password: '',
                errors: [],
                isLoading: false,
                errorMessage: ''
            }
            this.onChangeEvent = this.onChangeEvent.bind(this);
            this.onSubmitEvent = this.onSubmitEvent.bind(this);
            this.loginUser = this.loginUser.bind(this);
        }

        isValid(){
            const { errors, isValid } = validateInput(this.state);
            if (!isValid){
                this.setState({ errors });
            }
            return isValid;
        }

        onChangeEvent(e){
            this.setState({ [e.target.name]: e.target.value});
        }

        onSubmitEvent(e){
            e.preventDefault();
            this.setState({errorMessage: ''});
            if (this.isValid()){
               this.loginUser();
            }
        }
        loginUser(){
            var formData = new FormData();
            formData.append('email', this.state.email);
            formData.append('password', this.state.password);

            fetch('http://localhost:8080/exam/users/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; '
                },
                body: formData
			}).then( (response) => {
                return response.json() })   
                    .then( (json) => {
                        if (json.user != null){
                            this.setState({errors: {}, isLoading: true});  
                            this.props.login(json);
                        } else{
                            this.setState({isLoading:false, errorMessage:'The email/password is incorrect!'});
                            this.context.router.push('/signin');
                        }
            });
        }
        render(){
             const { isAuthenticated, user } = this.props.auth;
             if (isAuthenticated) browserHistory.push('/');
             const { email, password, errors, loginUser, isLoading } = this.state;
                return (
                    <main>
                        <br/>
                        <center>
                            <div style={{marginTop: "2%"}} className={styles.container}> 
                                <div style={{height: "100px", backgroundColor:"grey", paddingTop: "25px"}}>
                                    <h5 style={{color: "white"}}>Please log in into your account</h5>
                                </div>
                                <form style={{marginTop:"0px", paddingTop: "0px"}} id={styles.contact}  method="post" onSubmit={this.onSubmitEvent}>
                                                <label style={{float:"left", color:"purple", paddingTop: "10px"}}><h5>Email:</h5></label>
                                                {errors.email && <span style={{color: "red", fontSize: "28px"}}>{errors.email}</span>}
                                                <input  type='email' name='email' id='email' 
                                                        value = {this.state.email}
                                                        placeholder="For example: lionelmessy@gmail.com"
                                                        onChange={this.onChangeEvent}/>
                                            
                                                <br></br>
                                                <label style={{float:"left", color:"purple"}}><h5>Password: </h5></label>
                                                {errors.password && <span style={{color: "red", fontSize: "28px"}}>{errors.password}</span>}
                                                <input  type='password' name='password' id='password' 
                                                        value = {this.state.password}
                                                        placeholder="For example: LowEte10" 
                                                        onChange={this.onChangeEvent}/>
                                            <label><h3>{this.state.errorMessage}</h3></label>
                                            <br />
                                            
                                            <div>
                                                <button type='submit' disabled={this.state.isLoading} name='btn_login' className='col s12 btn btn-large waves-effect indigo'>Login</button>
                                            </div>
                                            <br></br>
                                            <a href="/signup">Not member? Create an account!</a>
                                    
                                </form>
                            </div>
                        </center>
                        <br/>
                    </main>
                );
        }
}

SignInForm.propTypes = {
    auth: React.PropTypes.object.isRequired,
    login: React.PropTypes.func.isRequired
}

SignInForm.contextTypes = {
    router: React.PropTypes.object.isRequired
}

function mapStateToProps(state){
    return {
        auth: state.auth
    };
}
export default connect(mapStateToProps, { login }) (SignInForm);   
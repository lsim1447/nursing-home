import React from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import styles from '../../css/table-form-design.css';

class SignUpForm extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                newUser: {
                    fullname: '',
                    email: '',
                    password: '', 
                },
                errorMessage: '',
                fullname: '',
                email: '',
                password: '', 
                passwordConfirmation: '',
                errors: {},
                returnValue: [],
                isLoading: false
            }
            this.onChangeEvent = this.onChangeEvent.bind(this);
            this.onSubmitEvent = this.onSubmitEvent.bind(this);
            this.registerNewUser = this.registerNewUser.bind(this);
        }

        onChangeEvent(e){
            this.setState({ [e.target.name]: e.target.value, errorMessage: ''});
        }
        registerNewUser(){
            var formData = new FormData();
            for (var k in this.state.newUser) {
                    formData.append(k, this.state.newUser[k]);
            }
            fetch('http://localhost:8080/exam/users', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; '
                },
                body: formData
             }).then( (response) => {
                return response.json() })   
                    .then( (json) => {
                        if (json[0] != "success"){
                            this.setState({errorMessage: json[0], isLoading:false});
                        } else {
                            const  ex = {
                                fullname: '',
                                email: '',
                                password: '', 
                            }
                            this.setState({returnValue: json,newUser: ex});
                            browserHistory.push("/");
                        }
                });
        }
        onSubmitEvent(e){
            e.preventDefault();
            this.setState({ errors: {}, isLoading: true });
            this.props.userSignupRequest(this.state).then(
                () => {
                    var temp = {
                        fullname: this.state.fullname,
                        email: this.state.email,
                        password: this.state.password, 
                    }
                    this.setState({newUser: temp});
                    this.registerNewUser();
                },
                ({response})=>{
                    this.setState({errors:response.data, isLoading: false});
                }
            );
        }
        render(){
            const { isAuthenticated } = this.props.auth;
            if (isAuthenticated) browserHistory.push('/');
            const {errors} = this.state;
                return (
                    <main>
                        <br/>
                        <center>
                            <div style={{marginTop: "2%"}} className={styles.container}> 
                                 <div style={{height: "100px", backgroundColor:"grey", paddingTop: "25px"}}>
                                        <h5 style={{color: "white"}}>You haven't account? Please register!</h5>
                                </div>
                                <form style={{marginTop:"0px", paddingTop: "20px"}} id={styles.contact} onSubmit={this.onSubmitEvent}>
                                            <label>Full name:</label>
                                            {errors.fullname && <span style={{color: "red", fontSize: "22px"}}>{errors.fullname}</span>}
                                            <input className='validate' type='text' name='fullname' id='fullname' 
                                                    placeholder="For example: Lionel Messi"
                                                    value = {this.state.fullname}
                                                    onChange={this.onChangeEvent}/>
            
                                            <label>Email:</label>
                                            {errors.email && <span style={{color: "red", fontSize: "22px"}}>{errors.email}</span>}
                                            <span style={{color: "red"}}>{this.state.errorMessage}</span>
                                            <input className='validate' type='email' name='email' id='email' 
                                                    value = {this.state.email}
                                                    placeholder="For example: lionelmessy@gmail.com"
                                                    onChange={this.onChangeEvent}/>
                                    
                                            <label>Password:</label>
                                            {errors.password && <span style={{color: "red", fontSize: "22px"}}>{errors.password}</span>}
                                            <input className='validate' type='password' name='password' id='password' 
                                                    value = {this.state.password}
                                                    placeholder="For example: LowEte10"
                                                    onChange={this.onChangeEvent}/>
                                    
                                            <label>Password again:</label>
                                            {errors.passwordConfirmation && <span style={{color: "red", fontSize: "22px"}}>{errors.passwordConfirmation}</span>}
                                            <input className='validate' type='password' name='passwordConfirmation' id='passwordConfirmation' 
                                                    value = {this.state.passwordConfirmation}
                                                    placeholder="For example: LowEte10"
                                                    onChange={this.onChangeEvent}/>
                                    <br />
                                    <center>
                                    <div style={{marginTop: "20px"}}>
                                        <button type='submit' disabled={this.state.isLoading} name='btn_login' className='col s12 btn btn-large waves-effect indigo'>Register</button>
                                    </div>
                                    </center>
                                </form>
                            </div>
                        </center>
                        <br/>
                    </main>
                );
        }
}

SignUpForm.propTypes = {
    auth: React.PropTypes.object.isRequired,
    userSignupRequest: React.PropTypes.func.isRequired
}
function mapStateToProps(state){
    return {
        auth: state.auth
    };
}
export default connect(mapStateToProps) (SignUpForm);  
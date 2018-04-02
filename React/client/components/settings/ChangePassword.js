import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import styles from '../../css/table-form-design.css';
import selectStyle from '../../css/select-design.css';

class ChangePassword  extends Component {
    constructor(props) {
        super(props);
        this.state = {
             modifyUser: {
                    id: '',
                    alvl: '',
                    fullname: '',
                    email: '',
                    oldPassword: '',
                    password: '', 
             },
             allGood: false,
             passwordConfirmation: '',
             isLoading: false, 
             errorMessage: '',
             errors: {
                 fullname: '',
                 email: '',
                 oldPassword: '',
                 password: '',
                 passwordConfirmation: ''
             }
        };
        this.onChangeEvent = this.onChangeEvent.bind(this);
        this.onSubmitEvent = this.onSubmitEvent.bind(this);
        this.onChangeDirectlyState = this.onChangeDirectlyState.bind(this);
        this.checkValidity = this.checkValidity.bind(this);
        this.changeUserData = this.changeUserData.bind(this);
        this.fetchChange = this.fetchChange.bind(this);
    }

    componentDidMount() {
        const usr = {
                    id: this.props.auth.user.sub,
                    alvl: this.props.auth.user.alvl,
                    fullname: this.props.auth.user.fullname,
                    email: this.props.auth.user.email,
                    oldPassword: '',
                    password: '', 
        }
        this.setState({modifyUser: usr, passwordConfirmation: ''});
    }
    checkValidity(){
        if (this.state.modifyUser.oldPassword != ""){
            if (this.state.modifyUser.password != ""){
                if (this.state.passwordConfirmation != ""){
                    if (this.state.modifyUser.password == this.state.passwordConfirmation){
                       const t = Object.assign(this.state, {
                            ["allGood"]: true
                        });
                        this.setState({allGood: t});           
                    } else {
                        const t = Object.assign(this.state.errors, {
                            ["passwordConfirmation"]: 'Passwords must match!'
                        });
                        this.setState({errors: t, allGood: false});    
                    }
                } else {
                    const t = Object.assign(this.state.errors, {
                            ["passwordConfirmation"]: 'This field is required!'
                    });
                    this.setState({errors: t, allGood: false});    
                }
            } else {  
                const t = Object.assign(this.state.errors, {
                    ["password"]: 'This field is required!'
                });
                this.setState({errors: t, allGood:false}); 
            }
        } else {
            const t = Object.assign(this.state.errors, {
                ["oldPassword"]: 'This field is required!'
            });
            this.setState({errors: t, allGood:false}); 
        }
    }

    fetchChange(usr, path){
        fetch( path, {
                method: 'PUT',
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(usr)
                }).then( (response) => {
                    return response.json() })   
                        .then( (json) => { 
                            if (json[0] == "success"){
                                this.componentDidMount();
                            } else if (json[0] == "bad password"){
                                 const  err = {
                                    fullname: '',
                                    email: '',
                                    oldPassword: 'The old password is incorrect!',
                                    password: '',
                                    passwordConfirmation: ''
                                }
                                this.setState({errors: err});
                            } else {
                                this.setState({errorMessage: "The changing of password was unsuccessfull!"});
                            }
            });
    }
    changeUserData(){
        const usr = {
                id:  this.props.auth.user.sub,
                alvl: this.props.auth.user.alvl,
                password: this.state.modifyUser.password,
                oldPassword: this.state.modifyUser.oldPassword,
                fullname: this.state.modifyUser.fullname,
                email: this.state.modifyUser.email
        }
        if (this.props.auth.user.alvl == "inhabitant"){
            this.fetchChange(usr, 'http://localhost:8080/exam/person/change_password');
        } else {
            this.fetchChange(usr, 'http://localhost:8080/exam/users/change_password');
        }
    }
    onChangeEvent(field, event){
        const usr = Object.assign(this.state.modifyUser, {
            [field]: event.target.value
        });
        this.setState({modifyUser: usr});
    }
    onChangeDirectlyState(field, event){
        const pass = Object.assign(this.state, {
            [field]: event.target.value
        });
        this.setState({field: pass});
    }
    onSubmitEvent(e){
            this.setState({errors: {}, errorMessage: ''});
            e.preventDefault();
            this.checkValidity();
            if (this.state.allGood == true){
                this.changeUserData();
            }  else {
                
            }      
    }
    render() {
        const { isAuthenticated } = this.props.auth;
        if (!isAuthenticated) browserHistory.push('/signin');
        return (
          <div>
              <br/>
              <main>
                    <center>
                            <div style={{marginTop: "3%"}} className={styles.container}> 
                                 <div style={{height: "100px", backgroundColor:"grey", paddingTop: "15px"}}>
                                        <h5 style={{color: "white", fontSize:"36px"}}>Change your password!</h5>
                                        <h5 style={{color: "red"}}>{this.state.errorMessage}</h5>
                                </div>
                                <form style={{marginTop:"0px", paddingTop: "20px"}} id={styles.contact} method="get" action="">
                                            <label>Full name:</label>
                                            <input className='validate' type='text' name='fullname' id='fullname' 
                                                    placeholder="For example: Lionel Messi"
                                                    value = {this.state.modifyUser.fullname}
                                                    disabled
                                                    onChange={(event) => this.onChangeEvent('fullname', event)}/>
                                            <label>Email:</label>
                                            <input className='validate' type='email' name='email' id='email' 
                                                    value = {this.state.modifyUser.email}
                                                    placeholder="For example: lionelmessy@gmail.com"
                                                    disabled
                                                    onChange={(event) => this.onChangeEvent('email', event)}/>
                                            <label id={styles.myErrorLabelStyle}>{this.state.errors.oldPassword}</label>
                                            <br/>
                                            <label>Old password:</label>
                                            <input className='validate' type='password' name='password' id='oldPassword' 
                                                    value = {this.state.modifyUser.oldPassword}
                                                    placeholder="For example: waDso1n"
                                                    onChange={(event) => this.onChangeEvent('oldPassword', event)}/>
                                            <label id={styles.myErrorLabelStyle}>{this.state.errors.password}</label>
                                            <br/>
                                            <label>Password:</label>
                                            <input className='validate' type='password' name='password' id='password' 
                                                    value = {this.state.modifyUser.password}
                                                    placeholder="For example: LowEte10"
                                                    onChange={(event) => this.onChangeEvent('password', event)}/>
                                            <label id={styles.myErrorLabelStyle}>{this.state.errors.passwordConfirmation}</label>
                                            <br/>
                                            <label>Password again:</label>
                                            <input className='validate' type='password' name='passwordConfirmation' id='passwordConfirmation' 
                                                    value = {this.state.passwordConfirmation}
                                                    placeholder="For example: LowEte10"
                                                    onChange={(event) => this.onChangeDirectlyState('passwordConfirmation', event)}/>
                                    <br />
                                    <center>
                                    <div style={{marginTop: "20px"}}>
                                        <button type='submit' disabled={this.state.isLoading} name='btn_login' className='col s12 btn btn-large waves-effect indigo' onClick={this.onSubmitEvent}>Save</button>
                                    </div>
                                    </center>
                                </form>
                            </div>
                        </center>
                    </main>
                    <br/>
          </div>
        );
    }
}   

ChangePassword.propTypes = {
    auth: React.PropTypes.object.isRequired,
}

function mapStateToProps(state){
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps) (ChangePassword);
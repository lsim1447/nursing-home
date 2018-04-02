import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import styles from '../../css/table-form-design.css';
import UpdatePersonModal from '../modal/MyModal';
import moment from 'moment';
import swal from 'sweetalert';

class Persons  extends Component {
    constructor(props) {

        super(props);
            this.state = {
                savedid: '',
                newPerson: {
                    name: '',
                    identityNumber: '',
                    associatedPhoneNumber: '',
                    email: '',
                    password: ''
                },
                choosedPerson:{
                    id: '',
                    name: '',
                    identityNumber: '',
                    associatedPhoneNumber: '',
                    email: '',
                    password: ''
                },
                personList: [], 
                errorMessage: '',
                errorName: '',
                errorIdentityNr: '',
                errorPhone: '',
                errorNameModal: '',
                errorIdentityNrModal: '',
                errorPhoneModal: '',
                year:   new Date().getFullYear(),
                month:  new Date().getMonth() + 1,
                day:    new Date().getDate(),
                isLoading: false,
                isModalOpen: false
            };
            this.fieldChanged = this.fieldChanged.bind(this);
            this.choosedFieldChanged = this.choosedFieldChanged.bind(this);
            this.onSubmitEvent = this.onSubmitEvent.bind(this);
            this.renderResultRows = this.renderResultRows.bind(this);
            this.fetchSongDetails = this.fetchSongDetails.bind(this);
            this.closeModal = this.closeModal.bind(this);
            this.openModal = this.openModal.bind(this);
            this.onSubmitEventUpdatePersonData = this.onSubmitEventUpdatePersonData.bind(this);
            this.isNumber = this.isNumber.bind(this);
            this.checkValidIdentity = this.checkValidIdentity.bind(this);
            this.deletePerson = this.deletePerson.bind(this);
    }

    componentDidMount() {
        fetch("http://localhost:8080/exam/person")
            .then( (response) => {
                return response.json() })   
                    .then( (json) => {
                        this.setState({personList: json});
                });
    };

    fieldChanged(field, event) {
        const newpers = Object.assign(this.state.newPerson, {
            [field]: event.target.value
        });
        this.setState({newPerson: newpers, errorMessage: '', errorName: '', errorPhone: '', errorIdentityNr: '', errorEmail: '', errorPassword: ''});
    }
    choosedFieldChanged(field, event) {
        const updatedpers = Object.assign(this.state.choosedPerson, {
            [field]: event.target.value
        });
        this.setState({choosedPerson: updatedpers, errorMessage: '', errorNameModal: '', errorIdentityNrModal: '', errorPhoneModal: '', errorEmailModal: ''});
    }
    isNumber(n){
        return n != "" && Number(n) == n;
    }
    checkValidIdentity(identity){
        var year = "";
        var month = "";
        var day = "";
        if (identity[0] < 3){ year = "19"; } 
        else { year = "20"; }
        year = year + identity[1] + identity[2];
        month = identity[3] + identity[4];
        day = identity[5] + identity[6];
        return moment(month + "/" + day + "/" + year, "MM/DD/YYYY", true).isValid();
    }
    onSubmitEvent(event){
        event.preventDefault();
        var okey = 0;;
        if (this.state.newPerson.name.replace(/ /g,"") != "") okey = okey + 1;
        else this.setState({errorName: "The name is required!"});
        
        if (this.state.newPerson.associatedPhoneNumber.replace(/ /g,"") != "") okey = okey + 1;
        else this.setState({errorPhone: "The phone number is required!"});
        
        if (this.state.newPerson.identityNumber.replace(/ /g,"") == "") {
            this.setState({errorIdentityNr: "The identity number is required!"});
        } else if (this.state.newPerson.identityNumber.length != 13){
            this.setState({errorIdentityNr: "The identity number must contain 13 characters!"});
        } else if (this.isNumber(this.state.newPerson.identityNumber) == false){
            this.setState({errorIdentityNr: "The identity number must be a number."});
        } else if (this.checkValidIdentity(this.state.newPerson.identityNumber) == false) {
            this.setState({errorIdentityNr: "Invalid identity number!"})
        } else {okey = okey + 1;}
        if (this.state.newPerson.email.replace(/ /g,"") == ""){
            this.setState({errorEmail: "The email is required!"});
        } else { okey = okey + 1;}
        if (this.state.newPerson.password.replace(/ /g,"") == ""){
            this.setState({errorPassword: "The password is required!"});
        } else { okey = okey + 1;}
        if (okey == 5){
            var formData = new FormData();
            for (var k in this.state.newPerson) {
                    formData.append(k, this.state.newPerson[k]);
            }
            fetch('http://localhost:8080/exam/person', {
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
                                this.setState({errorMessage: json[0]});
                            } else {
                                this.componentDidMount();
                                const  ex = {
                                    name: '',
                                    identityNumber: '',
                                    associatedPhoneNumber: '',
                                    email: '',
                                    password: ''
                                }
                                this.setState({newPerson: ex});
                            }
                });
        }
        
    }
    onSubmitEventUpdatePersonData(event){
        event.preventDefault();
        var okey = 0;;
        if (this.state.choosedPerson.name.replace(/ /g,"") != "") okey = okey + 1;
        else this.setState({errorNameModal: "The name is required!"});
        
        if (this.state.choosedPerson.associatedPhoneNumber.replace(/ /g,"") != "") okey = okey + 1;
        else this.setState({errorPhoneModal: "The phone number is required!"});
        
        if (this.state.choosedPerson.identityNumber.replace(/ /g,"") == "") {
            this.setState({errorIdentityNrModal: "The identity number is required!"});
        } else if (this.state.choosedPerson.identityNumber.length != 13){
            this.setState({errorIdentityNrModal: "The identity number must contain 13 characters!"});
        } else if (this.isNumber(this.state.choosedPerson.identityNumber) == false){
            this.setState({errorIdentityNrModal: "The identity number must be a number."});
        } else if (this.checkValidIdentity(this.state.choosedPerson.identityNumber) == false) {
            this.setState({errorIdentityNrModal: "Invalid identity number!"})
        } else { okey = okey + 1;}
        
        if (this.state.choosedPerson.email.replace(/ /g,"") == "") {
            this.setState({errorEmailModal: "The email is required!"})
        } else {
            okey = okey + 1;
        }

        if (okey == 4){
            var formData = new FormData();
            for (var k in this.state.choosedPerson) {
                    formData.append(k, this.state.choosedPerson[k]);
            }
            fetch('http://localhost:8080/exam/person', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; '
                },
                body: formData
                }).then(() => {
                    this.componentDidMount();
                    this.closeModal();
            });
        }
    }
    deletePerson(){
            swal({
                        title: "Are you sure?",
                        text: "You will not be able to recover this person!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes, delete it!",
                        cancelButtonText: "No, thanks!",
                        closeOnConfirm: false,
                        closeOnCancel: true
                    },

                    function(isConfirm){
                        if (isConfirm) {
                            fetch('http://localhost:8080/exam/doses/delete_pers/' + this.state.savedid, {
                            method: 'DELETE',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; '
                            },
                            }).then( (response) => {
                                return response.json() })   
                                    .then( (json) => {
                                        if (json[0] == "success"){
                                            fetch('http://localhost:8080/exam/person/delete/' + this.state.savedid, {
                                                method: 'DELETE',
                                                headers: {
                                                    'Accept': 'application/json',
                                                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; '
                                                },
                                                }).then(() => {
                                                    this.closeModal();
                                                    this.componentDidMount();
                                                    swal("Deleted!", this.state.choosedPerson.name + " has been deleted from nursing homes!.", "success");
                                            });
                                        } else {
                                            this.setState({errorMessage: json[0]});
                                            swal("Error!", "Deletion was unsuccesfull", "error");
                                        }
                            });

                        } else {
                            swal("Cancelled", "Your imaginary file is safe :)", "error");
                        }
                    }.bind(this))
            
    }
    fetchSongDetails(person, event){
            const  temp = {
                id: person.id,
                name: person.name,
                identityNumber: person.identityNumber,
                associatedPhoneNumber: person.associatedPhoneNumber,
                email: person.email,
                password: person.password
            }
            this.setState({choosedPerson: temp, savedid: person.id});
            this.openModal();
    }

    renderResultRows() {
        return this.state.personList.map((person, index) => { 
            var year  = "19" + person.identityNumber.substr(1,2);
            var month = person.identityNumber.substr(3,2);
            var day = person.identityNumber.substr(5,2);
            var age;
            if (this.state.month>month){
                age = this.state.year - year;
            } else {
                if (this.state.month == month){
                    if (this.state.day >= day){
                        age = this.state.year - year;
                    }
                    else{
                        age = this.state.year - year - 1;
                    }
                }
                else{
                    age = this.state.year - year -1;
                }
            }
            if (person.identityNumber.substr(0,1) > 2) age = age - 100;
            return (
                <tr key={index} data-item={person} onClick={(event) => this.fetchSongDetails(person, event)}>
                    <td > {person.name} </td>
                    <td > {person.identityNumber} </td>
                    <td  style={{width: "50px"}}> {age}</td>
                    <td > {person.associatedPhoneNumber} </td>
                    <td  style={{width: "150px"}}> {person.email} </td>
                </tr>
            );
        });  
    }
    openModal() {
      this.setState({ isModalOpen: true })
    }

    closeModal() {
      this.setState({ isModalOpen: false, errorNameModal: '', errorEmailModal: '', errorIdentityNrModal: '', errorPhoneModal: ''})
    }
    checkType(){
        return (
             <tbody id={styles.persTbody}> 
                    {this.renderResultRows()}
            </tbody>
        );
    }
    render() {
        const { isAuthenticated } = this.props.auth;
        if (!isAuthenticated) browserHistory.push('/signin');
        else if (this.props.auth.user.alvl == 'inhabitant') browserHistory.push('/404_not_found');
        return (
            <div>
                <UpdatePersonModal isOpen={this.state.isModalOpen} onClose={() => this.closeModal()}>
                    <img id="close" src="http://icons.iconarchive.com/icons/custom-icon-design/office/256/close-icon.png" alt="" style={{position:"absolute" ,right: "-35px", top: "-35px"}} width="40px" height="40px" onClick={() => this.closeModal()}/>
                    <form  id={styles.contact} action="" method="get" style={{paddingBottom:"5%", paddingTop:"3%", marginBottom:0, marginTop:0}}>
                                    <br/>
                                    <center> <label className={styles.myBigLabel}><strong> Update person data </strong></label> </center>
                                    <br/><br/>
                                    <label><h6>Name:</h6></label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorNameModal}</label>
                                    <fieldset>
                                        <input placeholder="Name of the perso" type="text" tabIndex="6" required autoFocus defaultValue={this.state.choosedPerson.name}  onChange={(event) => this.choosedFieldChanged('name', event)}/>
                                    </fieldset>
                                     <label><h6>Identity number:</h6></label>
                                     <label id={styles.myErrorLabelStyle}>{this.state.errorIdentityNrModal}</label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorMessage}</label>
                                    <fieldset>
                                        <input placeholder="Identity number of the person" type="text" tabIndex="7" required defaultValue={this.state.choosedPerson.identityNumber}  onChange={(event) => this.choosedFieldChanged('identityNumber', event)}/>
                                    </fieldset>
                                    <label><h6>Phone number:</h6></label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorPhoneModal}</label>
                                    <fieldset>
                                        <input placeholder="Associated person's phone number" type="text" tabIndex="8" required defaultValue={this.state.choosedPerson.associatedPhoneNumber}  onChange={(event) => this.choosedFieldChanged('associatedPhoneNumber', event)}/>
                                    </fieldset>
                                    <label><h6>Email:</h6></label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorEmailModal}</label>
                                    <fieldset>
                                        <input placeholder="Associated person's email" type="text" tabIndex="9" required defaultValue={this.state.choosedPerson.email}  onChange={(event) => this.choosedFieldChanged('email', event)}/>
                                    </fieldset>
                                    <fieldset>
                                        <button name="submit" type="submit" id="contact-submit" data-submit="...Sending" onClick={this.onSubmitEventUpdatePersonData}>Update</button>
                                    </fieldset>
                                    <div> <button name="delete" type="button" id="contact-submit" onClick={() => this.deletePerson()}>Delete</button> </div>

                    </form>
                    
                </UpdatePersonModal>
                <div id={styles.block_container}>
                    <div className={styles.inonelineTable} id={styles.block1}>
                        <table className={styles.mytablebl}>
                            <thead className={styles.aboveTable}>
                                The inhabitants of the nursing homes
                            </thead>
                            <thead>
                                <tr >
                                    <th>Name</th>
                                    <th>Identity number</th>
                                    <th style={{width: "50px"}}>Age</th>
                                    <th>Phone number</th>
                                    <th style={{width: "150px"}}>Email</th>
                                </tr>
                            </thead>
                            
                            {this.checkType()}

                            <thead>
                                <tr >
                                    <th></th>
                                    <th></th>
                                    <th style={{width: "50px"}}></th>
                                    <th></th>
                                    <th style={{width: "150px"}}></th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className={styles.inonelineForm} id={styles.block2}>
                        <br/>                    
                    
                        <div className={styles.container}>  
                                <form id={styles.contact} action="" method="get">
                                    <center> <label className={styles.myBigLabel}><strong> Add new person to the nursing room </strong></label> </center>
                                    <br/><br/>
                                    <label className={styles.myNormalLabels}>Person name:</label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorName}</label>
                                    <fieldset>
                                        <input placeholder="Name of the person:" type="text" tabIndex="1" required autoFocus value={this.state.newPerson.name}  onChange={(event) => this.fieldChanged('name', event)}/>
                                    </fieldset>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorMessage}</label>
                                    <label className={styles.myNormalLabels}>Identity number:</label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorIdentityNr}</label>
                                    <fieldset>
                                        <input placeholder="Identity number of the person:" type="text" tabIndex="2" required value={this.state.newPerson.identityNumber}  onChange={(event) => this.fieldChanged('identityNumber', event)}/>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Phone number:</label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorPhone}</label>
                                    <fieldset>
                                        <input placeholder="Associated person's phone number:" type="text" tabIndex="3" required value={this.state.newPerson.associatedPhoneNumber}  onChange={(event) => this.fieldChanged('associatedPhoneNumber', event)}/>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Email:</label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorEmail}</label>
                                    <fieldset>
                                        <input placeholder="Associated person's email:" type="text" tabIndex="4" required value={this.state.newPerson.email}  onChange={(event) => this.fieldChanged('email', event)}/>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Password:</label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorPassword}</label>
                                    <fieldset>
                                        <input placeholder="Password:" type="password" tabIndex="5" required value={this.state.newPerson.password}  onChange={(event) => this.fieldChanged('password', event)}/>
                                    </fieldset>
                                    <fieldset>
                                        <button name="submit" type="submit" id="contact-submit" data-submit="...Sending" onClick={this.onSubmitEvent}>Submit</button>
                                    </fieldset>
                                </form>
                        </div>
                        
                    </div>
                </div>
            </div>
        );
    }
}   

Persons.propTypes = {
    auth: React.PropTypes.object.isRequired
}

function mapStateToProps(state){
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps) (Persons);
import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import styles from '../../css/table-form-design.css';
import selectStyle from '../../css/select-design.css';
import MyModal from '../modal/MyModal';

class Settings  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            choosedUser: {
                id: '',
                alvl: '',
                fullname: '',
                email: ''
            },
            authentication:{
               isAuthenticated: false,
               user: null
            },
            userList: [],
            isModalOpen: false
        };
        this.choosedFieldChanged = this.choosedFieldChanged.bind(this);
        this.getAllUser = this.getAllUser.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.fetchUserDetails = this.fetchUserDetails.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.modifyUser = this.modifyUser.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    openModal() {
      this.setState({ isModalOpen: true});
    }
    closeModal() {
      this.setState({ isModalOpen: false});
    }
    componentDidMount() {
        this.getAllUser();
    }
    choosedFieldChanged(field, event) {
        const choo = Object.assign(this.state.choosedUser, {
            [field]: event.target.value
        });
        this.setState({choosedUser: choo});
    }
    getAllUser(){
        fetch("http://localhost:8080/exam/users/all")
            .then( (response) => {
                return response.json() })   
                    .then( (json) => {
                        this.setState({userList: json});
            });
    }
    deleteUser(){
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this!",
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
                fetch('http://localhost:8080/exam/users/' + this.state.choosedUser.id, {
                        method: 'DELETE',
                        headers: { 
                            'Accept': 'application/json',
                            'Content-Type': 'application/json' 
                        }
                        }).then( (response) => {
                            return response.json() })   
                                .then( (json) => {
                                    this.getAllUser();
                                    this.closeModal();
                                    swal("Deleted!", this.state.choosedUser.name + " has been deleted.", "success");
                });
            } else {
                swal("Cancelled", "This user is safe :)", "error");
            }
        }.bind(this));
    }
    modifyUser(){
        fetch('http://localhost:8080/exam/users/update', {
                method: 'PUT',
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(this.state.choosedUser)
                }).then( (response) => {
                    return response.json() })   
                        .then( (json) => {
                            this.getAllUser();
                            this.closeModal();
                });
    }
    fetchUserDetails(user, event){
            var  temp = {
                id: user.id,
                alvl: user.alvl,
                fullname: user.fullname,
                email: user.email
            }
            this.setState({choosedUser: temp});
            this.openModal();
    }
    renderAllResultRows() {
        return this.state.userList.map((user, index) => { 
            if (this.props.auth.user.alvl == 'admin'){
                if (user.alvl == "admin"){
                    return (
                        <tr key={index} data-item={user} onClick={(event) => this.fetchUserDetails(user, event)}>
                            <td> {user.fullname} </td>
                            <td><img  id={styles.block2} style={{float: "right"}} src="http://sgps.in/admin/images/login_icon.png" alt="" style={{width:"30px", height:"30px"}}  className="circle"/></td>
                            <td> </td>
                        </tr>
                    );
                } else {
                    return (
                        <tr key={index} data-item={user} onClick={(event) => this.fetchUserDetails(user, event)}>
                            <td> {user.fullname} </td>
                            <td> </td>
                            <td><img  id={styles.block2} style={{float: "right"}} src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/220px-User_icon_2.svg.png" alt="" style={{width:"30px", height:"30px"}}  className="circle"/></td>
                        </tr>
                    );
                }
            } else {
                if (user.alvl == "admin"){
                    return (
                        <tr key={index} data-item={user}>
                            <td> {user.fullname} </td>
                            <td><img  id={styles.block2} style={{float: "right"}} src="http://sgps.in/admin/images/login_icon.png" alt="" style={{width:"30px", height:"30px"}}  className="circle"/></td>
                            <td> </td>
                        </tr>
                    );
                } else {
                    return (
                        <tr key={index} data-item={user}>
                            <td> {user.fullname} </td>
                            <td> </td>
                            <td><img  id={styles.block2} style={{float: "right"}} src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/220px-User_icon_2.svg.png" alt="" style={{width:"30px", height:"30px"}}  className="circle"/></td>
                        </tr>
                    );
                }
            }
        });  
    }
    renderTable(){
            return (
                <table className={styles.mytablebl}>
                    <thead>
                        <tr>
                            <th><h5>The accesses of the users</h5></th>
                        </tr>
                    </thead>
                    <thead>
                            <tr >
                                <th></th>
                                <th>admin</th>
                                <th>nurse</th>
                            </tr>
                    </thead>
                    <tbody> 
                            {this.renderAllResultRows()}
                    </tbody>
                    <thead>
                            <tr >
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                    </thead>
                </table>
            );
    }
    render() {
        const { isAuthenticated, user } = this.props.auth;
        if (!isAuthenticated) browserHistory.push('/signin');
        
        return (
          <div>
                <br/>
                <MyModal isOpen={this.state.isModalOpen} onClose={() => this.closeModal()}>
                    <img id="close" src="http://icons.iconarchive.com/icons/custom-icon-design/office/256/close-icon.png" alt="" style={{position:"absolute" ,right: "-35px", top: "-35px"}} width="40px" height="40px" onClick={() => this.closeModal()}/>
                    <div className={styles.container} >  
                                <form id={styles.contact} action="" method="get" style={{paddingBottom:"5%", paddingTop:"3%", marginBottom:0, marginTop:0}}>
                                    <br/>
                                    <center> <label className={styles.myBigLabel}><strong> Update  access </strong></label> </center>
                                    <br/><br/>
                                    <label className={styles.myNormalLabels}>Full name:</label>
                                    <fieldset>
                                        <input placeholder="Full name:" type="text" tabIndex="1" disabled required value={this.state.choosedUser.fullname}  onChange={(event) => this.choosedFieldChanged('fullname', event)}/>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Access:</label>
                                    <fieldset>
                                        <select className={selectStyle.myselect} defaultValue={this.state.choosedUser.alvl} tabIndex="2" onChange={(event) => this.choosedFieldChanged('alvl', event)}>
                                            <option className={selectStyle.myoptions}>admin</option>
                                            <option className={selectStyle.myoptions}>user</option>
                                        </select>
                                    </fieldset>
                                    <div> <button name="delete" type="button" id="contact-submit" onClick={() => this.deleteUser()}>Delete</button> </div>
                                    <fieldset>
                                        <button name="submit" style={{background: "green"}} type="button" id="contact-submit" data-submit="...Sending" onClick={this.modifyUser}>Update</button>
                                    </fieldset>
                                </form>
                    </div>
                </MyModal>
                <div id={styles.block_container} style={{marginTop: "2%"}}>
                            <div className={styles.inonelineTable} id={styles.block1}>
                                {this.renderTable()}
                            </div>
                            <div className={styles.inonelineTable} id={styles.block2}>

                            </div>
                </div>
         </div>
        );
    }
}   

Settings.propTypes = {
    auth: React.PropTypes.object.isRequired
}

function mapStateToProps(state){
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps) (Settings);
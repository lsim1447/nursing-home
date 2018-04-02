import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import styles from '../../css/table-form-design.css';
import selectStyle from '../../css/select-design.css';
import imageStyle from '../../css/ImageCSS.css';
import textShadow from '../../css/TextShadow.css';
import MyModal from '../modal/MyModal';

class CureSettings  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            selectedTreatment: '',
            active: true,
            choosedCure : {
                id: '',
                personName: '',
                description: '',
                firstdate: '',
                lastdate: ''
            },
            selected: {
                name: '',
                id: '-1'
            },
            newAppointment: {
                time: '',
                medicineName: '',
                medicineType: '',
                quantity: ''
            },
            allTreatment: [],
            medicineNames: [],
            medicineTypes: [],
            personNames: [], 
            appointments: [],
            isAppointmentModalOpen: false,
            isTreatmentModalOpen: false,
            errorTime: '',
            errorTimeModal: '',
            errorQuantity: '',
            errorQuantityModal: '',
        };
        this.selectedNameChanged = this.selectedNameChanged.bind(this);
        this.cureDayFieldChanged = this.cureDayFieldChanged.bind(this);
        this.activeChange = this.activeChange.bind(this);
        this.cureFieldChanged = this.cureFieldChanged.bind(this);

        this.closeAppointmentModal = this.closeAppointmentModal.bind(this);
        this.openAppointmentModal = this.openAppointmentModal.bind(this);
        this.closeTreatmentModal = this.closeTreatmentModal.bind(this);
        this.openTreatmentModal = this.openTreatmentModal.bind(this);

        this.renderAllResultRows = this.renderAllResultRows.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.renderAppointments = this.renderAppointments.bind(this);
        this.renderAppointmentsRows = this.renderAppointmentsRows.bind(this);
        this.isNumber = this.isNumber.bind(this);

        this.getAllTreatment = this.getAllTreatment.bind(this);
        this.getAllTreatmentByName = this.getAllTreatmentByName.bind(this);
        this.deleteTreatment = this.deleteTreatment.bind(this);
        this.modifyTreatment - this.modifyTreatment.bind(this);

        this.renderMedicineNames = this.renderMedicineNames.bind(this);
        this.renderMedicineTypes = this.renderMedicineTypes.bind(this);
        this.renderPersonNames = this.renderPersonNames.bind(this);

        this.getTypeByMedicineName = this.getTypeByMedicineName.bind(this);
        this.getMedicineNames = this.getMedicineNames.bind(this);
        this.getPersonNames = this.getPersonNames.bind(this);

        this.treatmentClicked = this.treatmentClicked.bind(this);
        this.showAppointments = this.showAppointments.bind(this);
        this.addNewAppointment = this.addNewAppointment.bind(this);
        this.deleteExistingAppointment = this.deleteExistingAppointment.bind(this);
    }
    componentDidMount() {
        this.getMedicineNames();
        this.getPersonNames();
    }
    cureDayFieldChanged(field, event) {
        const cur = Object.assign(this.state.newAppointment, {
            [field]: event.target.value
        });
        this.setState({tempCurrentDay: cur});
        if (field == "medicineName"){
            this.getTypeByMedicineName(event.target.value);
        }
    }
    selectedNameChanged(field, event) {
        const lim = Object.assign(this.state.selected, {
            [field]: event.target.value
        });
        this.setState({select: lim});
        this.getAllTreatmentByName(event.target.value, this.state.active);
    }
    cureFieldChanged(field, event) {
        const cur = Object.assign(this.state.choosedCure, {
            [field]: event.target.value
        });
        this.setState({choosedCure: cur});
    }
    openAppointmentModal() {
      if (this.state.selected.id > -1){
          this.setState({isAppointmentModalOpen: true});
      }
      this.setState({errorQuantity: '', errorTime: ''});
    }
    openTreatmentModal(){
        this.setState({isTreatmentModalOpen: true});
    }
    closeTreatmentModal(){
        this.setState({isTreatmentModalOpen: false});
    }
    activeChange(field, event){
        if (field == "active"){
             this.getAllTreatmentByName(this.state.selected.name, true);
             this.setState({active: true});
        } else {
            this.getAllTreatmentByName(this.state.selected.name, false);
            this.setState({active: false});
        }
       
    }
    closeAppointmentModal() {
      this.setState({ isAppointmentModalOpen: false, errorQuantityModal: '', errorTimeModal: '' });
    }

    isNumber(n){
        return n != "" && Number(n) == n;
    }
    getAllTreatmentByName(persname, active){
        var t = {
            name: this.state.selected.name,
            id: '-1'
        }
        this.setState({selected: t});
        var req = {
            persname: persname,
            isactive: active
        }
         fetch('http://localhost:8080/exam/cure/all/name', {
                method: 'POST',
                headers: { 
                        'Accept': 'application/json',
                        'Content-Type': 'application/json' 
                },
                body: JSON.stringify(req)
        }).then( (response) => {
                    return response.json() })   
                        .then( (json) => {
                            this.setState({allTreatment: json});
                            this.setState({appointments: []});
        });
    }
    getAllTreatment(){
        fetch('http://localhost:8080/exam/cure/all', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; '
                }
        }).then( (response) => {
                    return response.json() })   
                        .then( (json) => {
                            this.setState({allTreatment:json});
        });
    }
    getTypeByMedicineName(medname){
        fetch('http://localhost:8080/exam/storage/medicine/types/' + medname, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; '
                }
        }).then( (response) => {
                    return response.json() })   
                        .then( (json) => {
                            this.setState({medicineTypes:json});
                            var newApp = {
                                    time: this.state.newAppointment.time,
                                    medicineName: this.state.newAppointment.medicineName,
                                    medicineType: json[0],
                                    quantity: this.state.newAppointment.quantity
                            }
                            this.setState({newAppointment: newApp});
            
        });
    }
    getMedicineNames(){
        fetch("http://localhost:8080/exam/storage/medicine/names")
            .then( (response) => {
                return response.json() })   
                    .then( (json) => {
                        this.setState({medicineNames: json});
                            this.getTypeByMedicineName(json[0]);
                             var newApp = {
                                    time: this.state.newAppointment.time,
                                    medicineName: json[0],
                                    medicineType: this.state.newAppointment.medicineType,
                                    quantity: this.state.newAppointment.quantity
                            }
                            this.setState({newAppointment: newApp});

        });
    }
    getPersonNames(){
        fetch("http://localhost:8080/exam/person/getallname")
            .then( (response) => {
                return response.json() })   
                    .then( (json) => {
                        this.setState({personNames: json});
        });
    }
    showAppointments(treatment, index, event){
        var t = {
            name: this.state.selected.name,
            id: index
        }
        this.setState({selected: t, selectedTreatment: treatment.id});
        fetch('http://localhost:8080/exam/daily_cure/cureid', {
                method: 'POST',
                headers: { 
                        'Accept': 'application/json',
                        'Content-Type': 'application/json' 
                },
                body: JSON.stringify(treatment.id)
        }).then( (response) => {
                    return response.json() })   
                        .then( (json) => {
                            this.setState({appointments :json});
        });
    }
    addNewAppointment(event){
        var okey = true;
        if (this.state.newAppointment.time == ""){
            okey = false;
            this.setState({errorTimeModal: "This field is required!"});
        }
        if (this.state.newAppointment.quantity == ""){
            okey = false;
            this.setState({errorQuantityModal: "This field is required!"});
        } else if (!this.isNumber(this.state.newAppointment.quantity)){
            okey = false;
            this.setState({errorQuantityModal: "The quantity must be a number!"});
        }
        if (okey){
            var app = {
                cureid: this.state.selectedTreatment,
                time: this.state.newAppointment.time,
                medicinename: this.state.newAppointment.medicineName,
                medicinetype: this.state.newAppointment.medicineType,
                quantity: this.state.newAppointment.quantity
            }
            fetch('http://localhost:8080/exam/daily_cure/new', {
                method: 'POST',
                headers: { 
                        'Accept': 'application/json',
                        'Content-Type': 'application/json' 
                },
                body: JSON.stringify(app)
                }).then( (response) => {
                    return response.json() })   
                        .then( (json) => {
                            var listOfAppointments = this.state.appointments;
                            listOfAppointments.push(json);
                            this.setState({appointments: listOfAppointments});    
                        }
                );
            this.closeAppointmentModal();
        }
    }
    deleteExistingAppointment(appointment, index, event){
       swal({
            title: "Warning!",
            text: "You definitely want to delete this appointment?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, thanks!",
            closeOnConfirm: true,
            closeOnCancel: true
            },
            function(isConfirm){
            if (isConfirm) {
                fetch('http://localhost:8080/exam/daily_cure/delete', {
                    method: 'DELETE',
                    headers: { 
                            'Accept': 'application/json',
                            'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify(appointment.id)
                }).then( (response) => {
                    return response.json() })   
                        .then( (json) => {
                            var temp = this.state.appointments;
                            delete temp[index];
                            this.setState({appointments: temp});
                            this.closeAppointmentModal();
                        }
                );
            } else {
                swal("Cancelled", "Your imaginary file is safe :)", "error");
            }
        }.bind(this));
    }
    deleteTreatment(treatment, index, event){
        swal({
            title: "Warning!",
            text: "You definitely want to delete this treatment?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, thanks!",
            closeOnConfirm: true,
            closeOnCancel: true
            },
            function(isConfirm){
            if (isConfirm) {
                fetch('http://localhost:8080/exam/cure/delete', {
                    method: 'DELETE',
                    headers: { 
                            'Accept': 'application/json',
                            'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify(treatment.id)
                }).then( (response) => {
                    return response.json() })   
                        .then( (json) => {
                            if (json == 1){
                                fetch('http://localhost:8080/exam/daily_cure/delete/cureid', {
                                    method: 'DELETE',
                                    headers: { 
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json' 
                                    },
                                    body: JSON.stringify(treatment.id)
                                }).then( (response) => {
                                    return response.json() })   
                                        .then( (json) => {
                                            this.setState({appointments: []});
                                            this.getAllTreatmentByName(this.state.selected.name, this.state.active);
                                        }
                                );
                            }
                        }
                );
            } else {
                swal("Cancelled", "Your imaginary file is safe :)", "error");
            }
        }.bind(this));
    }
    modifyTreatment(event){
        if (this.state.choosedCure.firstdate == ""){
            swal("Warning!", "Please set the first date of the cure!", "warning");
        } else if (this.state.choosedCure.lastdate == ""){
            swal("Warning!", "Please set the last date of the cure!", "warning");
        } else  if (this.state.choosedCure.firstdate > this.state.choosedCure.lastdate){
            swal("Warning!", "The last date is earlier than the first date!", "warning");
        } else  if (this.state.choosedCure.description == ""){
            swal("Warning!", "Please set a description for the treatment!", "warning");
        }else{
            fetch('http://localhost:8080/exam/cure', {
                method: 'POST',
                headers: { 
                        'Accept': 'application/json',
                        'Content-Type': 'application/json' 
                },
                body: JSON.stringify(this.state.choosedCure)
                }).then( (response) => {
                    return response.json() })   
                        .then( (json) => {
                            if (json != -1){
                                 this.getAllTreatmentByName(this.state.selected.name, this.state.active);
                                 this.closeTreatmentModal();                           
                            }
                        });
        }
    }
    treatmentClicked(treatment, index, event){
        this.openTreatmentModal();
        var temp = {
                id: treatment.id,
                personName: treatment.pers.name,
                description: treatment.description,
                firstdate: treatment.firstdate,
                lastdate: treatment.lastdate
        }
        this.setState({choosedCure: temp});
    }
    renderAllResultRows() {
        return this.state.allTreatment.map((treatment, index) => { 
            if (index == this.state.selected.id){
                return (
                <tr key={index} data-item={treatment} style={{background: "green", color: "white"}}>
                    <td onClick={(event) => this.treatmentClicked(treatment, index, event)}> {treatment.description} </td>
                    <td onClick={(event) => this.treatmentClicked(treatment, index, event)} > {treatment.firstdate} </td>
                    <td onClick={(event) => this.treatmentClicked(treatment, index, event)}> {treatment.lastdate} </td>
                    <td style={{width: "50px"}} onClick={(event) => this.deleteTreatment(treatment, index, event)}>
                            <img  id={styles.block2} style={{float: "right"}} src="http://findicons.com/files/icons/2711/free_icons_for_windows8_metro/256/delete.png" alt="" style={{width:"30px", height:"30px"}}  className="circle"/>
                    </td>
                    <td style={{width: "50px"}}  onClick={(event) => this.showAppointments(treatment, index, event)}>
                        <img  id={styles.block2} style={{float: "right"}} src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-arrow-right-b-128.png" alt="" style={{width:"30px", height:"30px"}}  className="circle"/>
                    </td>
                </tr>
            );
            } else {
                return (
                <tr key={index} data-item={treatment}>
                    <td onClick={(event) => this.treatmentClicked(treatment, index, event)}> {treatment.description} </td>
                    <td onClick={(event) => this.treatmentClicked(treatment, index, event)}> {treatment.firstdate} </td>
                    <td onClick={(event) => this.treatmentClicked(treatment, index, event)}> {treatment.lastdate} </td>
                    <td style={{width: "50px"}} onClick={(event) => this.deleteTreatment(treatment, index, event)}>
                            <img  id={styles.block2} style={{float: "right"}} src="http://findicons.com/files/icons/2711/free_icons_for_windows8_metro/256/delete.png" alt="" style={{width:"30px", height:"30px"}}  className="circle"/>
                    </td>
                    <td style={{width: "50px"}}  onClick={(event) => this.showAppointments(treatment, index,  event)}>
                        <img  id={styles.block2} style={{float: "right"}} src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-arrow-right-b-128.png" alt="" style={{width:"30px", height:"30px"}}  className="circle"/>
                    </td>
                </tr>
            );
            }
        });  
    }
    renderTable(){
            return (
                <table className={styles.mytableb} style={{marginTop: 0}}>
                    <thead className={styles.aboveTable}>
                         Treatments
                    </thead>
                    <thead>
                            <tr >
                                <th>Description </th>
                                <th>First date</th>
                                <th>Last date</th>
                                <th style={{width: "50px", height: "58px"}}></th>
                                <th style={{width: "50px", height: "58px"}}></th>
                            </tr>
                    </thead>
                    <tbody className={styles.myTbody}> 
                        {this.renderAllResultRows()}
                    </tbody>
                    <thead>
                            <tr >
                                <th></th>
                                <th></th>
                                <th></th>
                                <th style={{width: "50px"}}></th>
                                <th style={{width: "50px"}}></th>
                            </tr>
                    </thead>
                </table>
            );
    }
    renderAppointments(){
            return (
                <table className={styles.mytableb} style={{marginTop: 0}}>
                    <thead className={styles.aboveTable}>
                         Details
                    </thead>
                    <thead>
                            <tr >
                                <th>Appointment</th>
                                <th>Medicine</th>
                                <th>Type</th>
                                <th>Quantity</th>
                                <th style={{width: "50px"}} onClick={(event) => this.openAppointmentModal()}> 
                                    <img  id={styles.block2} style={{float: "right", backgroundColor: "white"}} src="https://image.freepik.com/free-icon/add-document_318-8474.jpg" alt="" style={{width:"30px", height:"30px"}}  className="circle"/>
                                </th>
                            </tr>
                    </thead>
                    <tbody className={styles.myTbody}> 
                        {this.renderAppointmentsRows()}
                    </tbody>
                    <thead>
                            <tr >
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th style={{width: "50px"}}></th>
                            </tr>
                    </thead>
                </table>
            );
    }
    renderAppointmentsRows() {
        return this.state.appointments.map((appointment, index) => { 
                return (
                    <tr key={index} data-item={appointment}>
                        <td > {appointment.time} </td>
                        <td > {appointment.med.medicinetype.name} </td>
                        <td > {appointment.med.name} </td>
                        <td > {appointment.quantity} </td>
                        <td style={{width: "50px"}} onClick={(event) => this.deleteExistingAppointment(appointment, index, event)}>
                            <img  id={styles.block2} style={{float: "right"}} src="http://findicons.com/files/icons/2711/free_icons_for_windows8_metro/256/delete.png" alt="" style={{width:"30px", height:"30px"}}  className="circle"/>
                        </td>
                    </tr>
            );
        });  
    }
    renderMedicineNames(){
        return this.state.medicineNames.map((medname, index) => {
            return (
                   <option key={index}>{medname}</option>
                );
            });  
    }
    renderMedicineTypes(){
        return this.state.medicineTypes.map((type, index) => {
            return (
                   <option key={index}>{type}</option>
                );
            });  
    }
    renderPersonNames(){
        return this.state.personNames.map((persname, index) => {
            return (
                   <option className={selectStyle.myoption} key={index}>{persname}</option>
                );
            });  
    }
    render() {
        const { isAuthenticated } = this.props.auth;
        if (!isAuthenticated) browserHistory.push('/signin');
        else if (this.props.auth.user.alvl == 'inhabitant') browserHistory.push('/404_not_found');
        return (
          <div>
               <MyModal isOpen={this.state.isAppointmentModalOpen} onClose={() => this.closeAppointmentModal()}>
                    <img id="close" src="http://icons.iconarchive.com/icons/custom-icon-design/office/256/close-icon.png" alt="" style={{position:"absolute" ,right: "-35px", top: "-35px"}} width="40px" height="40px" onClick={() => this.closeAppointmentModal()}/>
                    <form id={styles.contact} action="" method="get" style={{paddingBottom:"5%", paddingTop:"3%", marginBottom:0, marginTop:0}}>
                                    <br/>
                                    <center> <label className={styles.myBigLabel}><strong> Set new appointment </strong></label> </center>
                                    <br/><br/>
                                    <label className={styles.myNormalLabels}>Appointment:</label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorTimeModal}</label>
                                    <fieldset>
                                        <input type="time" name="time"  tabIndex="2" value={this.state.newAppointment.time}  onChange={(event) => this.cureDayFieldChanged('time', event)}/>
                                    </fieldset>
                                     <label className={styles.myNormalLabels}>Name of the medicine:</label>
                                    <fieldset>
                                        <select className={selectStyle.myselect} defaultValue={this.state.medicineNames[0]} tabIndex="3" onChange={(event) => this.cureDayFieldChanged('medicineName', event)}>
                                            {this.renderMedicineNames()}
                                        </select>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Type of the medicine:</label>
                                    <fieldset>
                                        <select className={selectStyle.myselect} defaultValue={this.state.medicineTypes[0]} tabIndex="4" onChange={(event) => this.cureDayFieldChanged('medicineType', event)}>
                                            {this.renderMedicineTypes()}
                                        </select>
                                    </fieldset>
                                     <label className={styles.myNormalLabels}>Quantity:</label>
                                     <label id={styles.myErrorLabelStyle}>{this.state.errorQuantityModal}</label>
                                    <fieldset>
                                        <input placeholder="Quantity" type="text" tabIndex="5" required value={this.state.newAppointment.quantity}  onChange={(event) => this.cureDayFieldChanged('quantity', event)}/>
                                    </fieldset>
                                    <fieldset>
                                        <button name="update" type="button" style={{background: "green"}} id="contact-submit" data-submit="...Sending" onClick={(event) => this.addNewAppointment(event)}>Add</button>
                                    </fieldset>
                        </form>
              
              </MyModal>
              <MyModal isOpen={this.state.isTreatmentModalOpen} onClose={() => this.closeTreatmentModal()}>
                    <img id="close" src="http://icons.iconarchive.com/icons/custom-icon-design/office/256/close-icon.png" alt="" style={{position:"absolute" ,right: "-35px", top: "-35px"}} width="40px" height="40px" onClick={() => this.closeTreatmentModal()}/>
                <form id={styles.contact} action="" method="get" style={{paddingBottom:"5%", paddingTop:"3%", marginBottom:0, marginTop:0}}>    
                    <br/>
                        <center> <label className={styles.myBigLabel}><strong> Change the treatment's parameters </strong></label> </center>
                    <br/><br/>
                    <label className={styles.myNormalLabels}>Treatment's description:</label>
                    <label id={styles.myErrorLabelStyle}>{this.state.errorDescription}</label>
                    <fieldset>
                        <input placeholder="Description" type="text" tabIndex="2" required value={this.state.choosedCure.description}  onChange={(event) => this.cureFieldChanged('description', event)}/>
                    </fieldset>
                    <label className={styles.myNormalLabels}>The date of the begining threatment:</label>
                    <fieldset>
                        <input type="date" name="firstdate"  tabIndex="3" value={this.state.choosedCure.firstdate}  onChange={(event) => this.cureFieldChanged('firstdate', event)}/>
                    </fieldset>
                    <label className={styles.myNormalLabels}>The date of the ending threatment:</label>
                    <fieldset>
                        <input type="date" name="lastdate"  tabIndex="4" value={this.state.choosedCure.lastdate}  onChange={(event) => this.cureFieldChanged('lastdate', event)}/>
                    </fieldset>
                    <fieldset>
                        <button name="submit" type="button" id="contact-submit" data-submit="...Sending" onClick={(event) => this.modifyTreatment(event)} style={{background: "green"}}>Modify</button>
                    </fieldset>
                </form>
              </MyModal>
               <div id={styles.block_container}>
                    <div className={styles.inonelineTable} id={styles.block1}>
                         <div style={{minWidth: "1225px", marginTop: "20px"}}>
                            <select  
                                style={{marginTop: "9%", color: "white", backgroundColor: "#245454", marginBottom: 0}} 
                                className={selectStyle.myselect}
                                classID={selectStyle.ownSelect} 
                                defaultValue={this.state.personNames[0]} 
                                tabIndex="1" 
                                onChange={(event) => this.selectedNameChanged('name', event)}>
                                        <option className={selectStyle.myoption} disabled selected>-- Choose a name --</option>
                                        {this.renderPersonNames()}
                           </select>
                           <div className={styles.activOrNot}>   
                                <input id={styles.radio} type="radio" name="treatments" value="active" checked={this.state.active} onChange={(event) => this.activeChange('active', event)}/> Just active treatments
                                <input id={styles.radio} type="radio" name="treatments" value="all"    checked={!this.state.active} onChange={(event) => this.activeChange('all', event)}/> All treatments 
                            </div>
                         </div>
                         <div style={{minWidth: "1225px", minHeight: "40px", backgroundColor: "#245454", marginBottom: "50px"}}>
                            
                         </div>
                         {this.renderTable()}
                    </div>
                    <div className={styles.inonelineForm} id={styles.block2}>
                         <div className={styles.appointments}>
                            {this.renderAppointments()}
                         </div>
                    </div>
                </div>
          </div>
        );
    }
}   

CureSettings.propTypes = {
    auth: React.PropTypes.object.isRequired
}

function mapStateToProps(state){
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps) (CureSettings);
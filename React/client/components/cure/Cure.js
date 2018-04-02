import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import styles from '../../css/table-form-design.css';
import selectStyle from '../../css/select-design.css';
import imageStyle from '../../css/ImageCSS.css';
import textShadow from '../../css/TextShadow.css';
import MyModal from '../modal/MyModal';

class Cure  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newCure : {
                id: '',
                personName: '',
                description: '',
                firstdate: '',
                lastdate: ''
            },
            newCureDay:{
                id: '',
                cureId: '',
                time: [],
                medicinename: [],
                medicinetype: [],
                quantity: []
            },
            tempCurrentDay: {
                medicineName: '',
                medicineType: '',
                time: '',
                quantity: ''
            },
            forceUpdate: '',
            errorTime: '',
            errorDescription: '',
            errorTimeModal: '',
            errorQuantity: '',
            errorQuantityModal: '',
            isModalOpen: false,
            medicineNames: [],
            medicineTypes: [],
            personNames: [], 
        };
        this.cureFieldChanged = this.cureFieldChanged.bind(this);
        this.cureDayFieldChanged = this.cureDayFieldChanged.bind(this);
        this.renderAllResultRows = this.renderAllResultRows.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.dropCureDay = this.dropCureDay.bind(this);
        this.addCureDay = this.addCureDay.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.isNumber = this.isNumber.bind(this);
        this.onSubmitEvent = this.onSubmitEvent.bind(this);
        this.renderMedicineNames = this.renderMedicineNames.bind(this);
        this.renderMedicineTypes = this.renderMedicineTypes.bind(this);
        this.renderPersonNames = this.renderPersonNames.bind(this);
        this.getTypeByMedicineName = this.getTypeByMedicineName.bind(this);
        this.getMedicineNames = this.getMedicineNames.bind(this);
        this.getPersonNames = this.getPersonNames.bind(this);
    }
    componentDidMount() {
        this.getMedicineNames();
        this.getPersonNames();
    }
    openModal() {
      this.setState({ isModalOpen: true, errorQuantity: '', errorTime: ''});
    }

    closeModal() {
      this.setState({ isModalOpen: false, errorQuantityModal: '', errorTimeModal: '' });
    }

    isNumber(n){
        return n != "" && Number(n) == n;
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
                            var  temp = {
                                    medicineName: this.state.tempCurrentDay.medicineName,
                                    medicineType: json[0],
                                    time: this.state.tempCurrentDay.time,
                                    quantity: this.state.tempCurrentDay.quantity
                            }
                            this.setState({tempCurrentDay: temp});
        });
    }
    getMedicineNames(){
        fetch("http://localhost:8080/exam/storage/medicine/names")
            .then( (response) => {
                return response.json() })   
                    .then( (json) => {
                        this.setState({medicineNames: json});
                            this.getTypeByMedicineName(json[0]);
                            var  temp = {
                                    medicineName: this.state.medicineNames[0],
                                    medicineType: json[0],
                                    time: this.state.tempCurrentDay.time,
                                    quantity: this.state.tempCurrentDay.quantity
                            }
                            this.setState({tempCurrentDay: temp});
        });
    }
    getPersonNames(){
        fetch("http://localhost:8080/exam/person/getallname")
            .then( (response) => {
                return response.json() })   
                    .then( (json) => {
                        this.setState({personNames: json});
                        var  temp = {
                                    id: '',
                                    personName: json[0],
                                    firstdate: this.state.newCure.firstdate,
                                    lastdate: this.state.newCure.lastdate
                        }
                        this.setState({newCure: temp});

        });
    }
    cureFieldChanged(field, event) {
        const cur = Object.assign(this.state.newCure, {
            [field]: event.target.value
        });
        this.setState({newCure: cur});
    }
    cureDayFieldChanged(field, event) {
        const cur = Object.assign(this.state.tempCurrentDay, {
            [field]: event.target.value
        });
        this.setState({tempCurrentDay: cur});
        if (field == "medicineName"){
            this.getTypeByMedicineName(event.target.value);
        }
    }
    dropCureDay(index, event){
        delete this.state.newCureDay.quantity[index];
        delete this.state.newCureDay.medicinetype[index];
        delete this.state.newCureDay.medicinename[index];
        delete this.state.newCureDay.time[index];
        this.setState({forceUpdate: true});
    }
    addCureDay(event){
        var okey = true;
        if (this.state.tempCurrentDay.time == ""){
            okey = false;
            this.setState({errorTimeModal: "This field is required!"});
        }
        if (this.state.tempCurrentDay.quantity == ""){
            okey = false;
            this.setState({errorQuantityModal: "This field is required!"});
        } else if (!this.isNumber(this.state.tempCurrentDay.quantity)){
            okey = false;
            this.setState({errorQuantityModal: "The quantity must be a number!"});
        }
        if (okey){
            var temporal = this.state.newCureDay;
            temporal.quantity.push(this.state.tempCurrentDay.quantity);
            temporal.time.push(this.state.tempCurrentDay.time);
            temporal.medicinename.push(this.state.tempCurrentDay.medicineName);
            temporal.medicinetype.push(this.state.tempCurrentDay.medicineType);
            this.setState({newCureDay: temporal});
            this.closeModal();
        }
    }
    renderAllResultRows() {
        return this.state.newCureDay.time.map((time, index) => { 
            return (
                <tr key={index} data-item={time}>
                    <td > {time} </td>
                    <td > {this.state.newCureDay.medicinename[index]} </td>
                    <td > {this.state.newCureDay.medicinetype[index]} </td>
                    <td > {this.state.newCureDay.quantity[index]} </td>
                    <td style={{width: "70px"}}  onClick={(event) => this.dropCureDay(index, event)}>
                        <img  id={styles.block2} style={{float: "right"}} src="http://findicons.com/files/icons/2711/free_icons_for_windows8_metro/256/delete.png" alt="" style={{width:"30px", height:"30px"}}  className="circle"/>
                    </td>
                </tr>
            );
        });  
    }
    renderTable(){
            return (
                <table className={styles.mytableb}>
                    <thead className={styles.aboveTable}>
                         Daily doses
                    </thead>
                    <thead>
                            <tr >
                                <th>Time</th>
                                <th>Medicine</th>
                                <th>Type</th>
                                <th> Quantity </th>
                                <th style={{width: "70px"}} onClick={(event) => this.openModal()}> 
                                    <img  id={styles.block2} style={{float: "right", backgroundColor: "white"}} src="https://image.freepik.com/free-icon/add-document_318-8474.jpg" alt="" style={{width:"30px", height:"30px"}}  className="circle"/>
                                </th>
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
                                <th></th>
                                <th style={{width: "70px"}}></th>
                            </tr>
                    </thead>
                </table>
            );
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
    onSubmitEvent(){
        if (this.state.newCure.firstdate == ""){
            swal("Warning!", "Please set the first date of the cure!", "warning");
        } else if (this.state.newCure.lastdate == ""){
            swal("Warning!", "Please set the last date of the cure!", "warning");
        } else  if (this.state.newCure.firstdate > this.state.newCure.lastdate){
            swal("Warning!", "The last date is earlier than the first date!", "warning");
        } else  if (this.state.newCure.description == ""){
            swal("Warning!", "Please set a description for the treatment!", "warning");
        }else{
            if (this.state.newCureDay.time.length == 0){
                swal("Warning!", "Please set some daily doses!", "error");
            } else {
                fetch('http://localhost:8080/exam/cure', {
                method: 'POST',
                headers: { 
                        'Accept': 'application/json',
                        'Content-Type': 'application/json' 
                },
                body: JSON.stringify(this.state.newCure)
                }).then( (response) => {
                    return response.json() })   
                        .then( (json) => {
                            if (json != -1){
                                    var t = {
                                        id: '',
                                        cureId: json,
                                        time: this.state.newCureDay.time,
                                        medicinename: this.state.newCureDay.medicinename,
                                        medicinetype: this.state.newCureDay.medicinetype,
                                        quantity: this.state.newCureDay.quantity
                                    }
                                    this.setState({newCureDay: t});
                                    fetch('http://localhost:8080/exam/daily_cure', {
                                        method: 'POST',
                                        headers: { 
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json' 
                                        },
                                        body: JSON.stringify(t)
                                    }).then( (response) => {
                                        return response.json() })   
                                            .then( (json) => {
                                                t = {
                                                    id: '',
                                                    cureId: '',
                                                    time: [],
                                                    medicinename: [],
                                                    medicinetype: [],
                                                    quantity: []
                                                }   
                                                this.setState({newCureDay: t});   
                                                swal("Good job!", "The treatment has been created successfully!", "success")
                                            }
                                    );
                            }  else {

                            }               
                        }
                );
            }
        }
    }
    render() {
        const { isAuthenticated } = this.props.auth;
        if (!isAuthenticated) browserHistory.push('/signin');
        else if (this.props.auth.user.alvl == 'inhabitant') browserHistory.push('/404_not_found');
        return (
          <div>
              <MyModal isOpen={this.state.isModalOpen} onClose={() => this.closeModal()}>
                    <img id="close" src="http://icons.iconarchive.com/icons/custom-icon-design/office/256/close-icon.png" alt="" style={{position:"absolute" ,right: "-35px", top: "-35px"}} width="40px" height="40px" onClick={() => this.closeModal()}/>
                    <form id={styles.contact} action="" method="get" style={{paddingBottom:"5%", paddingTop:"3%", marginBottom:0, marginTop:0}}>
                                    <br/>
                                    <center> <label className={styles.myBigLabel}><strong> Set new appointment </strong></label> </center>
                                    <br/><br/>
                                    <label className={styles.myNormalLabels}>Appointment:</label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorTimeModal}</label>
                                    <fieldset>
                                        <input type="time" name="time"  tabIndex="7" value={this.state.tempCurrentDay.time}  onChange={(event) => this.cureDayFieldChanged('time', event)}/>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Name of the medicine:</label>
                                    <fieldset>
                                        <select className={selectStyle.myselect} defaultValue={this.state.medicineNames[0]} tabIndex="8" onChange={(event) => this.cureDayFieldChanged('medicineName', event)}>
                                            {this.renderMedicineNames()}
                                        </select>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Type of the medicine:</label>
                                    <fieldset>
                                        <select className={selectStyle.myselect} defaultValue={this.state.medicineTypes[0]} tabIndex="9" onChange={(event) => this.cureDayFieldChanged('medicineType', event)}>
                                            {this.renderMedicineTypes()}
                                        </select>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Quantity:</label>
                                        <label id={styles.myErrorLabelStyle}>{this.state.errorQuantityModal}</label>
                                        <fieldset>
                                            <input placeholder="Quantity" type="text" tabIndex="10" required value={this.state.tempCurrentDay.quantity}  onChange={(event) => this.cureDayFieldChanged('quantity', event)}/>
                                        </fieldset>
                                    <fieldset>
                                        <button name="update" type="button" style={{background: "green"}} id="contact-submit" data-submit="...Sending" onClick={(event) => this.addCureDay(event)}>Add</button>
                                    </fieldset>
                        </form>
              </MyModal>
               <div id={styles.block_container}>
                    <div className={styles.inonelineTable} id={styles.block1}>
                         {this.renderTable()}
                    </div>
                    <div className={styles.inonelineForm} id={styles.block2}>
                        <form id={styles.contact} action="" method="get" style={{marginTop:"5.3%"}}>
                                    <center> <label className={styles.myBigLabel}><strong> Create new treatment </strong></label> </center>
                                    <br/><br/>
                                    <label className={styles.myNormalLabels}>Name of the person:</label>
                                    <fieldset>
                                        <select className={selectStyle.myselect} defaultValue={this.state.personNames[0]} tabIndex="1" onChange={(event) => this.cureFieldChanged('personName', event)}>
                                            {this.renderPersonNames()}
                                        </select>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Treatment's description:</label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorDescription}</label>
                                    <fieldset>
                                        <input placeholder="Description" type="text" tabIndex="2" required value={this.state.tempCurrentDay.description}  onChange={(event) => this.cureFieldChanged('description', event)}/>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>The date of the begining threatment:</label>
                                    <fieldset>
                                        <input type="date" name="firstdate"  tabIndex="3" value={this.state.newCure.firstdate}  onChange={(event) => this.cureFieldChanged('firstdate', event)}/>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>The date of the ending threatment:</label>
                                    <fieldset>
                                        <input type="date" name="lastdate"  tabIndex="4" value={this.state.newCure.lastdate}  onChange={(event) => this.cureFieldChanged('lastdate', event)}/>
                                    </fieldset>
                                    <fieldset>
                                        <button name="submit" type="button" id="contact-submit" data-submit="...Sending" onClick={this.onSubmitEvent} style={{background: "green"}}>Create</button>
                                    </fieldset>
                                </form>
                    </div>
                </div>
          </div>
        );
    }
}   

Cure.propTypes = {
    auth: React.PropTypes.object.isRequired
}

function mapStateToProps(state){
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps) (Cure);
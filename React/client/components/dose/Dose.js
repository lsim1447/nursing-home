import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import styles from '../../css/table-form-design.css';
import selectStyle from '../../css/select-design.css';
import MyModal from '../modal/MyModal';

class Dose  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            savedid: '',
            limitations: {
                selectedname: 'All',
                firstDate: '',
                lastDate: ''
            },
            newDose: {
                persname: '',
                medname: '',
                type: '',
                partoftheday: '',
                date: '',
                quantity: ''
            },
            choosedRow: {
                id: '',
                persname: '',
                medname: '',
                type: '',
                partoftheday: '',
                date: '',
                quantity: ''
            },
            restoreStorage: {
                medname: '',
                type: '',
                quantity: '',
                stoordate: '',
                price: ''
            },
            errorMessage: '',
            errorQuantity: '',
            errorDate: '',
            errorQuantityModal: '',
            errorTime: '',
            errorTimeModal: '',
            totalPrice: '',
            errorMessageModal: '',
            isModalOpen: false,
            medicineNames: [],
            medicineTypes: [],
            personNames: [], 
            doseAllList: []
        };
        this.fieldChanged = this.fieldChanged.bind(this);
        this.renderMedicineNames = this.renderMedicineNames.bind(this);
        this.renderPersonNames = this.renderPersonNames.bind(this);
        this.onSubmitEvent = this.onSubmitEvent.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.renderAllResultRows = this.renderAllResultRows.bind(this);
        this.getAllByName = this.getAllByName.bind(this);
        this.getAllMedNameFromStorage = this.getAllMedNameFromStorage.bind(this);
        this.getAllPersonName = this.getAllPersonName.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.fetchDoseDetails = this.fetchDoseDetails.bind(this);
        this.choosedFieldChanged = this.choosedFieldChanged.bind(this);
        this.updateDoseRow = this.updateDoseRow.bind(this);
        this.saveDose = this.saveDose.bind(this);
        this.restoreStorage = this.restoreStorage.bind(this);
        this.renderTotalPrice = this.renderTotalPrice.bind(this);
        this.isNumber = this.isNumber.bind(this);
        this.deleteDose = this.deleteDose.bind(this);
        this.limitationsChanged = this.limitationsChanged.bind(this);
        this.renderMedicineTypeNames = this.renderMedicineTypeNames.bind(this);
        this.getTypesByName = this.getTypesByName.bind(this);
    }
    openModal() {
      this.setState({ isModalOpen: true });
    }

    closeModal() {
      this.setState({ isModalOpen: false, medicineNames: [], errorQuantityModal: '', errorTimeModal: ''});
      this.getAllMedNameFromStorage(false);
    }
    isNumber(n){
        return n != "" && Number(n) == n;
    }
    fetchDoseDetails(dose, event){
        this.setState({errorDate: '', errorQuantity: '', savedid: dose.id});
            var  temp = {
                 id: dose.id,
                 persname: dose.pers.name,
                 medname: dose.med.medicinetype.name,
                 type: dose.med.name,
                 partoftheday: dose.partoftheday,
                 date: dose.date,
                 quantity: dose.quantity
            }
            var t = {
                medname: dose.med.medicinetype.name,
                type: dose.med.name,
                quantity: dose.quantity,
                stoordate: dose.stoordate,
                price: dose.price
            }
            var ok = false;
            var names = this.state.medicineNames;
            this.state.medicineNames.map((name, index) => { 
                if (name == dose.med.medicinetype.name){
                    ok = true;
                }
            });
            if (ok == false) {
                names.push(dose.med.medicinetype.name);
                this.setState({medicineNames: names});
            }
            ok = false;
            names = this.state.medicineTypes;
            this.state.medicineTypes.map((name, index) => { 
                if (name == dose.med.name){
                    ok = true;
                }
            });
            if (ok == false) {
                names.push(dose.med.name);
                this.setState({medicineTypes: names});
            }
            this.setState({choosedRow: temp, restoreStorage:t});
            this.openModal();
    }
    
    fieldChanged(field, event) {
        const newdose = Object.assign(this.state.newDose, {
            [field]: event.target.value
        });
        this.setState({newDose: newdose, errorMessage:'', errorDate: '', errorQuantity: '', errorTime: ''});
        if (field == "medname") this.getTypesByName(event.target.value);
    }
    limitationsChanged(field, event) {
        const lim = Object.assign(this.state.limitations, {
            [field]: event.target.value
        });
        this.setState({limitations: lim});
        this.getAllByName();
        this.renderTotalPrice();
    }
    choosedFieldChanged(field, event) {
        const updatedose = Object.assign(this.state.choosedRow, {
            [field]: event.target.value
        });
        this.setState({choosedRow: updatedose, errorMessageModal:'', errorQuantityModal: '', errorTimeModal: ''});
        if (field == "medname") this.getTypesByName(event.target.value);
    }
    getTypesByName(medname){
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
                            var temp = {
                                persname: this.state.newDose.persname,
                                medname: this.state.newDose.medname,
                                type: json[0],
                                partoftheday: this.state.newDose.partoftheday,
                                date: this.state.newDose.date,
                                quantity: this.state.newDose.quantity
                            }
                            this.setState({newDose: temp});
                    });
    }
    getAllByName(){
            var formData = new FormData();
            for (var k in this.state.limitations) {
                    formData.append(k, this.state.limitations[k]);
            }
            fetch('http://localhost:8080/exam/doses/all', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; '
                },
                body: formData
                }).then( (response) => {
                    return response.json() })   
                        .then( (json) => {
                            this.setState({doseAllList:json});
                });
    }
    getAllMedNameFromStorage(serial){
        fetch("http://localhost:8080/exam/storage/medicine/names")
            .then( (response) => {
                return response.json() })   
                    .then( (json) => {
                        this.setState({medicineNames: json});
                        if (serial == false){
                            this.getTypesByName(json[0]);
                            var temp = {
                                persname: this.state.newDose.persname,
                                medname: this.state.medicineNames[0],
                                type: this.state.newDose.type,
                                partoftheday: this.state.newDose.partoftheday,
                                date: this.state.newDose.date,
                                quantity: this.state.newDose.quantity
                            }
                            this.setState({newDose: temp});
                        } else {
                            var ok = false;
                            this.state.medicineNames.map((name, index) => { 
                                if (name == this.state.newDose.medname){
                                    ok = true;
                                }
                             });
                            var m_name = this.state.newDose.medname;
                            if (ok == false){
                                m_name = this.state.medicineNames[0];
                            }
                            var temp = {
                                persname: this.state.newDose.persname,
                                medname: m_name,
                                type: this.state.newDose.type,
                                partoftheday: this.state.newDose.partoftheday,
                                date: this.state.newDose.date,
                                quantity: this.state.newDose.quantity
                            }
                            this.setState({newDose: temp});
                        }
        });
    }
    getAllPersonName(status){
        fetch("http://localhost:8080/exam/person/getallname")
            .then( (response) => {
                return response.json() })   
                    .then( (json) => {
                        this.setState({personNames: json});
                        if (status == false){
                            var temp = {
                                persname: this.state.personNames[0],
                                medname: this.state.newDose.medname,
                                type: this.state.newDose.type,
                                partoftheday: this.state.newDose.partoftheday,
                                date: this.state.newDose.date,
                                quantity: this.state.newDose.quantity
                            }
                            this.setState({newDose: temp});
                        } else {
                            var temp = {
                                persname: this.state.newDose.persname,
                                medname: this.state.newDose.medname,
                                type: this.state.newDose.type,
                                partoftheday: this.state.newDose.partoftheday,
                                date: this.state.newDose.date,
                                quantity: this.state.newDose.quantity
                            }
                            this.setState({newDose: temp});
                        }
            });
    }
    componentDidMount(){
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 2);
        var secondDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        document.getElementById("datum1").valueAsDate = firstDay;
        document.getElementById("datum2").valueAsDate = secondDate;
        const temp =  {
            selectedname: 'All',
            firstDate: document.getElementById("datum1").value,
            lastDate:  document.getElementById("datum2").value,
        }
        this.getAllMedNameFromStorage(false);
        this.getAllPersonName(false);
        const lim = Object.assign(this.state, {
            limitations: temp
        });
        this.getAllByName();
        this.renderTotalPrice();
    }

    saveDose(formData, update){
        fetch('http://localhost:8080/exam/doses', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; '
            },
            body: formData
			}).then( (response) => {
                return response.json() })   
                    .then( (json) => {
                        this.getAllMedNameFromStorage(true);
                        this.getAllByName();
                        this.renderTotalPrice();
                        if (json == "success") {
                            if (update == true) {
                                this.closeModal();
                            } else {
                                var temp = {
                                    persname: this.state.newDose.persname,
                                    medname: this.state.newDose.medname,
                                    type: this.state.newDose.type,
                                    partoftheday: this.state.newDose.partoftheday,
                                    date: '',
                                    quantity: ''
                                }
                                this.setState({newDose: temp});
                            }
                        } else {
                            if (update == false) this.setState({errorMessage: json});
                            else this.setState({errorMessageModal: json});
                        }
            });
    }
    restoreStorage(formData, save){
        fetch('http://localhost:8080/exam/storage/medicine/restore', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; '
            },
            body: formData
			}).then( (response) => {
                return response.json() })   
                    .then( (json) => {
                        if (json[0] == "success"){
                            if (save == true) {
                                var formData = new FormData();
                                for (var k in this.state.choosedRow) {
                                    formData.append(k, this.state.choosedRow[k]);
                                } 
                                this.saveDose(formData, true);
                            } else {
                                fetch('http://localhost:8080/exam/doses/delete/' + this.state.savedid, {
                                    method: 'DELETE',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; '
                                    },
                                }).then(() => {
                                    this.getAllMedNameFromStorage(true);
                                    this.getAllByName();
                                    this.renderTotalPrice();
                                    this.closeModal();
                                });
                            }
                        } else {
                            if (json[0] == "notenough"){
                                this.setState({errorMessageModal: "Not enough medicine!"});
                            }
                        }
                        
            });
    }
    onSubmitEvent(event){
        event.preventDefault();
        var okey = 0;
        if (this.state.newDose.quantity == ""){
            this.setState({errorQuantity: "This field is required!"});
        } else if (this.isNumber(this.state.newDose.quantity) == false){
            this.setState({errorQuantity: "The quantity must be a number!"});
        } else okey = okey + 1;
        if (this.state.newDose.date == ""){
            this.setState({errorDate: "This field is required!"});
        } else okey = okey + 1;

        if (this.state.newDose.partoftheday == ""){
            this.setState({errorTime: "This field is required!"});
        } else okey = okey + 1;

        if (okey == 3){
            var formData = new FormData();
            for (var k in this.state.newDose) {
                    formData.append(k, this.state.newDose[k]);
            }
            this.saveDose(formData, false);
        }
    }
    deleteDose(){
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover!",
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
                const xzy = {
                        medname: this.state.restoreStorage.medname,
                        type: this.state.restoreStorage.type,
                        quantity: this.state.restoreStorage.quantity,
                        stoordate: this.state.restoreStorage.stoordate,
                        price: this.state.restoreStorage.price,
                        newmed: this.state.choosedRow.medname,
                        newquant: this.state.choosedRow.quantity,
                        newtype: this.state.choosedRow.type
                    }
                var restore = new FormData();
                for (var k in xzy) {
                    restore.append(k, xzy[k]);
                }
                this.restoreStorage(restore, false);
                swal("Deleted!", "The dose has been deleted.", "success");
            } else {
                swal("Cancelled", "Your dose is safe :)", "error");
            }
        }.bind(this));
    }
    updateDoseRow(){
        var ok = false;
        if (this.state.choosedRow.quantity == ""){
            this.setState({errorQuantityModal: "This field is required!"});
        } else if (this.isNumber(this.state.choosedRow.quantity) == false){
            this.setState({errorQuantityModal: "The quantity must be a number!"});
        } else if (this.state.choosedRow.partoftheday == ""){
            this.setState({errorTimeModal: "This field is required!"});
        } else ok = true;
        if (ok == true){
            const xzy = {
                medname: this.state.restoreStorage.medname,
                type: this.state.restoreStorage.type,
                quantity: this.state.restoreStorage.quantity,
                stoordate: this.state.restoreStorage.stoordate,
                price: this.state.restoreStorage.price,
                newmed: this.state.choosedRow.medname,
                newquant: this.state.choosedRow.quantity, 
                newtype: this.state.choosedRow.type
            }
            var restore = new FormData();
            for (var k in xzy) {
                    restore.append(k, xzy[k]);
            }
            this.restoreStorage(restore, true);
        }
    }
     renderAllResultRows() {
        return this.state.doseAllList.map((dose, index) => { 
            return (
                <tr key={index} data-item={dose} onClick={(event) => this.fetchDoseDetails(dose, event)}>
                    <td > {dose.pers.name} </td>
                    <td > {dose.med.medicinetype.name} </td>
                    <td>  {dose.med.name} </td>
                    <td > {dose.partoftheday} </td>
                    <td > {dose.quantity} </td>
                    <td > {dose.date} </td>
                </tr>
            );
        });  
    }
    renderTable(){
            return (
                <table className={styles.mytablebl}>
                    <thead>
                            <tr >
                                <th>Person</th>
                                <th>Medicine</th>
                                <th>Type</th>
                                <th>Time</th>
                                <th>Quantity</th>
                                <th>Date</th>
                            </tr>
                    </thead>
                    <tbody className={styles.myTbody} id={styles.doseTbody}> 
                            {this.renderAllResultRows()}
                    </tbody>
                    <thead>
                            <tr> 
                                <th className={styles.totalPrice}>Total price: {this.state.totalPrice} LEI</th>
                            </tr>
                            <tr >
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                    </thead>
                </table>
            );
    }
    renderTotalPrice(){
            var formData = new FormData();
            for (var k in this.state.limitations) {
                    formData.append(k, this.state.limitations[k]);
            }
            fetch('http://localhost:8080/exam/doses/total_price/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; '
                },
                body: formData
                }).then( (response) => {
                    return response.json() })   
                        .then( (json) => {
                            this.setState({totalPrice: json})
                });
    }
    renderPersonNames(){
        return this.state.personNames.map((persname, index) => {
            return (
                   <option className={selectStyle.myoption} key={index}>{persname}</option>
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
    renderMedicineTypeNames(){
        return this.state.medicineTypes.map((type, index) => {
            return (
                   <option key={index}>{type}</option>
                );
            });  
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
                                    <center> <label className={styles.myBigLabel}><strong>  Update dose  </strong></label> </center>
                                    <br/><br/>
                                    <label className={styles.myNormalLabels}>Person name:</label>
                                    <fieldset>
                                        <select className={selectStyle.myselect} defaultValue={this.state.choosedRow.persname}tabIndex="6" onChange={(event) => this.choosedFieldChanged('persname', event)}>
                                            {this.renderPersonNames()}
                                        </select>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Medicine name:</label>
                                    <fieldset>
                                        <select className={selectStyle.myselect} defaultValue={this.state.choosedRow.medname} tabIndex="7" onChange={(event) => this.choosedFieldChanged('medname', event)}>
                                            {this.renderMedicineNames()}
                                        </select>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Type:</label>
                                    <fieldset>
                                        <select className={selectStyle.myselect} defaultValue={this.state.choosedRow.type} tabIndex="8" onChange={(event) => this.choosedFieldChanged('type', event)}>
                                            {this.renderMedicineTypeNames()}
                                        </select>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Appointment:</label>
                                     <label id={styles.myErrorLabelStyle}>{this.state.errorTimeModal}</label>
                                    <fieldset>
                                        <input type="time" name="partoftheday"  tabIndex="9" value={this.state.choosedRow.partoftheday}  onChange={(event) => this.choosedFieldChanged('partoftheday', event)}/>
                                    </fieldset>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorMessageModal}</label>
                                     <label className={styles.myNormalLabels}>Quantity:</label>
                                     <label id={styles.myErrorLabelStyle}>{this.state.errorQuantityModal}</label>
                                    <fieldset>
                                        <input placeholder="Quantity" type="text" tabIndex="10" required value={this.state.choosedRow.quantity}  onChange={(event) => this.choosedFieldChanged('quantity', event)}/>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Date:</label>
                                    <fieldset>
                                        <input type="date" tabIndex="11" required value={this.state.choosedRow.date}  onChange={(event) => this.choosedFieldChanged('date', event)}/>
                                    </fieldset>
                                    <fieldset>
                                        <button name="update" type="button" style={{background: "green"}} id="contact-submit" data-submit="...Sending" onClick={this.updateDoseRow}>Update</button>
                                    </fieldset>
                                    <div> <button name="delete" type="button" id="contact-submit" onClick={() => this.deleteDose()}>Delete</button> </div>
                        </form>
            </MyModal>
            
            <div id={styles.block_container}>
                    <div className={styles.inonelineTable} id={styles.block1}>
                        <select id="selectedname" style={{marginTop: "9%", color: "white", backgroundColor: "#545454"}} className={selectStyle.myselect} defaultValue={this.state.personNames[0]}tabIndex="2" onChange={(event) => this.limitationsChanged('selectedname', event)}>
                            <option className={selectStyle.myoption} >All</option>
                            {this.renderPersonNames()}
                        </select>
                        <div id={styles.block_container}>
                            <div  id={styles.block1}  style={{float: "left"}}>   
                                <label className={styles.FromToDateLabel}>Show <strong>FROM</strong> this date</label> 
                                <input  type="date" id = "datum1" name = "datum1" style={{ borderBottomLeftRadius: "1em", borderBottomRightRadius: "1em", textAlign:"center", background:"#F0FFF0"}}  onChange={(event) => this.limitationsChanged('firstDate', event)}/> 
                            </div>
                            <div  id={styles.block2}  style={{float: "right"}}> 
                                <label className={styles.FromToDateLabel}><strong>TO</strong> this date</label> 
                                <input  type="date" id = "datum2" name = "datum2" style={{ borderBottomLeftRadius: "1em", borderBottomRightRadius: "1em", textAlign:"center", background:"#F0FFF0"}}  onChange={(event) => this.limitationsChanged('lastDate', event)}/>
                            </div>
                         </div>
                       {this.renderTable()}
                    </div>
                    <div className={styles.inonelineForm} id={styles.block2}>
                        <br/>                    
                        <div  className={styles.container}>  
                                <form id={styles.contact} action="" method="get" >
                                    <center> <label className={styles.myBigLabel}><strong> New dose </strong></label> </center>
                                    <br/><br/>
                                    <label className={styles.myNormalLabels}>Person name:</label>
                                    <fieldset>
                                        <select className={selectStyle.myselect} defaultValue={this.state.personNames[0]} tabIndex="1" onChange={(event) => this.fieldChanged('persname', event)}>
                                            {this.renderPersonNames()}
                                        </select>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Medicine name:</label>
                                    <fieldset>
                                        <select className={selectStyle.myselect} defaultValue={this.state.medicineNames[0]} tabIndex="2" onChange={(event) => this.fieldChanged('medname', event)}>
                                            {this.renderMedicineNames()}
                                        </select>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Type:</label>
                                    <fieldset>
                                        <select className={selectStyle.myselect} defaultValue={this.state.medicineTypes[0]} tabIndex="3" onChange={(event) => this.fieldChanged('type', event)}>
                                            {this.renderMedicineTypeNames()}
                                        </select>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Appointment:</label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorTime}</label>
                                    <fieldset>
                                        <input type="time" name="partoftheday"  tabIndex="4" value={this.state.newDose.partoftheday}  onChange={(event) => this.fieldChanged('partoftheday', event)}/>
                                    </fieldset>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorMessage}</label>
                                     <label className={styles.myNormalLabels}>Quantity:</label>
                                     <label id={styles.myErrorLabelStyle}>{this.state.errorQuantity}</label>
                                    <fieldset>
                                        <input placeholder="Quantity" type="text" tabIndex="5" required value={this.state.newDose.quantity}  onChange={(event) => this.fieldChanged('quantity', event)}/>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Date:</label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorDate}</label>
                                    <fieldset>
                                        <input type="date" tabIndex="5" required value={this.state.newDose.date}  onChange={(event) => this.fieldChanged('date', event)}/>
                                    </fieldset>
                                    <fieldset>
                                        <button name="submit" type="submit" id="contact-submit" data-submit="...Sending" onClick={this.onSubmitEvent}>Upload</button>
                                    </fieldset>
                                </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}   

Dose.propTypes = {
    auth: React.PropTypes.object.isRequired
}

function mapStateToProps(state){
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps) (Dose);
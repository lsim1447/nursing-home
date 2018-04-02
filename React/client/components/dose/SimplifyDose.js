import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import styles from '../../css/table-form-design.css';
import selectStyle from '../../css/select-design.css';
import MyModal from '../modal/MyModal';
import sweetAlert from 'sweetalert'
class SimplifyDose  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            savedid: '',
            limitations: {
                selectedname: '',
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
                persname: '',
                medname: '',
                type: '',
                partoftheday: '',
                date: '',
                quantity: ''
            },
            oldDoses: {
                persname: '',
                medname: '',
                type: '',
                partoftheday: '',
                date: '',
                quantity: ''
            },
            errorMessage: '',
            errorQuantity: '',
            errorQuantityModal: '',
            errorTime: '',
            errorTimeModal: '',
            isModalOpen: false,
            medicineNames: [],
            medicineTypes: [],
            personNames: [], 
            doseAllList: []
        };
        this.fieldChanged = this.fieldChanged.bind(this);
        this.choosedFieldChanged = this.choosedFieldChanged.bind(this);
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
        this.isNumber = this.isNumber.bind(this);
        this.limitationsChanged = this.limitationsChanged.bind(this);
        this.saveDoses = this.saveDoses.bind(this);
        this.deleteDose = this.deleteDose.bind(this);
        this.updateDoseRow = this.updateDoseRow.bind(this);
        this.renderMedicineTypes = this.renderMedicineTypes.bind(this);
        this.getTypesByName = this.getTypesByName.bind(this);
    }
    choosedFieldChanged(field, event) {
        const updatedose = Object.assign(this.state.choosedRow, {
            [field]: event.target.value
        });
        this.setState({choosedRow: updatedose, errorQuantityModal: '', errorTimeModal: ''});
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
            const  temp1 = {
                 persname: dose.pers.name,
                 medname: dose.med.medicinetype.name,
                 type: dose.med.name,
                 partoftheday: dose.partoftheday,
                 date: dose.date,
                 quantity: dose.quantity
            }
            const  temp2 = {
                 persname: dose.pers.name,
                 medname: dose.med.medicinetype.name,
                 type: dose.med.name,
                 partoftheday: dose.partoftheday,
                 date: dose.date,
                 quantity: dose.quantity
            }
            var ok = false;
            var names = this.state.medicineNames;
            this.state.medicineNames.map((name, index) => { 
                if (name == dose.med.medicinetype.name){
                    ok = true;
                }
            });
            if (ok == false) names.push(dose.med.medicinetype.name);

            ok = false;
            var types = this.state.medicineTypes;
            this.state.medicineTypes.map((type, index) => { 
                if (type == dose.med.name){
                    ok = true;
                }
            });
            if (ok == false) types.push(dose.med.name);
            this.setState({choosedRow: temp1, medicineNames: names, oldDoses:temp2, medicineTypes: types});
            this.openModal();
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
    fieldChanged(field, event) {
        const newdose = Object.assign(this.state.newDose, {
            [field]: event.target.value
        });
        this.setState({newDose: newdose, errorMessage:'', errorQuantity: '', errorTime: ''});
        if (field == "medname") this.getTypesByName(event.target.value);
    }
    limitationsChanged(field, event) {
        if (field == "firstDate"){
            const lim = Object.assign(this.state.limitations, {
                [field]: event.target.value,
                ['lastDate']: event.target.value
            });
            this.setState({limitations: lim, errorMessage: ''});
        } else {
            const lim = Object.assign(this.state.limitations, {
                [field]: event.target.value,
            });
            const newdosen = Object.assign(this.state.newDose, {
                ['persname']: event.target.value
            });
            this.setState({limitations: lim, newDose:newdosen, errorMessage: ''});
        }
        this.getAllByName();
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
            });
    }
    componentWillMount(){
        this.getAllPersonName(false);
        this.getAllByName();
    }
    componentDidMount(){
        var date = new Date();
        var firstDay = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
        document.getElementById("datum1").valueAsDate = firstDay;
        document.getElementById("selectedDate").valueAsDate = date;
        this.getAllMedNameFromStorage(false);
        const temp =  {
            selectedname: "",
            firstDate: document.getElementById("datum1").value,
            lastDate:  document.getElementById("datum1").value,
        }
        const lim = Object.assign(this.state, {
            limitations: temp
        });
        var newD = {
            persname: '',
            medname: '',
            type: '',
            partoftheday: '',
            date: document.getElementById("selectedDate").value,
            quantity: ''
        }
        this.setState({newDose: newD});
    }
    onSubmitEvent(event){
        var oke = false;
        if (this.state.newDose.quantity.replace(/ /g, "") == ""){
            this.setState({errorQuantity: 'This field is required!'});
        } else if (this.isNumber(this.state.newDose.quantity) == false){
            this.setState({errorQuantity: 'The quantity must be a number!'});
        } else oke = true;
        if (this.state.newDose.persname == ""){
            oke = false;
            swal("Warning!", "Please choose a person from the list!")
        } 
        if (this.state.newDose.partoftheday == ""){
            this.setState({errorTime: "This field is required!"});
            oke = false;
        }
        if (oke == true){
           var ty = {
               name: this.state.newDose.medname
           }
           var x = {
                date: this.state.newDose.date,
                med: {
                    name: this.state.newDose.type,
                    medicinetype: ty
                },
                partoftheday: this.state.newDose.partoftheday,
                pers: {
                    name: this.state.newDose.persname
                },
                quantity: this.state.newDose.quantity
            }
            var temp = this.state.doseAllList;
            temp.push(x);
            this.setState({doseAllList: temp});
        }
    }

    saveDoses(){
        if (document.getElementById("selectedDate").value.replace(/ /g, "") == ""){
            this.setState({errorMessage: 'Please choose a date!'});
        } else {
            this.setState({errorMessage: ''});
            var test = [];
            this.state.doseAllList.map((dose, index) => {
                const t = {
                    persname: dose.pers.name,
                    medname: dose.med.medicinetype.name,
                    type: dose.med.name,
                    partoftheday: dose.partoftheday,
                    quantity: dose.quantity,
                    date: this.state.newDose.date
                }
                test.push(t);
            });
            fetch('http://localhost:8080/exam/doses/saveall', {
                method: 'POST',
                body: JSON.stringify(test),
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                }
            }).then( (response) => {
                    return response.json() })   
                        .then( (json) => {
                            if (json[0] != "success"){
                                 //this.setState({errorMessage: json[0]});
                                 swal("Warning!", json[0], "error");
                            } else {
                                this.getAllByName();                            
                            }
            });
        }
        
    }
    updateDoseRow(){
        var oke = false;
        if (this.state.choosedRow.quantity.replace(/ /g, "") == ""){
            this.setState({errorQuantityModal: 'This field is required!'});
        } else if (this.isNumber(this.state.choosedRow.quantity) == false){
            this.setState({errorQuantityModal: 'The quantity must be a number!'});
        } else oke = true;
        if (this.state.choosedRow.partoftheday == ""){
            this.setState({errorTimeModal: "This field is required!"});
            oke = false;
        }
        if (oke == true){
                var dlist = this.state.doseAllList;
                var i = 0;
                dlist.map((dose, index) => { 
                    if (dose.pers.name == this.state.oldDoses.persname){
                        if (dose.med.name == this.state.oldDoses.type){
                            if (dose.partoftheday == this.state.oldDoses.partoftheday){
                                if (dose.quantity == this.state.oldDoses.quantity){
                                    if (dose.date == this.state.oldDoses.date){
                                        if (dose.med.medicinetype.name  == this.state.newDose.medname){
                                            dose.partoftheday = this.state.choosedRow.partoftheday;
                                            dose.med.name = this.state.choosedRow.type;
                                            dose.med.medicinetype.name = this.state.choosedRow.medname;
                                            dose.quantity = this.state.choosedRow.quantity;
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                this.setState({doseAllList: dlist});
                this.closeModal(); 
        }    
    }
    deleteDose(){
        var dlist = this.state.doseAllList;
        var i = 0;
        dlist.map((dose, index) => { 
            if (dose.pers.name == this.state.oldDoses.persname){
                if (dose.med.name == this.state.oldDoses.type){
                    if (dose.partoftheday == this.state.oldDoses.partoftheday){
                        if (dose.quantity == this.state.oldDoses.quantity){
                            if (dose.date == this.state.oldDoses.date){
                                if (dose.med.medicinetype.name == this.state.oldDoses.medname){
                                     i = index;
                                }
                            }
                        }
                    }
                }
            }
        });
        delete dlist[i];
        this.setState({doseAllList: dlist});
        this.closeModal();     
    }
    renderAllResultRows() {
        return this.state.doseAllList.map((dose, index) => { 
            return (
                <tr key={index} data-item={dose} onClick={(event) => this.fetchDoseDetails(dose, event)}>
                    <td > {dose.med.medicinetype.name} </td>
                    <td > {dose.med.name} </td>
                    <td > {dose.partoftheday} </td>
                    <td > {dose.quantity} </td>
                </tr>
            );
        });  
    }
    renderTable(){
            return (
                <table className={styles.mytablebl}>
                    <thead>
                            <tr >
                                <th>Medicine</th>
                                <th> Type </th>
                                <th>Appointment</th>
                                <th>Quantity</th>
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
                            </tr>
                    </thead>
                </table>
            );
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
    renderMedicineTypes(){
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
                                    <center> <label className={styles.myBigLabel}><strong> Update dose </strong></label> </center>
                                    <br/><br/>
                                    <label className={styles.myNormalLabels}>Medicine name:</label>
                                    <fieldset>
                                        <select className={selectStyle.myselect} defaultValue={this.state.choosedRow.medname} tabIndex="7" onChange={(event) => this.choosedFieldChanged('medname', event)}>
                                            {this.renderMedicineNames()}
                                        </select>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Appointment:</label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorTimeModal}</label>
                                    <fieldset>
                                        <input type="time" name="partoftheday"  tabIndex="8" value={this.state.choosedRow.partoftheday}  onChange={(event) => this.choosedFieldChanged('partoftheday', event)}/>
                                    </fieldset>
                                     <label className={styles.myNormalLabels}>Quantity:</label>
                                     <label id={styles.myErrorLabelStyle}>{this.state.errorQuantityModal}</label>
                                    <fieldset>
                                        <input placeholder="Quantity" type="text" tabIndex="9" required value={this.state.choosedRow.quantity}  onChange={(event) => this.choosedFieldChanged('quantity', event)}/>
                                    </fieldset>
                                    <fieldset>
                                        <button name="update" type="button" style={{background: "green"}} id="contact-submit" data-submit="...Sending" onClick={this.updateDoseRow}>Update</button>
                                    </fieldset>
                                    <div> <button name="delete" type="button" id="contact-submit" onClick={() => this.deleteDose()}>Drop row</button> </div>
                        </form>
            </MyModal>
            <div id={styles.block_container}>
                    <div className={styles.inonelineTable} id={styles.block1}>
                        <select id="selectedname" style={{marginTop: "9%", color: "white", backgroundColor: "#545454"}} className={selectStyle.myselect}  tabIndex="2" onChange={(event) => this.limitationsChanged('selectedname', event)}>
                            <option className={selectStyle.myoption} disabled selected>-- Choose a name --</option>
                            {this.renderPersonNames()}
                        </select>
                        <div id={styles.block_container}>
                            <div  id={styles.block1}  style={{float: "left"}}>  
                                <label className={styles.FromToDateLabel}>Copy <strong>FROM</strong></label> 
                                <input type="date" id = "datum1" name = "datum1" style={{ borderBottomLeftRadius: "1em", borderBottomRightRadius: "1em", textAlign:"center", background:"#F0FFF0"}} onChange={(event) => this.limitationsChanged('firstDate', event)}/>                         
                            </div>
                            <div  id={styles.block2}  style={{float: "right"}}> 
                                <label className={styles.FromToDateLabel}>Copy <strong>TO</strong></label>
                                <input type="date" id = "selectedDate" name = "selectedDate" style={{ borderBottomLeftRadius: "1em", borderBottomRightRadius: "1em", textAlign:"center", background:"#F0FFF0"}} onChange={(event) => this.fieldChanged('date', event)}/>
                            </div>
                         </div>
                         <label id={styles.myErrorLabelStyle}> {this.state.errorMessage} </label>  
                       {this.renderTable()}
 
                       <div className={selectStyle.container}> 
                            <div className={selectStyle.btn} onClick={this.saveDoses}>
                                <span>Save</span>
                                <div className={selectStyle.dot}></div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.inonelineForm} id={styles.block2}>
                        <br/>                    
                        <div  className={styles.container}>  
                                <form id={styles.contact} action="" method="get">
                                    <center> <label className={styles.myBigLabel}><strong> New dose </strong></label> </center>
                                    <br/><br/>
                                    <label className={styles.myNormalLabels}>Medicine name:</label>
                                    <fieldset>
                                        <select className={selectStyle.myselect} defaultValue={this.state.medicineNames[0]} tabIndex="1" onChange={(event) => this.fieldChanged('medname', event)}>
                                            {this.renderMedicineNames()}
                                        </select>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Type:</label>
                                    <fieldset>
                                        <select className={selectStyle.myselect} defaultValue={this.state.medicineTypes[0]} tabIndex="2" onChange={(event) => this.fieldChanged('type', event)}>
                                            {this.renderMedicineTypes()}
                                        </select>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Appointment:</label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorTime}</label>
                                    <fieldset>
                                        <input type="time" name="partoftheday"  tabIndex="3" value={this.state.newDose.partoftheday}  onChange={(event) => this.fieldChanged('partoftheday', event)}/>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Quantity:</label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorQuantity}</label>
                                    <fieldset>
                                        <input placeholder="Quantity" type="text" tabIndex="4" required value={this.state.newDose.quantity}  onChange={(event) => this.fieldChanged('quantity', event)}/>
                                    </fieldset>
                                    <fieldset>
                                        <button name="submit" type="button" id="contact-submit" data-submit="...Sending" onClick={this.onSubmitEvent} style={{background: "green"}}>Add</button>
                                    </fieldset>
                                </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}   

SimplifyDose.propTypes = {
    auth: React.PropTypes.object.isRequired
}

function mapStateToProps(state){
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps) (SimplifyDose);
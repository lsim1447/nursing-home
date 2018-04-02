import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import styles from '../../css/table-form-design.css';
import UpdateMedicineModal from '../modal/MyModal';
import selectStyle from '../../css/select-design.css';

class Medicine  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            savedid:'',
            newMedicine: {
                name:'', 
                price: '0.5',
                unit: 'mg',
                quantity: '', 
                type: '',
            },
            choosedMedicine:{
                    id: '',
                    name:'',
                    price: '',
                    unit: '',
                    quantity: '',
                    type: '',
            },
            errorQuantity: '',
            errorType: '',
            errorQuantityModal: '',
            errorTypeModal: '',
            isModalOpen: false,
            medicineList: [],
            medicineNames: []
        };
            this.fieldChanged = this.fieldChanged.bind(this);
            this.choosedFieldChanged = this.choosedFieldChanged.bind(this);
            this.onSubmitEvent = this.onSubmitEvent.bind(this);
            this.renderResultRows = this.renderResultRows.bind(this);
            this.fetchSongDetails = this.fetchSongDetails.bind(this);
            this.closeModal = this.closeModal.bind(this);
            this.openModal = this.openModal.bind(this);
            this.onSubmitEventUpdateMedicineData = this.onSubmitEventUpdateMedicineData.bind(this);
            this.isNumber = this.isNumber.bind(this);
            this.deleteMedicine = this.deleteMedicine.bind(this);
            this.renderMedicineNames = this.renderMedicineNames.bind(this);
    }
    componentDidMount() {
        fetch("http://localhost:8080/exam/medicine")
            .then( (response) => {
                return response.json() })   
                    .then( (json) => {
                        this.setState({medicineList: json});
                });
        fetch("http://localhost:8080/exam/med_type/names")
            .then( (response) => {
                return response.json() })   
                    .then( (json) => {
                        var temp = {
                            name: json[0], 
                            price: '0.5',
                            unit: 'mg',
                            quantity: '', 
                            type: '',
                        }
                        this.setState({medicineNames: json, newMedicine:temp});
                });
    };
    isNumber(n){
        return n != "" && Number(n) == n;
    }
    fieldChanged(field, event) {
        const newmed = Object.assign(this.state.newMedicine, {
            [field]: event.target.value
        });
        this.setState({newMedicine: newmed, errorQuantity: "", errorType: ""});
    }
    choosedFieldChanged(field, event) {
        const updatedmed = Object.assign(this.state.choosedMedicine, {
            [field]: event.target.value
        });
        this.setState({errorTypeModal: '', errorQuantityModal: ''});
    }
    onSubmitEvent(event){
        event.preventDefault();
        var okey = 0;
        if (this.isNumber(this.state.newMedicine.quantity) == true) okey = okey + 1;
        else this.setState({errorQuantity: "The quantity must be a number!"});
        if (this.state.newMedicine.type.replace(/ /g,"") != "") okey = okey + 1;
        else this.setState({errorType: "The type is required!"});

        if (okey == 2){
            var formData = new FormData();
            for (var k in this.state.newMedicine) {
                    formData.append(k, this.state.newMedicine[k]);
            }
            fetch('http://localhost:8080/exam/medicine', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; '
                },
                body: formData
                }).then(() => {
                    this.componentDidMount();
                    const ex = {
                        name: '',
                        price: '0.5',
                        unit: '',
                        quantity: '',
                        type: ''
                    }
                    this.setState({newMedicine: ex});
                    swal({
                        title: "Warning!?",
                        text: "The unit price of this type will be 0.5 LEI / unit!  Do you want to change it now?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes, i want to change!",
                        closeOnConfirm: true
                        },
                        function(){
                            browserHistory.push("/med_unit_prices");
                        });
            });
        }
    }
     onSubmitEventUpdateMedicineData(event){
        event.preventDefault();
        var okey = 0;
        if (this.isNumber(this.state.choosedMedicine.quantity) == true) okey = okey + 1;
        else this.setState({errorQuantityModal: "The quantity must be a number!"});
        if (this.state.choosedMedicine.type.replace(/ /g,"") != "") okey = okey + 1;
        else this.setState({errorTypeModal: "The type is required!"});
        if (okey == 2){
            var formData = new FormData();
            for (var k in this.state.choosedMedicine) {
                    formData.append(k, this.state.choosedMedicine[k]);
            }
            fetch('http://localhost:8080/exam/medicine', {
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
    deleteMedicine(){
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
                var formData = new FormData();
                formData.append("savedid", this.state.savedid);
                fetch('http://localhost:8080/exam/doses/delete_med/' + this.state.savedid, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; '
                    },
                    }).then( (response) => {
                        return response.json() })   
                            .then( (json) => {
                                if (json[0] == "success"){
                                    fetch('http://localhost:8080/exam/storage/medicine/delete/' + this.state.savedid, {
                                    method: 'DELETE',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; '
                                    },
                                    }).then( (response) => {
                                        return response.json() })   
                                            .then( (json) => {
                                                if (json[0] == "success"){
                                                    fetch('http://localhost:8080/exam/medicine/delete/' + this.state.savedid, {
                                                        method: 'DELETE',
                                                        headers: {
                                                            'Accept': 'application/json',
                                                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; '
                                                        },
                                                        }).then(() => {
                                                            this.closeModal();
                                                            this.componentDidMount();
                                                            swal("Deleted!", this.state.choosedMedicine.name + " has been deleted.", "success");
                                                    });
                                                } else {
                                                    swal("Error!", this.state.choosedMedicine.name + " has not been deleted.", "error");
                                                }
                                    });
                                } else {
                                }
                });
            } else {
                swal("Cancelled", "Medicine type is safe!", "error");
            }
        }.bind(this));
    }
    fetchSongDetails(medicine, event){
            const  temp = {
                    id: medicine.id,
                    name: medicine.medicinetype.name,
                    price: medicine.price,
                    unit: medicine.unit,
                    quantity: medicine.quantity,
                    type: medicine.name
            }
            this.setState({choosedMedicine: temp, savedid: medicine.id, errorType: '', errorQuantity: ''});
            this.openModal();
    }
    renderResultRows() {
        return this.state.medicineList.map((medicine, index) => { 
            return (
                <tr key={index} data-item={medicine} onClick={(event) => this.fetchSongDetails(medicine, event)}>
                    <td> {medicine.medicinetype.name} </td>
                    <td> {medicine.name} </td>
                    <td> {medicine.unit} </td>
                    <td> {medicine.quantity} </td>
                </tr>
            );
        });  
    }
    openModal() {
      this.setState({ isModalOpen: true });
    }
    closeModal() {
      this.setState({ isModalOpen: false, errorTypeModal:'', errorQuantityModal: ''});
    }

    checkType(){
        return (
             <tbody id={styles.typesTbody}> 
                    {this.renderResultRows()}
            </tbody>
        );
    }
    renderMedicineNames(){
        return this.state.medicineNames.map((medname, index) => {
            return (
                   <option key={index}>{medname}</option>
                );
            });  
    }
    render() {
        const { isAuthenticated } = this.props.auth;
        if (!isAuthenticated) browserHistory.push('/signin');
        else if (this.props.auth.user.alvl == 'inhabitant') browserHistory.push('/404_not_found');
        
        return (
         <div>
            <UpdateMedicineModal isOpen={this.state.isModalOpen} onClose={() => this.closeModal()}>
                    <img id="close" src="http://icons.iconarchive.com/icons/custom-icon-design/office/256/close-icon.png" alt="" style={{position:"absolute" ,right: "-35px", top: "-35px"}} width="40px" height="40px" onClick={() => this.closeModal()}/>
                    <div className={styles.container}>  
                                <form id={styles.contact} action="" method="get" style={{paddingBottom:"5%", paddingTop:"3%", marginBottom:0, marginTop:0}}>
                                    <br/>                                 
                                    <center><h3 className={styles.myBigLabel}><strong> Update {this.state.choosedMedicine.name}'s data </strong></h3></center>
                                    <br/><br/>
                                    <label className={styles.myNormalLabels}><h6>Type:</h6></label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorTypeModal}</label>
                                    <fieldset>
                                        <input  placeholder="Type of the medicine:" type="text" tabIndex="7"  autoFocus defaultValue={this.state.choosedMedicine.type}  onChange={(event) => this.choosedFieldChanged('type', event)}/>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}><h6>Unit:</h6></label>
                                     <fieldset>
                                        <select defaultValue={this.state.choosedMedicine.unit} name="unit" className={selectStyle.myselect} tabIndex="8"  onChange={(event) => this.choosedFieldChanged('unit', event)}>
                                            <option className={selectStyle.myoptions}>mg</option>
                                            <option className={selectStyle.myoptions}>ml</option>
                                        </select>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}><h6>Quantity:</h6></label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorQuantityModal}</label>
                                    <fieldset>
                                        <input  placeholder="How many is in one box?" type="text" tabIndex="9" required defaultValue={this.state.choosedMedicine.quantity}  onChange={(event) => this.choosedFieldChanged('quantity', event)}/>
                                    </fieldset>
                                    <fieldset>
                                        <button name="submit" type="submit" id="contact-submit" data-submit="...Sending" onClick={this.onSubmitEventUpdateMedicineData}>Update</button>
                                    </fieldset>
                                    <div> <button name="delete" type="button" id="contact-submit" onClick={() => this.deleteMedicine()}>Delete</button> </div>
                                </form>
                        </div>
            </UpdateMedicineModal>
            <div id={styles.block_container}>
                    <div className={styles.inonelineTable} id={styles.block1}>
                        <table className={styles.mytablebl}>
                            <thead>
                                <tr >
                                    <th>Medicine name</th>
                                    <th>Type </th>
                                    <th>Unit</th>
                                    <th>Box/Quantity</th>
                                </tr>
                            </thead>
                                {this.checkType()} 
                            <thead>
                                <tr >
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className={styles.inonelineForm} id={styles.block2}>
                        <br/>                    
                    
                        <div className={styles.container}>  
                                <form id={styles.contact} action="" method="get">
                                    <label className={styles.myBigLabel}><strong> New type </strong></label>
                                    <br/> <br/>
                                    <label className={styles.myNormalLabels}><h6>Medicine name:</h6></label>
                                    <fieldset>
                                        <select className={selectStyle.myselect} defaultValue={this.state.medicineNames[0]} tabIndex="1" onChange={(event) => this.fieldChanged('name', event)}>
                                            {this.renderMedicineNames()}
                                        </select>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Type:</label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorType}</label>
                                    <fieldset>
                                        <input id="name" placeholder="Type of the medicine" type="text" tabIndex="2" required autoFocus value={this.state.newMedicine.type}  onChange={(event) => this.fieldChanged('type', event)}/>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Unit:</label>
                                    <fieldset>
                                        <select name="unit"  className={selectStyle.myselect} tabIndex="3"  onChange={(event) => this.fieldChanged('unit', event)}>
                                            <option className={selectStyle.myoptions}>mg</option>
                                            <option className={selectStyle.myoptions}>ml</option>
                                        </select>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Quantity per box:</label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorQuantity}</label>
                                    <fieldset>
                                        <input id="quantity" placeholder="Example: 8 pills or ml / box" type="text" tabIndex="4" required value={this.state.newMedicine.quantity}  onChange={(event) => this.fieldChanged('quantity', event)}/>
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

Medicine.propTypes = {
    auth: React.PropTypes.object.isRequired
}

function mapStateToProps(state){
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps) (Medicine);
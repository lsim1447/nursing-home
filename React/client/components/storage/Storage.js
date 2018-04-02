import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import styles from '../../css/table-form-design.css';
import selectStyle from '../../css/select-design.css';
import UpdateStorageModal from '../modal/MyModal';

class Storage  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            savedid: '',
            choosedRow: {
                id: '',
                price: '',
                quantity: '',
                date: '',
                name: '',
                type: ''
            },
            newStorage: {
                name: '',
                type: '',
                price: '',
                quantity: '',
                date: ''
            },
            errorPrice: '',
            errorQuantity: '',
            errorDate: '',
            errorPriceModal: '',
            errorQuantityModal: '',
            errorDateModal: '',
            medicineNames: [],
            medicineTypes: [],
            storageAllList: [],
            today: '',
            isModalOpen: false
        };
        
        this.renderMedicineNames = this.renderMedicineNames.bind(this);
        this.renderMedicineTypes = this.renderMedicineTypes.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.renderAllResultRows = this.renderAllResultRows.bind(this);
        this.fetchStorageDetails = this.fetchStorageDetails.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.fieldChanged = this.fieldChanged.bind(this);
        this.choosedFieldChanged = this.choosedFieldChanged.bind(this);
        this.onSubmitEvent = this.onSubmitEvent.bind(this);
        this.onSubmitEventUpdateStorageData = this.onSubmitEventUpdateStorageData.bind(this);
        this.deleteStoor = this.deleteStoor.bind(this);
        this.isNumber = this.isNumber.bind(this);
        this.getTypesByName = this.getTypesByName.bind(this);
    }
    componentDidMount(first) {
        fetch("http://localhost:8080/exam/med_type/exist_names")
            .then( (response) => {
                return response.json() })   
                    .then( (json) => {
                        this.setState({medicineNames: json});
                        const t = {
                            name: this.state.medicineNames[0],
                            type: '',
                            price: '',
                            quantity: '',
                            date: ''
                        }
                        this.setState({newStorage: t});
                        this.getTypesByName(this.state.medicineNames[0]);

        });
        fetch("http://localhost:8080/exam/storage/medicine/all")
            .then( (response) => {
                return response.json() })   
                    .then( (json) => {
                        this.setState({storageAllList: json});
                        if (first = 'undefined'){
                            var oke = false;
                            json.map((storage, index) => { 
                                if (this.state.today > storage.date){
                                    oke = true;
                                }
                            })
                            if (oke){
                                swal({
                                    title: "Some medicine's warranty period expired!",
                                    text: "This will close in few seconds.",
                                    timer: 4000,
                                    showConfirmButton: true
                                });
                            }

                        }
                });
        var year = new Date().getFullYear();
        var month = (new Date().getMonth()+1);
        if (month<10) month = "0" + month;
        var day = new Date().getDate();
        if (day < 10) day = "0" + day;
        this.setState({today: year + "-" + month  + "-" + day });
    };
    getTypesByName(medname){
        fetch('http://localhost:8080/exam/medicine/typenamesbyname/' + medname, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; '
                },
        }).then( (response) => {
                    return response.json() })   
                        .then( (json) => {
                            this.setState({medicineTypes: json});
                            var  temp = {
                                    name: this.state.newStorage.name,
                                    type: json[0],
                                    price: this.state.newStorage.price,
                                    quantity: this.state.newStorage.quantity,
                                    date: this.state.newStorage.date
                            }
                            this.setState({newStorage: temp});
                        });
    }
    fieldChanged(field, event) {
        const newstoor = Object.assign(this.state.newStorage, {
            [field]: event.target.value
        });
        this.setState({newStorage: newstoor, errorDate: '', errorPrice: '', errorQuantity: ''});
        if (field == "name") this.getTypesByName(event.target.value);
    }
    choosedFieldChanged(field, event) {
        const updatestoore = Object.assign(this.state.choosedRow, {
            [field]: event.target.value
        });
        this.setState({choosedRow: updatestoore, errorDateModal: '', errorPriceModal: '', errorQuantityModal: ''});
        if (field == "name") this.getTypesByName(event.target.value);
    }
    isNumber(n){
        return n != "" && Number(n) == n;
    }
    openModal() {
      this.setState({ isModalOpen: true })
    }

    closeModal() {
      this.setState({ isModalOpen: false })
    }
    onSubmitEvent(event){
        event.preventDefault();
        var okey = 0;
        if (this.state.newStorage.price.replace(/ /g,"") == ""){
            this.setState({errorPrice: "This field is required!"});
        } else if (this.isNumber(this.state.newStorage.price) == false){
            this.setState({errorPrice: "The price must be a number!"});
        } else okey = okey + 1;
        if (this.state.newStorage.date.replace(/ /g,"") == ""){
            this.setState({errorDate: "This field is required!"});
        } else okey = okey + 1;
        if (this.state.newStorage.quantity.replace(/ /g,"") == ""){
            this.setState({errorQuantity: "This field is required!"});
        } else if (this.isNumber(this.state.newStorage.quantity) == false ){
            this.setState({errorQuantity: "The quantity must be a number!"});
        } else okey = okey + 1;

        if (okey == 3){
            var formData = new FormData();
            for (var k in this.state.newStorage) {
                    formData.append(k, this.state.newStorage[k]);
            }
            fetch('http://localhost:8080/exam/storage/medicine', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; '
                },
                body: formData
                }).then(() => {
                    var temp = {
                            name: this.state.newStorage.name,
                            type: this.state.newStorage.type,
                            price: '',
                            quantity: '',
                            date: ''
                    }
                    this.setState({newStorage: temp});
                    this.componentDidMount(false);
            });
        }
    }
    onSubmitEventUpdateStorageData(event){
        event.preventDefault();
        var okey = 0;
        if (this.state.choosedRow.price == ""){
            this.setState({errorPriceModal: "This field is required!"});
        } else if (this.isNumber(this.state.choosedRow.price) == false){
            this.setState({errorPriceModal: "The price must be a number!"});
        } else okey = okey + 1;
        if (this.state.choosedRow.date == ""){
            this.setState({errorDateModal: "This field is required!"});
        } else okey = okey + 1;
        if (this.state.choosedRow.quantity == ""){
            this.setState({errorQuantityModal: "This field is required!"});
        } else if (this.isNumber(this.state.choosedRow.quantity) == false ){
            this.setState({errorQuantityModal: "The quantity must be a number!"});
        } else okey = okey + 1;
        if (okey == 3){
            var formData = new FormData();
            for (var k in this.state.choosedRow) {
                formData.append(k, this.state.choosedRow[k]);
            }
            fetch('http://localhost:8080/exam/storage/medicine', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; '
                },
                body: formData
                }).then(() => {
                    this.closeModal();
                    this.componentDidMount(false);
            });
        }
    }
    deleteStoor(){
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
                fetch('http://localhost:8080/exam/storage/medicine/delete/' + this.state.savedid, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; '
                    },
                    }).then(() => {
                        this.closeModal();
                        this.componentDidMount(false);
                        swal("Deleted!", "This row has been deleted.", "success");
                });
            } else {
                swal("Cancelled", "Your imaginary file is safe :)", "error");
            }
        }.bind(this));
    }
    fetchStorageDetails(storage, event){
            this.setState({errorDate: '', errorPrice: '', errorQuantity: ''});
            const  temp = {
                 id: storage.id,
                 price: storage.price,
                 quantity: storage.quantity,
                 date: storage.date,
                 name: storage.med.medicinetype.name,
                 type: storage.med.name
            }
            this.setState({choosedRow: temp});
            this.setState({savedid: storage.id});
            this.openModal();
    }
    checkType(){
            return (
                <table className={styles.mytablebl}>
                    <thead className={styles.aboveTable}>
                         Medicines on stock
                    </thead>
                    <thead>
                            <tr >
                                <th>Medicine name </th>
                                <th>Type</th>
                                <th>Unit price </th>
                                <th>Quantity</th>
                                <th>Date</th>
                            </tr>
                    </thead>
                    <tbody id={styles.storageTbody}> 
                            {this.renderAllResultRows()}
                    </tbody>
                    <thead>
                            <tr >
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
    renderAllResultRows() {
        return this.state.storageAllList.map((storage, index) => { 
            if (this.state.today > storage.date){
                return (
                    <tr className={styles.expiredRow} key={index} data-item={storage} onClick={(event) => this.fetchStorageDetails(storage, event)}>
                        <td > {storage.med.medicinetype.name} </td>
                        <td > {storage.med.name} </td>
                        <td > {storage.unitprice} </td>
                        <td > {storage.quantity} </td>
                        <td > {storage.date} </td>
                    </tr>
                );
            } else {
                return (
                    <tr key={index} data-item={storage} onClick={(event) => this.fetchStorageDetails(storage, event)}>
                        <td > {storage.med.medicinetype.name} </td>
                        <td > {storage.med.name} </td>
                        <td > {storage.unitprice} </td>
                        <td > {storage.quantity} </td>
                        <td > {storage.date} </td>
                    </tr>
                );
            }
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
            <UpdateStorageModal isOpen={this.state.isModalOpen} onClose={() => this.closeModal()}>
            <img id="close" src="http://icons.iconarchive.com/icons/custom-icon-design/office/256/close-icon.png" alt="" style={{position:"absolute" ,right: "-35px", top: "-35px"}} width="40px" height="40px" onClick={() => this.closeModal()}/>
                <form id={styles.contact} action="" method="get" style={{paddingBottom:"5%", paddingTop:"3%", marginBottom:0, marginTop:0}}>
                                    <br/>
                                    <center><label className={styles.myBigLabel}><strong> Update storage </strong></label></center>
                                    <br/><br/>
                                    <label className={styles.myNormalLabels}><h6>Name of the medicine:</h6></label>
                                    <fieldset>
                                        <select className={selectStyle.myselect} defaultValue={this.state.choosedRow.name} tabIndex="6" onChange={(event) => this.choosedFieldChanged('name', event)}>
                                            {this.renderMedicineNames()}
                                        </select>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}><h6>Type of the medicine:</h6></label>
                                    <fieldset>
                                        <select className={selectStyle.myselect} defaultValue={this.state.choosedRow.type} tabIndex="7" onChange={(event) => this.choosedFieldChanged('type', event)}>
                                            {this.renderMedicineTypes()}
                                        </select>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}><h6>Price of the box (purchase price):</h6></label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorPriceModal}</label>
                                    <fieldset>
                                        <input placeholder="Price" type="text" tabIndex="8" required value={this.state.choosedRow.price}  onChange={(event) => this.choosedFieldChanged('price', event)}/>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}><h6>Quantity (unit):</h6></label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorQuantityModal}</label>
                                    <fieldset>
                                        <input placeholder="Quantity" type="text" tabIndex="9" required value={this.state.choosedRow.quantity}  onChange={(event) => this.choosedFieldChanged('quantity', event)}/>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}><h6>Expiration date:</h6></label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorDateModal}</label>
                                    <fieldset>
                                        <input type="date" tabIndex="10" required value={this.state.choosedRow.date}  onChange={(event) => this.choosedFieldChanged('date', event)}/>
                                    </fieldset>
                                    <fieldset>
                                        <button name="update" type="button" style={{background: "green"}} id="contact-submit" data-submit="...Sending" onClick={this.onSubmitEventUpdateStorageData}>Update</button>
                                    </fieldset>
                                    <div> <button name="delete" type="button" id="contact-submit" onClick={() => this.deleteStoor()}>Delete</button> </div>
                                </form>
            </UpdateStorageModal>

            <div id={styles.block_container}>
                    <div className={styles.inonelineTable} id={styles.block1}>
                        {this.checkType()}
                    </div>
                    <div className={styles.inonelineForm} id={styles.block2}>
                        <br/>                    
                        <div className={styles.container}>  
                                <form id={styles.contact} action="" method="get"    >
                                    <center> <label className={styles.myBigLabel}><strong> Upload storage </strong></label> </center>
                                    <br/><br/>
                                    <label className={styles.myNormalLabels}>Name of the medicine:</label>
                                    <fieldset>
                                        <select className={selectStyle.myselect} defaultValue={this.state.medicineNames[0]} tabIndex="1" onChange={(event) => this.fieldChanged('name', event)}>
                                            {this.renderMedicineNames()}
                                        </select>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Type of the medicine:</label>
                                    <fieldset>
                                        <select className={selectStyle.myselect}  tabIndex="2" onChange={(event) => this.fieldChanged('type', event)}>
                                            {this.renderMedicineTypes()}
                                        </select>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Price of one box:</label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorPrice}</label>
                                    <fieldset>
                                        <input placeholder="Price" type="text" tabIndex="3" required value={this.state.newStorage.price}  onChange={(event) => this.fieldChanged('price', event)}/>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Quantity (how many box):</label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorQuantity}</label>
                                    <fieldset>
                                        <input placeholder="Quantity" type="text" tabIndex="4" required value={this.state.newStorage.quantity}  onChange={(event) => this.fieldChanged('quantity', event)}/>
                                    </fieldset>
                                    <label className={styles.myNormalLabels}>Expiration date:</label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorDate}</label>
                                    <fieldset>
                                        <input type="date" tabIndex="5" required value={this.state.newStorage.date}  onChange={(event) => this.fieldChanged('date', event)}/>
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

Storage.propTypes = {
    auth: React.PropTypes.object.isRequired
}

function mapStateToProps(state){
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps) (Storage);
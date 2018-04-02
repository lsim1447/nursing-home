import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import styles from '../../css/table-form-design.css';
import selectStyle from '../../css/select-design.css';
import MyModal from '../modal/MyModal';

class MedTypes  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newMed: {
                name: '',
            },
            choosedMedicine: {
                id: '',
                name: ''
            },
            medicineList: [],
            isModalOpen: false,
            errorName: '',
            errorModalName: ''
        };
        this.fieldChanged = this.fieldChanged.bind(this);
        this.choosedFieldChanged = this.choosedFieldChanged.bind(this);
        this.onSubmitEvent = this.onSubmitEvent.bind(this);
        this.getMedicineNames = this.getMedicineNames.bind(this);
        this.checkType = this.checkType.bind(this);
        this.renderAllResultRows = this.renderAllResultRows.bind(this);
        this.fetchMedicineDetails = this.fetchMedicineDetails.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.modifyName = this.modifyName.bind(this);
        this.deleteMedicine = this.deleteMedicine.bind(this);
    }
    componentDidMount() {
        this.getMedicineNames();
    }
    fieldChanged(field, event) {
        const newm = Object.assign(this.state.newMed, {
            [field]: event.target.value
        });
        this.setState({newMed: newm, errorName: ''});
        
    }
    choosedFieldChanged(field, event) {
        const choosed = Object.assign(this.state.choosedMedicine, {
            [field]: event.target.value
        });
        this.setState({choosedMedicine: choosed, errorModalName: ''});
        
    }
    openModal() {
      this.setState({ isModalOpen: true });
    }
    closeModal() {
      this.setState({ isModalOpen: false, errorModalName: ''});
    }
    onSubmitEvent(){
        var okey = false;
        if (this.state.newMed.name != "") okey = true;
        else this.setState({errorName: "This field is required!"});
        if (okey == true){
            var formData = new FormData();
            for (var k in this.state.newMed) {
                formData.append(k, this.state.newMed[k]);
            }
            fetch('http://localhost:8080/exam/med_type', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; '
                },
                body: formData
                }).then(() => {
                    var temp = {
                        name: ''
                    }
                    this.setState({newMed: temp});
                    this.getMedicineNames();
            });
        }
    }
    modifyName(){
        var okey = false;
        if (this.state.choosedMedicine.name != "") okey = true;
        else this.setState({errorModalName: "This field is required!"});
        if (okey == true){
            var formData = new FormData();
            for (var k in this.state.choosedMedicine) {
                formData.append(k, this.state.choosedMedicine[k]);
            }
            fetch('http://localhost:8080/exam/med_type', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; '
                },
                body: formData
                }).then(() => {
                    var temp = {
                        id: '',
                        name: ''
                    }
                    this.setState({choosedMedicine: temp});
                    this.getMedicineNames();
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
                swal("Deleted!", this.state.choosedMedicine.name + " has been deleted.", "success");
                this.closeModal();
            } else {
                swal("Cancelled", "Your imaginary file is safe :)", "error");
            }
        }.bind(this));
    }
    getMedicineNames(){
         fetch("http://localhost:8080/exam/med_type/all")
            .then( (response) => {
                return response.json() })   
                    .then( (json) => {
                        this.setState({medicineList: json});
            });
    }
    fetchMedicineDetails(medicine, event){
            var  temp = {
                id: medicine.id,
                name: medicine.name,
            }
            this.setState({choosedMedicine: temp, savedid: medicine.id});
            this.openModal();
    }
     checkType(){
            return (
                <table className={styles.mytable}>
                    <thead>
                            <tr >
                                <th>Medicine name </th>
                            </tr>
                    </thead>
                    <tbody> 
                            {this.renderAllResultRows()}
                    </tbody>
                    <thead>
                            <tr >
                                <th></th>
                            </tr>
                    </thead>
                </table>
            );
    }
    renderAllResultRows() {
        return this.state.medicineList.map((medicine, index) => { 
            return (
                <tr key={index} data-item={medicine} onClick={(event) => this.fetchMedicineDetails(medicine, event)}>
                    <td> {medicine.name} </td>
                </tr>
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
                    <div className={styles.container}>  
                                <form id={styles.contact} action="" method="get" style={{paddingBottom:"5%", paddingTop:"3%", marginBottom:0, marginTop:0}}>
                                    <br/>
                                    <center><label className={styles.myBigLabel}><strong> Update medicine name</strong></label></center>
                                    <br/><br/>
                                    <label className={styles.myNormalLabels}>Name:</label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorModalName}</label>
                                    <fieldset>
                                        <input placeholder="Name" type="text" tabIndex="2" required value={this.state.choosedMedicine.name}  onChange={(event) => this.choosedFieldChanged('name', event)}/>
                                    </fieldset>
                                    
                                    <fieldset>
                                        <button name="submit" style={{background: "green"}} type="button" id="contact-submit" data-submit="...Sending" onClick={this.modifyName}>Update</button>
                                    </fieldset>
                                    <div> <button name="delete" type="button" id="contact-submit" onClick={() => this.deleteMedicine()}>Delete</button> </div>
                                </form>
                    </div>
                </MyModal>
               <div id={styles.block_container}>
                    <div className={styles.inonelineTable} id={styles.block1}>
                        {this.checkType()}
                    </div>
                    <div className={styles.inonelineForm} id={styles.block2}>
                        <br/>                    
                        <div className={styles.container}>  
                                <form id={styles.contact} action="" method="get">
                                    <label className={styles.myBigLabel}><strong>New medicine</strong></label>
                                    <br/><br/>
                                    <label className={styles.myNormalLabels}>Medicine name:</label>
                                    <label id={styles.myErrorLabelStyle}>{this.state.errorName}</label>
                                    <fieldset>
                                        <input placeholder="Name" type="text" tabIndex="1" required value={this.state.newMed.name}  onChange={(event) => this.fieldChanged('name', event)}/>
                                    </fieldset>
                                    
                                    <fieldset>
                                        <button name="submit" style={{background: "green"}} type="button" id="contact-submit" data-submit="...Sending" onClick={this.onSubmitEvent}>Save</button>
                                    </fieldset>
                                </form>
                        </div>
                    </div>
                </div> 
          </div>
        );
    }
}   

MedTypes.propTypes = {
    auth: React.PropTypes.object.isRequired
}

function mapStateToProps(state){
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps) (MedTypes);
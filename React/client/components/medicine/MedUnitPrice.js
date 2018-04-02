import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import selectStyle from '../../css/select-design.css';
import UpdateMedicineModal from '../modal/MyModal';
import styles from '../../css/table-form-design.css';
import textShadow from '../../css/TextShadow.css';

class MedUnitPrice  extends Component {
    constructor(props) {
        super(props);
        this.state = {
             choosedMedicine:{
                    id: '',
                    name:'',
                    type: '',
                    price: '',
                    unit: '',
                    quantity: ''
            },
            errorPriceModal: '',
            medicineList: [],
            isModalOpen: false
        };
            this.choosedFieldChanged = this.choosedFieldChanged.bind(this);
            this.renderResultRows = this.renderResultRows.bind(this);
            this.fetchMedicineDetails = this.fetchMedicineDetails.bind(this);
            this.closeModal = this.closeModal.bind(this);
            this.openModal = this.openModal.bind(this);
            this.updateUnitPrice = this.updateUnitPrice.bind(this);
            this.isNumber = this.isNumber.bind(this);
    }
    componentDidMount() {
        fetch("http://localhost:8080/exam/medicine")
            .then( (response) => {
                return response.json() })   
                    .then( (json) => {
                        this.setState({medicineList: json});
                });
    };

    choosedFieldChanged(field, event) {
        const updatedmed = Object.assign(this.state.choosedMedicine, {
            [field]: event.target.value
        });
    }
    updateUnitPrice(event){
        event.preventDefault();
        var okey = false;
        if (this.state.choosedMedicine.price.replace(/ /g, "") == "") this.setState({errorPriceModal: "This field is required!"});
        else if (this.isNumber(this.state.choosedMedicine.price) == false) this.setState({errorPriceModal: "The price must be a number!"});
        else okey = true;
        if (okey == true){
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
    fetchMedicineDetails(medicine, event){
            const  temp = {
                    id: medicine.id,
                    name: medicine.medicinetype.name,
                    type: medicine.name,
                    price: medicine.price,
                    unit: medicine.unit,
                    quantity: medicine.quantity
            }
            this.openModal();
            this.setState({choosedMedicine: temp});
    }
    renderResultRows() {
        return this.state.medicineList.map((medicine, index) => { 
            return (
                <tr key={index} data-item={medicine} onClick={(event) => this.fetchMedicineDetails(medicine, event)}>
                    <td> {medicine.medicinetype.name}  </td>
                    <td> {medicine.name} </td>
                    <td> {medicine.price} </td>
                </tr>
            );
        });  
    }
    openModal() {
      this.setState({ isModalOpen: true })
    }
   
    closeModal() {
      this.setState({ isModalOpen: false, errorPriceModal: ''})
    }
    isNumber(n){
        return n != "" && Number(n) == n;
    }
    checkType(){
        return (
             <tbody> 
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
                    <UpdateMedicineModal isOpen={this.state.isModalOpen} onClose={() => this.closeModal()}>
                            <img  src="http://icons.iconarchive.com/icons/custom-icon-design/office/256/close-icon.png" alt="" style={{position:"absolute" ,right: "-35px", top: "-35px"}} width="40px" height="40px" onClick={() => this.closeModal()}/>
                            <div className={styles.container}>  
                                        <form id={styles.contact} action="" method="get" style={{paddingBottom:"5%", paddingTop:"3%", marginBottom:0, marginTop:0}}>
                                            <br/>
                                            <center><label className={styles.myBigLabel}><strong> Update unit price of {this.state.choosedMedicine.name} </strong></label></center>
                                             <br/> <br/>
                                            <label className={styles.myNormalLabels}><h6>Type:</h6></label>
                                            <select defaultValue={this.state.choosedMedicine.name} name="name" className={selectStyle.myselect} disabled>
                                                <option className={selectStyle.myoption}> {this.state.choosedMedicine.type} </option>
                                            </select>
                                            
                                            <label className={styles.myNormalLabels}><h6>Unit price (LEI):</h6></label>
                                            <label id={styles.myErrorLabelStyle}>{this.state.errorPriceModal}</label>
                                            <fieldset>
                                                <input  placeholder="Unit price" type="text" tabIndex="8" required defaultValue={this.state.choosedMedicine.price}  onChange={(event) => this.choosedFieldChanged('price', event)}/>
                                            </fieldset>
                                            <fieldset>
                                                <button name="submit" type="submit" id="contact-submit" data-submit="...Sending" onClick={this.updateUnitPrice}>Update</button>
                                            </fieldset>
                                        </form>
                                </div>
                    </UpdateMedicineModal>
                    <br/>
                    <div id={styles.block_container}>
                        <div>
                                <label className={textShadow.elegantshadow}>The price of different types of medicines(piece/ml) </label>
                        </div>
                            <table className={styles.mytable}>
                                    <thead>
                                        <tr >
                                            <th>Medicine name</th>
                                            <th> Type </th>
                                            <th> Unit price (LEI) </th>
                                        </tr>
                                    </thead>
                                        {this.checkType()} 
                                    <thead>
                                        <tr >
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                            </table>
                    </div>
                    <br/>
            </div>
        );
    }
}   
MedUnitPrice.propTypes = {
    auth: React.PropTypes.object.isRequired
}

function mapStateToProps(state){
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps) (MedUnitPrice);
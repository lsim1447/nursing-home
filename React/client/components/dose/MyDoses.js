import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import styles from '../../css/table-form-design.css';
import selectStyle from '../../css/select-design.css';
import MyModal from '../modal/MyModal';

class MyDoses  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            savedid: '',
            limitations: {
                selectedname: this.props.auth.user.fullname,
                firstDate: '',
                lastDate: ''
            },
            totalPrice: '',
            doseAllList: []
        };
        this.renderTable = this.renderTable.bind(this);
        this.renderAllResultRows = this.renderAllResultRows.bind(this);
        this.getAllByName = this.getAllByName.bind(this);
        this.renderTotalPrice = this.renderTotalPrice.bind(this);
        this.limitationsChanged = this.limitationsChanged.bind(this);
    }


    limitationsChanged(field, event) {
        const lim = Object.assign(this.state.limitations, {
            [field]: event.target.value
        });
        this.setState({limitations: lim});
        this.getAllByName();
        this.renderTotalPrice();
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

    componentDidMount(){
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 2);
        var secondDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        document.getElementById("datum1").valueAsDate = firstDay;
        document.getElementById("datum2").valueAsDate = secondDate;
        const temp =  {
            selectedname: this.props.auth.user.fullname,
            firstDate: document.getElementById("datum1").value,
            lastDate:  document.getElementById("datum2").value,
        }
        const lim = Object.assign(this.state, {
            limitations: temp
        });

        this.getAllByName();
        this.renderTotalPrice();
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
                    <tbody className={styles.myTbody}> 
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

    render() {
        const { isAuthenticated } = this.props.auth;
        if (!isAuthenticated) browserHistory.push('/signin');
        
        return (
          <div>
              <br/>
              <div style={{maxWidth: "100%", textAlign: "center", paddingLeft: "15%", paddingRight:"15%"}}>
                        <label id = {styles.myWhiteH3}><h3>Inhabitant's name: {this.props.auth.user.fullname}</h3></label>
                        
                        <div id={styles.block_container}>
                            <div  id={styles.block1}  style={{float: "left"}}>   
                                <label className={styles.FromToDateLabel}> FROM this date</label> 
                                <input type="date" id = "datum1" name = "datum1" style={{ borderBottomLeftRadius: "1em", borderBottomRightRadius: "1em", textAlign:"center", background:"#F0FFF0"}}  onChange={(event) => this.limitationsChanged('firstDate', event)}/> 
                            </div>
                            <div  id={styles.block2}  style={{float: "right"}}> 
                                <label className={styles.FromToDateLabel}>TO this date</label> 
                                <input type="date" id = "datum2" name = "datum2" style={{ borderBottomLeftRadius: "1em", borderBottomRightRadius: "1em", textAlign:"center", background:"#F0FFF0"}}  onChange={(event) => this.limitationsChanged('lastDate', event)}/>
                            </div>
                         </div>
                       {this.renderTable()}
                </div>
            </div>
        );
    }
}   

MyDoses.propTypes = {
    auth: React.PropTypes.object.isRequired
}

function mapStateToProps(state){
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps) (MyDoses);
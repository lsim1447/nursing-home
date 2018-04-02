import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import styles from '../../css/table-form-design.css';
import selectStyle from '../../css/select-design.css';
import MyModal from '../modal/MyModal';
import textShadow from '../../css/TextShadow.css';

class Summarization  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limitations: {
                firstDate: '',
                lastDate: ''
            },
            restoreStorage: {
                medname: '',
                quantity: '',
                stoordate: '',
                price: ''
            },
            doseList: []
        };
        this.getSummarization = this.getSummarization.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.renderAllResultRows = this.renderAllResultRows.bind(this);
        this.limitationsChanged = this.limitationsChanged.bind(this);
    }

    limitationsChanged(field, event) {
        const lim = Object.assign(this.state.limitations, {
            [field]: event.target.value
        });
        this.setState({limitations: lim});
        this.getSummarization();
    }
    getSummarization(){
        var formData = new FormData();
            for (var k in this.state.limitations) {
                    formData.append(k, this.state.limitations[k]);
            }
            fetch('http://localhost:8080/exam/doses/summarization', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; '
                },
                body: formData
                }).then( (response) => {
                    return response.json() })   
                        .then( (json) => {
                            this.setState({doseList: json})
                });
    }
    componentDidMount(){
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 2);
        var secondDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        document.getElementById("datum1").valueAsDate = firstDay;
        document.getElementById("datum2").valueAsDate = secondDate;
        const temp =  {
            firstDate: document.getElementById("datum1").value,
            lastDate:  document.getElementById("datum2").value,
        }
        const lim = Object.assign(this.state, {
            limitations: temp
        });
        this.getSummarization();
    }

     renderAllResultRows() {
        return this.state.doseList.map((dose, index) => { 
            return (
                <tr key={index} data-item={dose}>
                    <td > {dose.person.name} </td>
                    <td > {dose.price} </td>
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
                                <th>Total price (LEI)</th>
                            </tr>
                    </thead>
                    <tbody> 
                            {this.renderAllResultRows()}
                    </tbody>
                    <thead>
                            <tr >
                                <th></th>
                                <th></th>
                            </tr>
                    </thead>
                </table>
            );
    }
    
    render() {
        const { isAuthenticated } = this.props.auth;
        if (!isAuthenticated) browserHistory.push('/signin');
        else if (this.props.auth.user.alvl == 'inhabitant') browserHistory.push('/404_not_found');
        
        return (
          <div>
            <br/>
            <div id={styles.block_container}>
                            <div>
                                <label className={textShadow.elegantshadow}>The amount of money to pay for this interval </label>
                            </div>
                            <div className={styles.inonelineTable} id={styles.block1}>
                                 {this.renderTable()}
                            </div>
                            <div  id={styles.block2}  style={{float: "right", marginRight: "5%", marginTop: "1.5%"}}> 
                                <form id={styles.contact} style={{marginTop: "5.5%"}}>
                                    <center> <label className={styles.myBigLabel}><strong> Please set an interval </strong></label> </center>
                                    <br/>
                                    <label className={styles.FromToDateLabel}><strong>First date:</strong></label> 
                                    <input type="date" 
                                            id = "datum1" 
                                            name = "datum1" 
                                            style={{textAlign: "center"}}  
                                            onChange={(event) => this.limitationsChanged('firstDate', event)} 
                                            style={{ borderBottomLeftRadius: "1em", borderBottomRightRadius: "1em", textAlign:"center", background:"#F0FFF0"}}/> 
                                    <label className={styles.FromToDateLabel}><strong>Last date:</strong></label> 
                                    <input type="date" 
                                            id = "datum2" 
                                            name = "datum2" 
                                            style={{textAlign: "center"}}  
                                            onChange={(event) => this.limitationsChanged('lastDate', event)} 
                                            style={{ borderBottomLeftRadius: "1em", borderBottomRightRadius: "1em", textAlign:"center", background:"#F0FFF0"}}/>
                                </form>
                            </div>
            </div>
            <br/>
        </div>
        );
    }
}   

Summarization.propTypes = {
    auth: React.PropTypes.object.isRequired
}

function mapStateToProps(state){
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps) (Summarization);
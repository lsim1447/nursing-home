import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import styles from '../../css/table-form-design.css';
import selectStyle from '../../css/select-design.css';
import textShadow from '../../css/TextShadow.css';

class StorageView  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storageList: [],
        };
        this.renderResultRows = this.renderResultRows.bind(this);
        this.checkType = this.checkType.bind(this);
    }
    componentDidMount() {
        fetch("http://localhost:8080/exam/storage/medicine")
            .then( (response) => {
                return response.json() })   
                    .then( (json) => {
                        this.setState({storageList: json});
                });
    };
    
    checkType()
    {
            return (
                <table className={styles.mytable}>
                    <thead>
                            <tr >
                                <th>Medicine name </th>
                                <th>Type </th>
                                <th>Quantity (piece or ml)</th>
                            </tr>
                    </thead>
                    <tbody> 
                            {this.renderResultRows()}
                    </tbody>
                    <thead>
                            <tr >
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                    </thead>
                </table>
            );
    }
    renderResultRows() {
        return this.state.storageList.map((storage, index) => { 
            return (
                <tr key={index} data-item={storage}>
                    <td> {storage.medicine.medicinetype.name} </td>
                    <td> {storage.medicine.name} </td>
                    <td> {storage.quantity} </td>
                </tr>
            );
        });  
    }
    render() {
        const { isAuthenticated } = this.props.auth;
        if (!isAuthenticated) browserHistory.push('/signin');
        else if (this.props.auth.user.alvl == 'inhabitant') browserHistory.push('/404_not_found');
        return (
            <div id={styles.block_container}>
                <br/>    
                <div>
                     <label className={textShadow.elegantshadow}>The state of the storage </label>
                </div>
                {this.checkType()}
                <br/>
            </div>
        );
    }
}   

StorageView.propTypes = {
    auth: React.PropTypes.object.isRequired
}

function mapStateToProps(state){
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps) (StorageView);
import axios from 'axios';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import jwt from 'jsonwebtoken';
import { SET_CURRENT_USER } from './types';
import { browserHistory} from 'react-router';

export function setCurrentUser(user){
    return{
        type: SET_CURRENT_USER,
        user: user
    }
}

export function logout(){
    return dispatch => {
        localStorage.removeItem("jwtToken");
        setAuthorizationToken(false);
        dispatch(setCurrentUser({}));
        browserHistory.push('/signin');
    }
}

export function login(data) {
    return dispatch => {
            const token =  data.token;
            localStorage.setItem("jwtToken", token);   
            setAuthorizationToken(token);  
            dispatch(setCurrentUser(jwt.decode(token)));   
    }
}
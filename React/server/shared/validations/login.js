import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function validateInput(data) {
    let errors = {};

    if ( Validator.equals(data.email, '')){
        errors.email = "This field is required!";
    }
    
    if ( Validator.equals(data.password, '')){
        errors.password = "This field is required!";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}
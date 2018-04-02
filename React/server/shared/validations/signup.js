import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function validateInput(data) {
    let errors = {};

    if (Validator.equals(data.fullname, '')){
        errors.fullname = "This filed is required!";
    }
    if (Validator.equals(data.email, '')){
        errors.email = "This filed is required!";
    }
    if (Validator.equals(data.password, '')){
        errors.password = "This filed is required!";
    }
    if (Validator.equals(data.passwordConfirmation, '')){
        errors.passwordConfirmation = "This filed is required!";
    }
    else if (!Validator.equals(data.passwordConfirmation, data.password)){
        if (!Validator.equals(data.password, '')) errors.passwordConfirmation = "Passwords must match !";
    }
    return {
        errors, 
        isValid: isEmpty(errors)
    }
}
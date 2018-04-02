import express from 'express';
import Validator from 'validator';
import validateInput from '../shared/validations/login';
import jwt from 'jsonwebtoken';
import config from '../config';

let router = express.Router();


router.post('/', (req, res) => {
    setTimeout( () => {
        const {errors, isValid } = validateInput(req.body);
        
        if (!isValid) {
            res.status(400).json(errors);
        } else {
            const token = jwt.sign({
                id: '1231',
                username: 'almaata'
            }, config.jwtSecret);
            //res.json({ success: true });
            res.json({ token });
        }
    }, 1000);
});

export default router;
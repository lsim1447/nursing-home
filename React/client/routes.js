import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './components/App';
import SignUpPage from './components/signup/SignUpPage';
import SignInPage from './components/signin/SignInPage';
import About from './components/home/About';
import Persons from './components/persons/Persons';
import Storage from './components/storage/Storage';
import MedicineTypes from './components/medicine/MedicineTypes';
import StorageView from './components/storage/StorageView'
import Dose from './components/dose/Dose';
import MedUnitPrices from './components/medicine/MedUnitPrice';
import Summarization from './components/summarization/Summarization';
import SimplifyDose from './components/dose/SimplifyDose';
import Settings from './components/settings/Settings';
import Consumption from './components/summarization/Consumption';
import Medicines from './components/medicine/Medicines';
import ChangePassword from './components/settings/ChangePassword';
import MyDoses from './components/dose/MyDoses';
import Cure from './components/cure/Cure';
import CureSettings from './components/cure/CureSettings';
import NotFound from './components/notfound/NotFound';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={About} />
        <Route path="signup" component={SignUpPage} />
        <Route path="signin" component={SignInPage} />
        <Route path="persons" component={Persons} />
        <Route path="storage" component={Storage} />
        <Route path="storageview" component={StorageView} />
        <Route path="medicine" component={Medicines} />
        <Route path="doses" component={Dose} />
        <Route path="med_unit_prices" component={MedUnitPrices} />
        <Route path="summarization" component={Summarization} />
        <Route path="dose_simplify" component={SimplifyDose} />
        <Route path="settings" component={Settings} />
        <Route path="consumption" component={Consumption} />
        <Route path="med_types" component={MedicineTypes} />
        <Route path="change_password" component={ChangePassword} />
        <Route path="my_doses" component={MyDoses}/>
        <Route path="cure" component={Cure}/>
        <Route path="cure_settings" component={CureSettings}/>
        <Route path="*" component={NotFound} />
    </Route>
)
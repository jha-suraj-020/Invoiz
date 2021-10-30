import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import { Route, Switch } from 'react-router-dom'
import Login from './components/Login';
import Signup from './components/Signup';
import Invoice from './components/Invoice';
import Company from './components/Company';
import ListProducts from './components/ListProducts';
import CreateInvoice from './components/CreateInvoice';
import CreateCompany from './components/CreateCompany';
import { useState } from 'react';
import Companyinvoice from './components/CompanyInvoice';

function App() {
  let auth=false;

  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path='/createdinvoice/:name' component={Companyinvoice} />
        <Route path="/login"> <Login /> </Route>
        <Route path="/signup" component={Signup} />
        <Route path="/invoice"><Invoice /></Route>
        <Route path="/company"><Company /></Route>
        <Route path="/listprod/:id" component={ListProducts} />
        <Route path="/createinvoice/:id" component={CreateInvoice} />
        <Route path="/createcompany" component={CreateCompany} />
      </Switch>
    </div>
  );
}

export default App;

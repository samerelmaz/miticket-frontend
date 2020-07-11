import React from 'react';
import {Switch, Route, BrowserRouter} from 'react-router-dom';
import RegisterForm from './RegisterForm/RegisterForm';
import LoginForm from './LoginForm/LoginForm';
import Home from './Home/Home';
import Welcome from './Welcome/Welcome';
import 'antd/dist/antd.css';
import '../styles/globalStyles.css';

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Welcome} />
                <Route path='/registro' exact component={RegisterForm} />
                <Route path='/login' exact component={LoginForm} />
                <Route path={['/usuario', '/admin']} exact component={Home} />
            </Switch>
        </BrowserRouter>
         
    )
}

export default App;

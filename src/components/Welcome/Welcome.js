import React from 'react';
import './Welcome.css';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

function Welcome(props) {
    return (
        <div className='abs-center'>
            <h1 className='center-text'>MiTicket</h1>
            <h2 className='center-text'>La app para ver y gestionar tickets</h2>
            <div className='btn-container'>
                <Link to='/registro'><Button type='primary' size='large'>Registro</Button></Link>
                <Link to='/login'><Button type='primary' size='large'>Login</Button></Link>
            </div>
            
        </div>
    )
}
export default Welcome;
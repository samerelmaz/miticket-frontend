import React from 'react';
import './Home.css';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import AdminView from '../AdminView/AdminView';
import UserView from '../UserView/UserView';
import { Button } from 'antd';

function Home(props) {
    return (
        <>
            {!props.user.id && <Redirect to='/login' />}
            <Link to='/'><Button type='secondary' className='logout-btn' >Cerrar sesión</Button></Link>
            <h1 className='center-text mt-3'>Bienvenido, {props.user.name}</h1>
            {props.user.userType === 1 ? <UserView /> : <AdminView />}             
        </>
    )
}

const mapStateToProps = state => ({
    user: state.userReducer.user
})

export default connect(mapStateToProps)(Home);
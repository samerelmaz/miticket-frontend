import React from 'react';
import './Home.css';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import AdminView from '../AdminView/AdminView';
import UserView from '../UserView/UserView';

function Home(props) {
    return (
        <>
            {!props.user.id && <Redirect to='/login' />}
            <h1 className='center-text mt-3'>Bienvenido, {props.user.name}</h1>
            {props.user.userType === 1 ? <UserView /> : <AdminView />}             
        </>
    )
}

const mapStateToProps = state => ({
    user: state.userReducer.user
})

export default connect(mapStateToProps)(Home);
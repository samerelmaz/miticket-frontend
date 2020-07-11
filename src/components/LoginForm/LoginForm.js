import React, { useState } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { validatePassword, validateEmail } from '../../validations/validations';
import { Link } from 'react-router-dom';
import { saveUser } from '../../redux/actionCreators';
import { connect } from 'react-redux';

function LoginForm(props) {
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [formError, setFormError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = (ev) => {
        setEmailError('');  ////Reseteo errores, en caso que el usuario haya solucionado los errores previos
        setPasswordError('');
        setFormError('');
        const validEmail = validateEmail(ev.email);  //Valido los inputs y muestro errores en caso que haga falta
        const validPassword = validatePassword(ev.password);
        if (validEmail === '' && validPassword === '') {
            setLoading(true);
            fetch('http://192.168.1.4:3001/login', {    // Si todos los inputs son validos, hago la peticion de login
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ 
                    "email": ev.email.trim().toLowerCase(),
                    "password": ev.password.trim()  
                })
            })
            .then(res => res.json())
            .then(res => {
                setLoading(false);
                if (res.message === 'login succesful') {
                    props.dispatch(saveUser({
                        'name': res.name,
                        'id': res.id,
                        'userType': res.userType
                    }))
                    if (res.userType === 1) {
                        props.history.push('/usuario')
                    } else {
                        props.history.push('/admin')
                    }
                } else {
                    setFormError(res.message);
                }   
            })
            .catch(()=>{
                setLoading(true);
                setFormError('Oops. Algo salió mal');
            })
        } else {
            setEmailError(validEmail);  // Muestro los errores que puedan haber
            setPasswordError(validPassword);
        }
    }
    return (
        <div className='abs-center'>
            <Form onFinish={handleFormSubmit} className='form'>
                <h1 className='center-text'>Login de usuario</h1>
                <Form.Item name='email'>
                    <Input size='large' type='email' placeholder='Email' />
                </Form.Item>
                {emailError && <Alert message={emailError} type='error' className='error-msg' />}
                <Form.Item name='password'>
                    <Input.Password size='large' placeholder='Contraseña' />
                </Form.Item>
                {passwordError && <Alert message={passwordError} type='error' className='error-msg' />}
                <Form.Item>
                    <Button type='primary' htmlType='submit' loading={loading} className='form-btn' size='large'>Login</Button>
                </Form.Item>
                {formError && <Alert message={formError} type='error' className='error-msg' />}
                <p className='center-text'>¿No tienes una cuenta? <Link to='registro'>Regístrate</Link></p>
            </Form>
        </div>
    )
}
export default connect()(LoginForm);
import React, { useState } from 'react';
import { Form, Input, Button, Alert, Radio } from 'antd';
import { validateNotEmpty, validatePassword, validateEmail } from '../../validations/validations';
import { Link } from 'react-router-dom';
import { saveUser } from '../../redux/actionCreators';
import { connect } from 'react-redux';

function RegisterForm(props) {
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [nameError, setNameError] = useState('');
    const [formError, setFormError] = useState('');
    const [userTypeError, setUserTypeError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = (ev) => {
        setEmailError('');  //Reseteo errores, en caso que el usuario haya solucionado los errores previos
        setPasswordError('');
        setNameError('');
        setFormError('');
        setUserTypeError('')
        const validEmail = validateEmail(ev.email);   //Valido los inputs y muestro errores en caso que haga falta
        const validPassword = validatePassword(ev.password);
        const validName = validateNotEmpty(ev.name);
        const validUserType = validateNotEmpty(ev["user-type"]);
        if (validEmail === '' && validPassword === '' && validName === '' && validUserType === '') {
            setLoading(true);
            fetch('http://localhost:3001/register', { // Si todos los inputs son validos, hago la peticion de registro
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ 
                    "email": ev.email.trim().toLowerCase(),
                    "password": ev.password.trim(),
                    "name": ev.name.trim(),
                    "userType": ev["user-type"]
                })
            })
            .then(res => res.json())
            .then(res => {
                setLoading(false);
                if (res.message === 'register succesful') {
                    props.dispatch(saveUser({
                        'name': res.userInfo.nombre,
                        'id': res.userInfo.id,
                        'userType': res.userInfo['id_tipouser']
                    }))
                    if (res.userInfo['id_tipouser'] === 1) {
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
            setNameError(validName);
            setUserTypeError(validUserType);
        }
    }
    return (
        <div className='abs-center'>
            <Form onFinish={handleFormSubmit} className='form'>
                <h1 className='center-text'>Registro de usuario</h1>
                <Form.Item name='user-type' label='Tipo de usuario'>
                    <Radio.Group>
                        <Radio value={1} >Usuario</Radio>
                        <Radio value={2}>Administrador</Radio>
                    </Radio.Group>
                </Form.Item>
                {userTypeError && <Alert message={userTypeError} type='error' className='error-msg' />}
                <Form.Item name='name'>
                    <Input size='large' type='text' placeholder='Nombre' />
                </Form.Item>
                {nameError && <Alert message={nameError} type='error' className='error-msg' />}
                <Form.Item name='email'>
                    <Input size='large' type='email' placeholder='Email' />
                </Form.Item>
                {emailError && <Alert message={emailError} type='error' className='error-msg' />}
                <Form.Item name='password'>
                    <Input.Password size='large' placeholder='Contraseña' />
                </Form.Item>
                {passwordError && <Alert message={passwordError} type='error' className='error-msg' />}
                <Form.Item>
                    <Button type='primary' htmlType='submit' loading={loading} className='form-btn' size='large'>Registro</Button>
                </Form.Item>
                {formError && <Alert message={formError} type='error' className='error-msg' />}
                <p className='center-text'>¿Ya tienes una cuenta? <Link to='login'>Inicia sesión</Link></p>
            </Form>
        </div>
    )
}
export default connect()(RegisterForm);
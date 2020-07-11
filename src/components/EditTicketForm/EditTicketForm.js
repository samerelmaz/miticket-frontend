import React, { useState, useEffect } from 'react';
import { Button, Form, Select, Alert, Modal } from 'antd';
import { validateNotEmpty } from '../../validations/validations';

function EditTicketForm(props) {
    const [formError, setFormError] = useState('');
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([])
    const editTicket = (ev) => {
        setFormError('');   //Reseteo errores, en caso que el usuario haya solucionado los errores previos
        const validUserId = validateNotEmpty(ev['user-id']);
        if (validUserId === '') {
            setLoading(true);
            fetch('http://localhost:3001/edit-ticket', { // Si todos los inputs son validos, hago la peticion de crear ticket
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ 
                    "id_user": ev['user-id'],
                    "ticketId": ev.ticketId
                })
            })
            .then(res => res.json())
            .then(res => {
                setLoading(false);
                if (res.message === 'ticket updated') {
                    props.setEditableTicket(false);
                    props.fillTableData(res.allTickets);
                    Modal.success({
                        title: 'Ticket editado con éxito'
                    })
                } else {
                    throw new Error('algo salió mal')
                }
            })
            .catch(()=>{
                setFormError('Oops. Algo salió mal');
                setLoading(false);
            })
        } else {
            setFormError(validUserId);  // Muestro los errores que puedan haber
        }
    }
    const getUsers = () => {
        fetch(`http://localhost:3001/users`) // Obtengo los usuarios existentes
            .then(res => res.json())
            .then(res => {
                if (res.message === 'users found') {
                    let users;
                    if (res.userList.length > 0) {
                        users = res.userList.map(user=><Select.Option key={user.id} value={user.id}>{user.nombre}</Select.Option>)
                    } else {
                        users = [<Select.Option key={'disabled'} value='disabled' disabled>No existen usuarios actualmente</Select.Option>]
                    }
                    setUsers(users);
                } else {
                    setFormError('Error al conseguir lista de usuarios. Por favor intente nuevamente')
                }
            })
    }

    useEffect(getUsers, [])

    return (
        <Form onFinish={editTicket} className='form'>
            <h1 className='center-text'>Editar ticket</h1>
            <p className='center-text'>Ticket ID: {props.editTicketInfo.id}</p>
            <Form.Item name='user-id' initialValue={props.editTicketInfo['id_user']} label='Asignar a: '>
                <Select>
                    {users}
                </Select>
            </Form.Item>
            <Form.Item name='ticketId' initialValue={props.editTicketInfo.id}>
                <Button type='primary' htmlType='submit' loading={loading} className='form-btn' size='large'>Editar ticket</Button>
            </Form.Item>
            {formError && <Alert message={formError} type='error' className='error-msg' />}
        </Form>
    )
}
export default EditTicketForm;
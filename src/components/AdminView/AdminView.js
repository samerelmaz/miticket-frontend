import React, {useState, useEffect} from 'react';
import NewTicketForm from '../NewTicketForm/NewTicketForm';
import EditTicketForm from '../EditTicketForm/EditTicketForm';
import { Table, Button, Modal } from 'antd';

function AdminView(props) {
    const [newTicketVisibile, setNewTicketVisible] = useState(true);
    const [ticketFormVisible, setTicketFormVisible] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [tableColumns, setTableColumns] = useState([])
    const [editableTicket, setEditableTicket] = useState(false);
    const [editTicketInfo, setEditTicketInfo] = useState({})

    const fillTableData = tableData => {
        let data;
        if (tableData.length>0) {
            data = tableData.map(ticket=>({
                key: ticket.id,
                id: ticket.id,
                assignedTo: ticket.nombre,
                status: ticket.ticket_pedido?'Pedido' : 'Sin pedir',
                delete: <Button onClick={()=>deleteTicket(ticket.id)}>Eliminar ticket</Button>,
                edit: <Button onClick={()=>{setEditableTicket(true);setEditTicketInfo({
                    id: ticket.id,
                    id_user: ticket.id_user
                })}}>Editar ticket</Button>
            }))
        } else {
            data = [{
                key: 'empty',
                id: 'No existen tickets'
            }]
        }
        setTableData(data);
    }
    const deleteTicket = ticketId => {
        fetch('http://localhost:3001/delete-ticket', {    // Si todos los inputs son validos, hago la peticion de login
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                "ticketId": ticketId
            })
        })
        .then(res => res.json())
        .then(res => {
            if (res.message === 'ticket eliminado') {
                fillTableData(res.allTickets)  //Actualizo la data de la tabla directamente, para evitar hacer una nueva peticion
                Modal.success({
                    title: 'Ticket eliminado con éxito'
                })
            }
        })
        .catch(()=>{
            Modal.error({
                title: 'Error al eliminar el ticket'
            })
        })
    }
    const getTableData = () => {
        const columns = [
            {
                title: 'Ticket ID',
                dataIndex: 'id',
                key: 'id'
            },
            {
                title: 'Asignado a',
                key: 'status',
                dataIndex: 'assignedTo',
            },
            {
                title: 'Status',
                key: 'status',
                dataIndex: 'status',
            },
            {
                title: '',
                key: 'edit',
                dataIndex: 'edit',
            },
            {
                title: '',
                key: 'delete',
                dataIndex: 'delete',
            }
        ]
        fetch(`http://localhost:3001/all-tickets`) // Obtengo los tickets de todos los usuarios
        .then(res => res.json())
        .then(res => {
            if (res.message === 'tickets found') {
                fillTableData(res.allTickets)   
                setTableColumns(columns);
            }
        })
    }

    useEffect(getTableData, [])

    return (
        <>
            <h1 className='center-text'>Listado de tickets</h1>
            <Table columns={tableColumns} dataSource={tableData} />
            {newTicketVisibile && <Button type='primary' size='large' className='center-btn' onClick={()=>{setTicketFormVisible(true);setNewTicketVisible(false)}}>Crear nuevo ticket</Button>}
            {ticketFormVisible && <NewTicketForm setNewTicketVisible={setNewTicketVisible} setTicketFormVisible={setTicketFormVisible} deleteTicket={deleteTicket} fillTableData={fillTableData} />}
            {editableTicket && <EditTicketForm key={new Date()} editTicketInfo={editTicketInfo} setEditableTicket={setEditableTicket} fillTableData={fillTableData} /> /*Este key con la fecha es para forzar a react a generar un nuevo componente de edicion, permitiendo montar de nuevo el componente si se clickea para editar otro ticket. De lo contrario se queda la misma informacion del primer ticket editado*/}
        </>
    )
}
export default AdminView;
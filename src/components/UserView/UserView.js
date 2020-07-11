import React, {useState, useEffect} from 'react';
import { Table, Button, Modal } from 'antd';
import { connect } from 'react-redux';

function UserView(props) {
    const [tableData, setTableData] = useState([]);
    const [tableColumns, setTableColumns] = useState([])

    const pedirTicket = ticketId => {
        fetch('http://localhost:3001/pedir-ticket', {    // Si todos los inputs son validos, hago la peticion de login
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                "ticketId": ticketId,
                "userId": props.user.id
            })
        })
        .then(res => res.json())
        .then(res => {
            if (res.message === 'ticket pedido') {
                fillTableData(res.allUserTickets);  //Actualizo la data de la tabla directamente, para evitar hacer una nueva peticion
                Modal.success({
                    title: 'Ticket pedido con éxito'
                })
            } else {
                throw new Error ('error pidiendo ticket')
            }
        })
        .catch(()=>{
            Modal.error({
                title: 'No fue posible pedir el ticket'
            })
        })
    }
    const fillTableData = tableData => {
        let data;
        if (tableData.length>0) {
            data = tableData.map(ticket=>({
                key: ticket.id,
                id: ticket.id,
                ticket_pedido: ticket.ticket_pedido?'Pedido':<Button onClick={()=>pedirTicket(ticket.id)}>Pedir ticket</Button>
            }))
        } else {
            data = [{
                key: 'empty',
                id: 'No existen tickets'
            }]
        }
        setTableData(data);
    }
    const getTableData = () => {
        const columns = [
            {
                title: 'Ticket ID',
                dataIndex: 'id',
                key: 'id'
            },
            {
                title: 'Status',
                key: 'status',
                dataIndex: 'ticket_pedido',
            }
        ]
        fetch(`http://localhost:3001/tickets/${props.user.id}`) // Obtengo los tickets del usuario logeado
        .then(res => res.json())
        .then(res => {
            if (res.message === 'tickets found') {
                fillTableData(res.allUserTickets);
                setTableColumns(columns);
            }
        })
    }

    useEffect(getTableData, [])
    return (
        <>
            <h1 className='center-text'>Tus tickets</h1>
            <Table columns={tableColumns} dataSource={tableData} />
        </>
    )
}

const mapStateToProps = state => ({
    user: state.userReducer.user
})

export default connect(mapStateToProps)(UserView);
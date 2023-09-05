import './transaction.css';
import {Fragment, useEffect, useState} from 'react';
import NavBar from '../../component/navbar/NavBar';
import { API } from '../../config/api';

import cancel from '../../assets/icon/cancel.svg';
import complete from '../../assets/icon/complete.svg';
import waiting from '../../assets/icon/waiting.svg';
import TransactionModal from '../../component/modal/TransactionModal';
import {Link} from 'react-router-dom';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [statusParam, setStatusParam] = useState('my-order');
    const [error, setError]  = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalDetailTransaction, setModalDetailTransaction] = useState({
        status : false,
        transaction: '',
        param:''
    });

    const getTransactions = async () => {
        try{
            setLoading(true);
            const response = await API.get(`transactions?status=${statusParam}`);

            if(response.data.status !== "success"){
                setError(true);
                setLoading(false);
                return;
            }

            setTransactions(response.data.data.transactions)
            setError(false);
        } catch(err){
            console.log(err);
        }
    }

    const handleChange = (event) => {
        setStatusParam(event.target.value);
    }

    const responseOrder = async (transactionId,status) => {
        try {
            const body = {
                status
            }
            
            const response = await API.put(`/transaction/${transactionId}`, body);

            if(response.data.status === "success"){
                getTransactions();
            }

            setModalDetailTransaction({
                status: false,
                transaction: "",
                param:""
            });

        } catch(err){
            console.log(err);
        }
    }

    const showModalDetailTransaction = (transaction, param) => {
        setModalDetailTransaction({
            status: true,
            transaction,
            param
        });
    }

    const closeModalDetailTransaction = () => {
        setModalDetailTransaction({
            status: false,
            transaction: ""
        });
    }
    

    useEffect(() =>{
        getTransactions();
    },[statusParam]);

    return (
        <Fragment>
            <NavBar />
            {modalDetailTransaction.status && (
                    <TransactionModal
                        param={modalDetailTransaction.param} 
                        transaction={modalDetailTransaction.transaction}
                        closeModalDetailTransaction={() => {closeModalDetailTransaction()}}
                        responseOrder = {() => responseOrder(modalDetailTransaction.transaction.id, 'Success')} 
                    />
            )}
            <div className="main-container">
                <div className="transaction-container">
                    <select className="transactions-filter" onChange={handleChange}>
                        <option value="my-order">My Order</option>
                        <option value="my-offer">My Offer</option>
                    </select>
                    <table className="table-transactions">
                        <thead>
                            {
                                statusParam === "my-order" ?
                                <tr>
                                    <th>No</th>
                                    <th>Vendor</th>
                                    <th>Order</th>
                                    <th>Start Project</th>
                                    <th>End Project</th>
                                    <th>Status</th>
                                    <th className="transactions-action-head">Action</th>
                                </tr>
                                :
                                statusParam === "my-offer" ?
                                <tr>
                                    <th>No</th>
                                    <th>Client</th>
                                    <th>Order</th>
                                    <th>Start Project</th>
                                    <th>End Project</th>
                                    <th>Status</th>
                                    <th className="transactions-action-head">Action</th>
                                </tr>
                                : null
                            }
                        </thead>
                        <tbody>
                            {
                                statusParam === "my-order"? 
                                    transactions.length > 0 ? transactions.map((transaction, index)=> {
                                        return <tr key={transaction.id}>
                                                    <td>{index+1}</td>
                                                    <td>{transaction.orderTo[0].fullName}</td>
                                                    <td 
                                                        className="transactions-order"
                                                        onClick={() => showModalDetailTransaction(transaction, "my-order")}
                                                        >
                                                        {transaction.description}
                                                    </td>
                                                    <td>{new Date(transaction.startDate).toLocaleDateString()}</td>
                                                    <td>{new Date(transaction.endDate).toLocaleDateString()}</td>
                                                    {
                                                        transaction.status === "Waiting Accept" ? (
                                                            <td className="status-waiting">{transaction.status}</td>
                                                        ):
                                                        transaction.status === "Project is Complete" ? (
                                                            <td className="status-project-complete">{transaction.status}</td>
                                                        ):
                                                        transaction.status === "Waiting Approved Project" ? (
                                                            <td className="status-waiting-approved">{transaction.status}</td>
                                                        ):
                                                        transaction.status === "Rejected" ? (
                                                            <td className="status-reject">{transaction.status}</td>
                                                        ):
                                                        transaction.status === "Success" ? (
                                                            <td className="status-complete">{transaction.status}</td>
                                                        ):
                                                        transaction.status === "Cancel"? (
                                                            <td className="status-cancel">{transaction.status}</td>
                                                        ):null
                                                    }
                                                    <td className="transactions-action">
                                                        {
                                                        transaction.status === "Waiting Accept" ? (
                                                                <img src={waiting} alt="wait" />
                                                            ):
                                                        transaction.status === "Waiting Approved Project" ? (
                                                            <Link to={`/project/${transaction.id}`} className="link">
                                                                <button className="button-approve">View Project</button>
                                                            </Link>
                                                        ):
                                                        transaction.status === "Project is Complete" ? (
                                                            <Link to={`/project/${transaction.id}`} className="link">
                                                                <button className="button-approve">View Project</button>
                                                            </Link>
                                                        ):
                                                        transaction.status === "Rejected" ? (
                                                            <Link to={`/project/${transaction.id}`} className="link">
                                                                <button className="button-approve">View Project</button>
                                                            </Link>
                                                        ):
                                                        transaction.status === "Success" ? (
                                                                <img src={complete} alt="complete" />
                                                            ):
                                                        transaction.status === "Cancel"? (
                                                                <img src={cancel} alt="cancel" />
                                                            ):null
                                                        }
                                                    </td>
                                                </tr>
                                    }) : <tr className="transactions-empty">
                                            <td colSpan={7}>U dont have order right now</td>
                                        </tr>

                                : statusParam === "my-offer"?
                                    transactions.length > 0 ? transactions.map((transaction, index)=> {
                                        return  <tr key={transaction.id}>
                                                    <td>{index+1}</td>
                                                    <td>{transaction.orderBy[0].fullName}</td>
                                                    <td 
                                                        className="transactions-order"
                                                        onClick={() => showModalDetailTransaction(transaction, "my-offer")}
                                                        >
                                                        {transaction.description}
                                                    </td>
                                                    <td>{new Date(transaction.startDate).toLocaleDateString()}</td>
                                                    <td>{new Date(transaction.endDate).toLocaleDateString()}</td>
                                                    {
                                                        transaction.status === "Waiting Accept" ? (
                                                            <td className="status-waiting">{transaction.status}</td>
                                                        ):
                                                        transaction.status === "Waiting Approved Project" ? (
                                                            <td className="status-waiting-approved">{transaction.status}</td>
                                                        ):
                                                        transaction.status === "Project is Complete" ? (
                                                            <td className="status-project-complete">{transaction.status}</td>
                                                        ):
                                                        transaction.status === "Rejected" ? (
                                                            <td className="status-reject">{transaction.status}</td>
                                                        ):
                                                        transaction.status === "Success" ? (
                                                            <td className="status-complete">{transaction.status}</td>
                                                        ):
                                                        transaction.status === "Cancel"? (
                                                            <td className="status-cancel">{transaction.status}</td>
                                                        ):null
                                                    }
                                                    <td className="transactions-action">
                                                        {
                                                        transaction.status === "Waiting Accept" ? (
                                                                <div className="transactions-button">
                                                                    <button 
                                                                        className="button-cancel"
                                                                        onClick={() => responseOrder(transaction.id, 'Cancel')}
                                                                        >
                                                                        Cancel
                                                                    </button>
                                                                    <button 
                                                                        className="button-approve"
                                                                        onClick={() => responseOrder(transaction.id,'Success')}
                                                                        >
                                                                        Approve
                                                                    </button>
                                                                </div>
                                                            ):
                                                        transaction.status === "Success" ? (
                                                                <Link to={`/send/${transaction.id}`} className="link">
                                                                    <button className="button-approve">Send Project</button>
                                                                </Link>
                                                            ):
                                                        transaction.status === "Waiting Approved Project" ? (
                                                                <Link to={`/send/${transaction.id}`} className="link">
                                                                    <button className="button-approve">Send Project</button>
                                                                </Link>
                                                            ):
                                                        transaction.status === "Project is Complete" ? (
                                                            <img src={complete} alt="complete" />
                                                        ):
                                                        transaction.status === "Rejected" ? (
                                                            <Link to={`/send/${transaction.id}`} className="link">
                                                                <button className="button-approve">Send Project</button>
                                                            </Link>
                                                        ):
                                                        transaction.status === "Cancel"? (
                                                                <img src={cancel} alt="cancel" />
                                                            ):null
                                                        }
                                                    </td>
                                                </tr>
                
                                    }) : <tr className="transactions-empty">
                                            <td colSpan={7}>U dont have offer right now</td>
                                         </tr>

                                    : null
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </Fragment>
    )
}

export default Transactions;


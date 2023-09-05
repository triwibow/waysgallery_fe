import './modal.css';
const TransactionModal = (props) => {
    console.log(props.transaction.status)
    return (
        <div className="transaction-modal-wrapper">
            <div className="transaction-modal-container">
                <p className="transaction-modal-title">Title : {props.transaction.title} </p>
                <p className="transaction-modal-description">Description : {props.transaction.description}</p>
                <span className="transaction-modal-price">Price : {props.transaction.price}</span>
                <div className='transaction-modal-footer'>
                    <button 
                        onClick={props.closeModalDetailTransaction}
                        className="transaction-modal-cancel">
                        Close
                    </button>
                   {props.param === "my-offer" && props.transaction.status === "Waiting Accept"?  
                        <button
                            onClick={props.responseOrder} 
                            className="transaction-modal-approve">
                            Approve
                        </button>:null}
                </div>
            </div>
        </div>
    )
}

export default TransactionModal;
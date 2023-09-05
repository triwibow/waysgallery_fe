import './modal.css';

const AlertError = (props) => {
    return (
        <div className="modal-form-alert">
            <span>{props.message}</span>
        </div>
    )
}

export default AlertError;
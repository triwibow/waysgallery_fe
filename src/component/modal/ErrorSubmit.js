import './modal.css';
import close from '../../assets/icon/close.png';

const ErrorSubmit = (props) => {
    return (
        <div className="modal-container">
            <div className="error-submit">
                <p>{props.message}</p>
                <div className="close-error-submit">
                    <button onClick={props.closeModal}>
                        <img src={close} alt="close" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ErrorSubmit;
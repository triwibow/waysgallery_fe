import './modal.css';
import close from '../../assets/icon/close.png';

const SuccessSubmit = (props) => {
    return (
        <div className="modal-container">
            <div className="success-submit">
                <p>{props.message}</p>
                <div className="close-success-submit">
                    <button onClick={props.closeModal}>
                        <img src={close} alt="close" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SuccessSubmit;
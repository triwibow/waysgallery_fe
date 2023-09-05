import './modal.css';

const ProgressBar = (props) => {
    return (
        <div className="modal-container">
            <div className="progress-bar-container">
                <div className="progress-bar" style={{width:`${props.message}%`}}></div>
                <span>{props.message} %</span>
            </div>
        </div>
    )
}

export default ProgressBar;
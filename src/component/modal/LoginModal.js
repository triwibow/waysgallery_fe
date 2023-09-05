import './modal.css';
import {useState, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import {AppContext} from '../../context/AppContext';
import { API, setAuthToken } from '../../config/api';
import close from '../../assets/icon/close.png';
import AlertError from './AlertError';

const LoginModal = (props) => {
    const router = useHistory();
    const [state, dispatch] = useContext(AppContext);
    const [error, setError] = useState({
        status: false,
        message: ''
    });
  
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleInputChange = (event) => {
        setError({
            status: false
        });

        setFormData({
            ...formData,
            [event.target.name] : event.target.value
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {

            const body = JSON.stringify(formData);
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }
            const response = await API.post('/login', body, config);

            if(response.data.status === "error"){
                setError({
                    status: true,
                    message: "Invalid login"
                });
                return false;
            }

            dispatch({
                type: 'LOGIN',
                payload: response.data.data.user
            });

            setAuthToken(response.data.data.user.token);
            router.push('/');
           
        } catch(err){
            console.log(err);
        }
    }
    return(
        <div className="modal-container" >
            <div className="modal-form-container">
                <div className="close-modal">
                    <button onClick={props.closeModal}>
                        <img src={close} alt="close" />
                    </button>
                </div>
                <h1>Sign In</h1>
                {error.status && (<AlertError message={error.message} />)}
                <form className="modal-form" onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Email" 
                        name="email" 
                        autoComplete="off"
                        value={formData.email}
                        onChange={(event) => handleInputChange(event)}
                    />
                    <input
                        type="password" 
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        autoComplete="off"
                        onChange={handleInputChange}
                    />
                    <button className="button-primary">Sign In</button>
                    <span className="modal-form-navigation">Don't have an account ? Click <strong onClick={props.switchModal}>Here</strong></span>
                </form>
            </div>
        </div>
    )
}

export default LoginModal;
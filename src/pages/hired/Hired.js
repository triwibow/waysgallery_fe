import './hired.css';
import calendar from '../../assets/icon/calendar.svg';
import {Fragment, useState} from 'react';
import NavBar from '../../component/navbar/NavBar';
import { API } from '../../config/api';
import { useParams, useHistory } from 'react-router-dom';

import SuccessSubmit from '../../component/modal/SuccessSubmit';
import ErrorSubmit from '../../component/modal/ErrorSubmit';

const Hired = () => {

    const {id} = useParams();
    const router = useHistory();
    const [success, setSuccess] = useState({
        status: false,
        message:''
    });
    const [error, setError] = useState({
        status: false,
        message: ""
    });
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        price:"",
        orderTo: id
    });

    const [isDateFocus, setIsDateFocus] = useState({
        startDate: false,
        endDate: false
    });

    const dateFocus = (event, type) => {
        event.target.type = "date";

        if(type === "start"){
            setIsDateFocus({
                ...isDateFocus,
                startDate: true
            });
        } else if(type === "end"){
            setIsDateFocus({
                ...isDateFocus,
                endDate: true
            });
        }
    }

    const dateBlur = (event, type) => {
        event.target.type = "text";
        if(type === "start"){
            setIsDateFocus({
                ...isDateFocus,
                startDate: false
            });
        } else if(type === "end"){
            setIsDateFocus({
                ...isDateFocus,
                endDate: false
            });
        }
    }

    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await API.post('/hired', formData);

            if(response.data.status !== "success"){
                setError({
                    status: true,
                    message: response.data.error.message
                });
                return;
            }

            setError({
                status:false,
                message: ""
            });

            setSuccess({
                status: true,
                message: "We have sent your offer, please wait for the user accept it"
            })

            setFormData({
                ...formData,
                title: "",
                description: "",
                startDate: "",
                endDate: "",
                price: ""
            })

        } catch(err){
            console.log(err);
        }
    }

    const cancelClick = (event) => {
        event.preventDefault();
        router.goBack();
    }

    const closeModal = () => {
        setError({
            status: false,
            message: ""
        });

        setSuccess({
            status: false,
            message: ""
        });
    }

    return (
        <Fragment>
            <NavBar />
            {error.status && (<ErrorSubmit message={error.message} closeModal={closeModal} />)}
            {success.status && (<SuccessSubmit message={success.message} closeModal={closeModal} />)}
            <div className="main-container">
                <div className="hired-container">
                    <form className="hired-form" onSubmit={handleSubmit}>
                        <input 
                            className="hired-input"
                            placeholder="Title"
                            name="title"
                            onChange={handleInputChange}
                            value={formData.title}
                        />
                        <textarea
                            className="hired-textarea"
                            placeholder="Description Job"
                            name="description"
                            onChange={handleInputChange}
                            value={formData.description}
                        ></textarea>
                        <div className="inline-hired">
                            <div className="inline-hired-item">
                                <input 
                                    placeholder="Start Project"
                                    type="text"
                                    name="startDate"
                                    onFocus={(event, type) => {dateFocus(event, "start")}}
                                    onBlur={(event, type) => {dateBlur(event, "start")}}
                                    onChange={handleInputChange}
                                    value={formData.startDate}
                                />
                                {!isDateFocus.startDate && (<img src={calendar} alt="calendar"/>)}
                            </div>
                            <div className="inline-hired-item">
                                <input 
                                    placeholder="End Project"
                                    type="text"
                                    name="endDate"
                                    onFocus={(event, type) => {dateFocus(event, "end")}}
                                    onBlur={(event, type) => {dateBlur(event, "end")}}
                                    onChange={handleInputChange}
                                    value={formData.endDate}
                                />
                                {!isDateFocus.endDate && (<img src={calendar} alt="calendar"/>)}
                            </div>
                            
                        </div>
                        <input 
                            className="hired-input" 
                            type="number"
                            placeholder="Price"
                            name="price"
                            onChange={handleInputChange}
                            value={formData.price}
                        />
                        <div className="hired-button">
                            <button className="button-secondary" onClick={cancelClick}>Cancel</button>
                            <button className="button-primary">Bidding</button>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default Hired;
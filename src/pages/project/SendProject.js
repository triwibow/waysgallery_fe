import './project.css';
import NavBar from '../../component/navbar/NavBar';
import { Fragment, useState, useEffect } from 'react';
import Dropzone from 'react-dropzone'
import cloudcomputing from '../../assets/icon/cloudcomputing.svg';
import plus from '../../assets/icon/plus.svg';
import Preview from '../../component/preview/Preview';
import {API} from '../../config/api';
import {useParams} from 'react-router-dom';

import ErrorSubmit from '../../component/modal/ErrorSubmit';
import SuccessSubmit from '../../component/modal/SuccessSubmit';
import ProgressBar from '../../component/modal/ProgressBar';

const SendProject = () => {
    const {transactionId} = useParams();
    const [progres, setProgres] = useState(0);
    const [loading, setLoading] = useState(false);
    const [previews, setPreviews] = useState([]);

    const [error, setError] = useState({
        status: false,
        message: ''
    });

    const [success, setSuccess] = useState({
        status: false,
        message: ''
    })

    const [formData, setFormdata] = useState({
        description: ''
    });

    const handleOnDrop = (acceptedFiles, rejectedFiles) => {

        if(rejectedFiles.length > 0){
            setError({
                status: true,
                message: 'Only images are allowed'
            });
            return;
        }
        if(acceptedFiles.length > 5){
            setError({
                status: true,
                message: 'Files cannot be more than 5'
            });

            return;
        }

        if(previews.length >= 5){
            setError({
                status: true,
                message: 'Files cannot be more than 5'
            });

            return;
        }
        
        if(acceptedFiles.length > 1){
            if(previews.length === 0){
                setPreviews(
                    ...previews,
                    acceptedFiles
                )
            } else {
                const data = [...previews];
                const indexArr = data.length;
                
                for(let i = 0; i < acceptedFiles.length; i++){
                    data[indexArr + i] = acceptedFiles[i]
                }
                setPreviews(data);
            }
        } else {
            setPreviews(
                [...previews, acceptedFiles[0]]
            );
        }
    }

    const handleInputChange = (event) => {
        setFormdata({
            ...formData,
            [event.target.name]:event.target.value
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const body = new FormData();
        body.append('transactionId', parseInt(transactionId));
        body.append('description', formData.description);

        if(previews.length === 0){
            setError({
                status: true,
                message: 'Please select a photo at least 1 photo'
            });
            return;
        }

        previews.forEach(photo => {
            body.append('project', photo);
        });

        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
            onUploadProgress: (event)=> {
                const {loaded, total} = event;
                let percent = Math.floor( (loaded * 100) / total )
                setProgres(percent);
            }
        };

        try{
            setLoading(true);
            const response = await API.post('/project',body, config);

            if(response.data.status !== "success"){
                setError({
                    status: true,
                    message: response.data.error.message
                });
                setSuccess({
                    status: false,
                    message: ""
                });

                setLoading(false);
                return;
            }

            const newStatusTransaction = {
                status: 'Waiting Approved Project'
            }

            const updateStatusTransaction = await API.put(`/transaction/${transactionId}`, newStatusTransaction);

            if(updateStatusTransaction.data.status !== "success"){
                setError({
                    status: true,
                    message: updateStatusTransaction.data.error.message
                });
                setSuccess({
                    status: false,
                    message: ""
                });
                setLoading(false);
                return;
            }

            setSuccess({
                status: true,
                message: 'Your project has been sent successfully'
            });
            setError({
                status: false,
                message: ""
            });
            setFormdata({
                description: ''
            });
            setPreviews([]);
            setLoading(false);

        }catch(err){
            console.log(err);
            setLoading(false);
        }
    }

    const closeModal = () => {
        setError({
            status:false,
            message: ''
        })

        setSuccess({
            status: false,
            message: ''
        });
    }

    useEffect(() => {
        if(progres == 100){
            setProgres(0)
        }
    },[progres])


    return (
        <Fragment>
            <NavBar />
            {loading && (<ProgressBar message={progres} />)}
            {error.status && <ErrorSubmit message={error.message} closeModal={closeModal} />}
            {success.status && <SuccessSubmit message={success.message} closeModal={closeModal} />}
            <div className="main-container">
                <div className="upload-project-container">
                    <div className="upload-project-photo">
                        <div className="upload-project-photo-primary">
                            <Dropzone onDrop={handleOnDrop} maxSize={3 * 1000 * 1000}>
                                {({getRootProps, getInputProps}) => (
                                    <section>
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            {previews.length > 0 ? <Preview file={previews[0]} primary={true} />:
                                                <div>
                                                    <img src={cloudcomputing} alt="cloud" className="photo-primary" />
                                                    <p className="browse"><span>Browse</span> to choose a Project</p>
                                                </div>
                                            }
                                        </div>
                                    </section>
                                )}
                            </Dropzone>
                        </div>
                        <div className="upload-project-photo-secondary">
                            <div className="project-photo-item">
                                {previews[1] ? 
                                  <Preview file={previews[1]} />:<img src={plus} alt="cloud" className="project-photo-preview"/>
                                } 
                            </div>
                            <div className="project-photo-item">
                                {previews[2] ? 
                                  <Preview file={previews[2]} />:<img src={plus} alt="cloud" className="project-photo-preview"/>
                                } 
                            </div>
                            <div className="project-photo-item">
                                {previews[3] ? 
                                  <Preview file={previews[3]} />:<img src={plus} alt="cloud" className="project-photo-preview"/>
                                } 
                            </div>
                            <div className="project-photo-item">
                                {previews[4] ? 
                                  <Preview file={previews[4]} />:<img src={plus} alt="cloud" className="project-photo-preview"/>
                                } 
                            </div>

                        </div>
                    </div>
                    <div className="upload-project-form">
                        <form onSubmit={handleSubmit}>
                            <textarea
                                name="description"
                                placeholder="Description"
                                value={formData.description}
                                onChange={handleInputChange}   
                            >
                            </textarea>
                            <div className="upload-project-button">
                                <button className="button-primary">Send Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default SendProject;
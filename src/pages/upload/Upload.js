import './upload.css';
import {Fragment, useEffect} from 'react';
import {useState} from 'react';
import { API } from '../../config/api';
import NavBar from '../../component/navbar/NavBar';
import {useHistory} from 'react-router-dom';

import Dropzone from 'react-dropzone'
import cloudcomputing from '../../assets/icon/cloudcomputing.svg';
import plus from '../../assets/icon/plus.svg';
import Preview from '../../component/preview/Preview';
import ErrorSubmit from '../../component/modal/ErrorSubmit';
import SuccessSubmit from '../../component/modal/SuccessSubmit';
import ProgressBar from '../../component/modal/ProgressBar';

const Upload = () => {
    const router = useHistory();
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
  
    const [formData, setFormData] = useState({
        title: "",
        description: "",
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
        setFormData({
            ...formData,
            [event.target.name] : event.target.value
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const body = new FormData();
        body.append('title', formData.title );
        body.append('description', formData.description);
       
        if(previews.length === 0){
            setError({
                status: true,
                message: 'Please select a photo at least 1 photo'
            });
            return;
        }

        previews.forEach(photo => {
            body.append('photo', photo);
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
            
        try {
            setLoading(true);
            const response = await API.post('/post',body, config);

            if(response.data.status !== "success"){
                setSuccess({
                    status: false,
                    message:''
                })
                setError({
                    status: true,
                    message: response.data.error.message
                });
                setLoading(false);
                return;
            }

            setFormData({
                title: "",
                description: ""
            });

            setSuccess({
                status:true,
                message: 'Your post was successfully added'
            });

            setError({
                status: false,
                message: ""
            });

            setPreviews([]);
            setLoading(false);
            
        } catch(err){
            console.log(err)
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

    const goBack = (event) => {
        event.preventDefault();
        router.goBack();
    }

    useEffect(() => {
        if(progres == 100){
            setProgres(0)
        }
    },[progres])

    return(
        <Fragment>
            <NavBar />
            {loading && (<ProgressBar message={progres} />)}
            {error.status && <ErrorSubmit message={error.message} closeModal={closeModal} />}
            {success.status && <SuccessSubmit message={success.message} closeModal={closeModal} />}
            <div className="main-container">
                <div className="upload-container">
                    <div className="upload-photo">
                        <div className="upload-photo-primary">
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
                        <div className="upload-photo-secondary">
                            <div className="photo-item">
                                {previews[1] ? 
                                  <Preview file={previews[1]} />:<img src={plus} alt="cloud" className="photo-preview"/>
                                } 
                            </div>
                            <div className="photo-item">
                                {previews[2] ? 
                                  <Preview file={previews[2]} />:<img src={plus} alt="cloud" className="photo-preview"/>
                                } 
                            </div>
                            <div className="photo-item">
                                {previews[3] ? 
                                  <Preview file={previews[3]} />:<img src={plus} alt="cloud" className="photo-preview"/>
                                } 
                            </div>
                            <div className="photo-item">
                                {previews[4] ? 
                                  <Preview file={previews[4]} />:<img src={plus} alt="cloud" className="photo-preview"/>
                                } 
                            </div>

                        </div>
                    </div>
                    <div className="upload-form">
                        <form onSubmit={(event) => handleSubmit(event)}>
                            <input 
                                type="text" 
                                placeholder="Title" 
                                name="title" 
                                autoComplete="off"
                                value={formData.title}
                                onChange={(event) => handleInputChange(event)}
                            />
                            <textarea
                                name="description"
                                placeholder="Description"
                                value={formData.description}
                                onChange={(event)=>handleInputChange(event)}    
                            >
                            </textarea>
                            <div className="upload-button">
                                <button className="button-secondary" onClick={goBack}>Cancel</button>
                                <button className="button-primary">Post</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Upload;
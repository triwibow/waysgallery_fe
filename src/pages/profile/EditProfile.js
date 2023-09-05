import './profile.css';
import {Fragment, useEffect, useRef, useContext} from 'react';
import {useState} from 'react';
import { API } from '../../config/api';
import NavBar from '../../component/navbar/NavBar';
import {AppContext} from '../../context/AppContext';

import Dropzone from 'react-dropzone'
import cloudcomputing from '../../assets/icon/cloudcomputing.svg';
import plus from '../../assets/icon/plus.svg';
import Preview from '../../component/preview/Preview';

import camera from '../../assets/icon/camera.svg';
import ProgressBar from '../../component/modal/ProgressBar';
import SuccessSubmit from '../../component/modal/SuccessSubmit';
import ErrorSubmit from '../../component/modal/ErrorSubmit';

const EditProfile = () => {
    const reader = new FileReader();
    const [state, dispatch] = useContext(AppContext);
    
    const [progres, setProgres] = useState(0);
    const [loading, setLoading] = useState(false);
    const [previews, setPreviews] = useState([]);
    const [avatar, setAvatar] = useState('');
    const avatarFile = useRef();

    const [uploadComplete, setUploadComplete] = useState({
        status: false,
        message: ''
    });

    const [formData, setFormData] = useState({
        fullName: "",
        greeting: "",
    });

    const [fileData, setFileData] = useState({
        arts: [],
        avatar: []
    });

    const [error, setError] = useState({
        status: false,
        message: ''
    });

    

    const getUser = async () => {
        try {
            const response = await API.get('/user');

            if(response.data.status === "success"){
                setFormData({
                    fullName: response.data.data.user.fullName,
                    greeting: response.data.data.user.greeting
                });

                return;
            }
            
        } catch(err){
            console.log(err);
        }
    }

    const handleAvatarClick = () => {
        setError({
            ...error,
            status: false
        });

        avatarFile.current.click();
    }

    const handleAvatarChange = (event) => {
        if(event.target.files[0]){
            setFileData({
                ...fileData,
                avatar: [
                    event.target.files[0]
                ]
            });

            reader.readAsDataURL(event.target.files[0])
            reader.onloadend = () => {
                setAvatar(reader.result);
            }

           
        } else {
            
        }
        
    }


    const handleInputChange = (event) => {
        setError({
            status: false
        });

        setFormData({
            ...formData,
            [event.target.name] : event.target.value
        });
    }

    const uploadArt = async (files) => {
        const body = new FormData();

        if(files.length > 5){
            setError({
                status: true,
                message: 'Files cannot be more than 5'
            });

            return;
        }
        
        files.forEach((file) => {
            body.append('art', file);
        });

        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
            onUploadProgress: (event)=> {
                const {loaded, total} = event;
                let percent = Math.floor( (loaded * 100) / total )
                console.log( `${loaded}kb of ${total}kb | ${percent}%` );
                setProgres(percent);
            }
        };

        try {
            setLoading(true);
            const response = await API.post('/upload-art', body, config);

            if(response.data.status !== "success"){
                setLoading(false);
            }

            setError({
                status: false,
                message: ''
            })

            setUploadComplete({
                status: true,
                message: 'File successfully uploaded'
            });
            
            setLoading(false);

        } catch(err){
            console.log(error);
            setLoading(false);
        }
    }

    
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
        
        if(acceptedFiles.length > 1){
            if(previews.length === 0){
                uploadArt(acceptedFiles);

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
            uploadArt(acceptedFiles)
            setPreviews(
                [...previews, acceptedFiles[0]]
            );
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const body = new FormData();
        body.append('fullName', formData.fullName );
        body.append('greeting', formData.greeting);
       
        fileData.avatar.forEach((avatar) => {
            body.append('avatar', avatar);

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
            const response = await API.put('/user',body, config);
            if(response.data.status !== "success"){
                setUploadComplete({
                    status: false,
                    message: ''
                });
                
                setError({
                    status: true,
                    message: response.data.error.message
                });

                setLoading(false);
                return;
            }


            const user = await API.get('/auth');  

            if(response.data.status !== "success"){
                return dispatch({
                    type: "AUTH_ERROR"
                });
            }

            dispatch({
                type: "LOAD_USER",
                payload: user.data.data.user
            });

            setError({
                status: false,
                message: ""
            });

            setUploadComplete({
                status: true,
                message: "Your profile has been changed successfully"
            })

           
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

        setUploadComplete({
            status: false,
            message: ''
        });

        setPreviews([]);
    }

    useEffect(() => {
        getUser();
    },[]);

    useEffect(() => {
        if(progres == 100){
            setProgres(0)
        }
    },[progres])
    
    return(
        <Fragment>
            <NavBar />
            {loading && (<ProgressBar message={progres} />)}
            {uploadComplete.status && (<SuccessSubmit message={uploadComplete.message} closeModal={closeModal} />)}
            {error.status && (<ErrorSubmit message={error.message} closeModal={closeModal} />)}
            <div className="main-container">
                <div className="upload-container">
                    <div className="upload-photo">
                        <div className="upload-photo-primary">
                            <Dropzone onDrop={handleOnDrop} maxSize={3 * 1000 * 1000} accept="image/*">
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
                            <div className="upload-file" onClick={handleAvatarClick}>
                                <input 
                                    type="file" 
                                    ref={avatarFile} 
                                    name="avatar"
                                    onChange={handleAvatarChange}
                                />
                                {avatar ? 
                                    <img className="avatar-file" src={avatar} alt="icon"/>  
                                    :<img className="avatar-icon" src={camera} alt="icon"/>  
                                }  
                            </div>
                            <input 
                                type="text" 
                                placeholder="Greeting" 
                                name="greeting" 
                                autoComplete="off"
                                value={formData.greeting}
                                onChange={(event) => handleInputChange(event)}
                            />
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                autoComplete="off"
                                value={formData.fullName}
                                onChange={(event)=>handleInputChange(event)}    
                            />
                            <div className="upload-button">
                                <button className="button-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default EditProfile;
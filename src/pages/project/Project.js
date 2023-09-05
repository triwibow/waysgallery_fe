import './project.css';
import { useParams, useHistory } from 'react-router-dom';
import {Fragment, useEffect, useState} from 'react';
import NavBar from '../../component/navbar/NavBar';
import { API } from '../../config/api';
import SuccessSubmit from '../../component/modal/SuccessSubmit';
import ErrorSubmit from '../../component/modal/ErrorSubmit';

const Project = () => {
    const router = useHistory();
    const [loading, setLoading] = useState(false);
    const { transactionId } = useParams();
    const [project, setProject] = useState();
    const [error, setError] = useState(false);

    const [reject, setReject] = useState({
        status: false,
        message: ""
    });

    const [approve, setApprove] = useState({
        status: false,
        message: ""
    });

    const getProject = async () => {
        try {
            setLoading(true);
            const response = await API.get(`/project/${transactionId}`);

            if(response.data.status !== "success"){
                setLoading(false);
                setError(true);
                return;
            }

            const lastIndex = response.data.data.project.length - 1;

            setProject(response.data.data.project[lastIndex])
            setError(false);
            setLoading(false);

        } catch(err){
            console.log(err);
            setLoading(false);
        }
    }

    const responProject = async (status) => {
        try {
            const body = {
                status
            }
            const response = await API.put(`/transaction/${transactionId}`, body);

            if(response.data.status !== "success"){
                setError(true);
                return;
            }

            if(status ==="Rejected"){
                setReject({
                    status: true,
                    message: "You rejected this project"
                });

                setApprove({
                    status: false,
                    message:""
                });

                return;
            }

            if(status === "Project is Complete"){
                setApprove({
                    status: true,
                    message: "You approved this project"
                });

                setReject({
                    status: false,
                    message: ""
                });

                return;
            }
           

        } catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        getProject();
    },[]);

    const closeModal = () => {
        setApprove({
            status: false,
            message: ""
        });

        setReject({
            status: false,
            message: ""
        });

        router.goBack();
    }

  
    return (
        <Fragment>
            <NavBar />
            {reject.status && (<ErrorSubmit message={reject.message} closeModal={closeModal} />)}
            {approve.status && (<SuccessSubmit message={approve.message} closeModal={closeModal} />)}
            {error || !project ? (
                <h1>Server Error...</h1>
            ):loading ? (
                <h1>Loading....</h1>
            ):
            <div className="main-container">
                <div className="view-project-container">
                    <div className="left-project-item">
                        <div className="project-image-primary">
                            <img src={`http://localhost:5000/project/${project.photos[0].image}`} alt='primary' />
                        </div>

                        <div className="project-image-secondary">
                            {
                                project.photos.filter(photo => {
                                    return project.photos.indexOf(photo) !== 0
                                }).map(photo => {
                                    return <div className="image-secondary-item" key={photo.id}>
                                        <img src={`http://localhost:5000/project/${photo.image}`} alt='primary' />
                                    </div>
                                })
                            }
                        </div>
                    </div>

                    <div className="right-project-item">
                        <p className="view-project-description">{project.description}</p>
                        <div className="view-project-button">
                            <button className="view-button-cancel" onClick={() => responProject('Rejected')}>Reject</button>
                            <button className="view-button-approve" onClick={() => responProject('Project is Complete')}>Approve</button>
                        </div>
                    </div>
                </div>
            </div>}
        </Fragment>
    )

}

export default Project;
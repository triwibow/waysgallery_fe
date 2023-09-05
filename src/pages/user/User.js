import { Fragment, useState, useEffect } from 'react';
import './user.css';
import NavBar from '../../component/navbar/NavBar';
import { API } from '../../config/api';
import {useParams, Link, useHistory} from 'react-router-dom';
import detailtopright from '../../assets/icon/detailtopright.svg';
import nopost from '../../assets/icon/nopost.png';

const User = () => {
    const router = useHistory();
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const {id} = useParams();
    const [latestPostIndex, setLatestPostIndex] = useState(null);

    if(currentUser.id == id){
        router.push('/profile');
    }

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState();

    const getUser = async () => {
        try {
            setLoading(true);
            const response = await API.get(`/user/${id}`);

            if(response.data.status !== "success"){
                setError(true);
                setLoading(false);
                return;
            }

            setError(false);
            setLoading(false);
            setUser(response.data.data.user);
            setLatestPostIndex(response.data.data.user.posts.length - 1);
            
        } catch(err){
            console.log(err);
            setLoading(false);
        }
    }
    

    useEffect(() => {
        getUser();
    },[]);
    return(
        <Fragment>
            <NavBar />
            <div className="main-container">
                <img src={detailtopright} alt="detail" className="detail-top-right" />
                {error || !user ? (
                    <h1>Server Error</h1>
                ):loading ? (
                    <h1>Loading...</h1>
                ):(
                    <div className="profile-container">
                        <div className="profile-top">
                            <div className="profile-left-user">
                                <img src={`http://localhost:5000/avatar/${user.avatar}`} alt="avatar" className="profile-avatar" />
                                <span className="profile-fullname">{user.fullName}</span>
                                <h1 className="profile-greeting">{user.greeting}</h1>
                                <Link to="/edit-profile" className="link">
                                    <button className="button-secondary">Follow</button>
                                </Link>
                                <Link to={`/hired/${user.id}`} className="link">
                                    <button className="button-primary">Hire</button>
                                </Link>
                            </div>
                            <div className="profile-right-user">
                                {user.posts.length > 0 && latestPostIndex ? (
                                    <img src={`http://localhost:5000/photo/${user.posts[latestPostIndex].photos[0].image}`} alt="last post" />
                                ): (
                                    <div className="empty-post">
                                        <img src={nopost} alt="empty" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="profile-bottom">
                            <h4>{user.fullName} Works</h4>
                            <div className="profile-post-container">
                                {user.arts.length > 0 ? (
                                    user.arts.map(art => {
                                        return <div className="profile-post" key={art.id}>
                                                    <img
                                                        src={`http://localhost:5000/art/${art.image}`} 
                                                        alt="last post" 
                                                    />
                                                </div>
                                    })
                                ):(
                                    <div className="empty-arts">
                                        <p>{user.fullName} has no art</p>
                                    </div>
                                )  
                                }
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Fragment>
        
    );
}

export default User;
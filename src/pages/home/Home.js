import NavBar from '../../component/navbar/NavBar';
import FilterBar from '../../component/filterbar/FilterBar';
import { Fragment, useEffect, useState } from 'react';
import { API } from '../../config/api';
import Gallery from 'react-photo-gallery';
import {useHistory} from 'react-router-dom';

const Home = () => {
    const router = useHistory();
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [photos, setPhotos] = useState([]);

    const getPosts = async () => {
        try {
            setLoading(true);
            const response = await API.get('/posts');

            if(response.data.status !== "success"){
                setError(true);
                setLoading(false);
                return;
            }

            setPosts(response.data.data.posts);
            setError(false);
            setLoading(false);

            let data = [];

            for(let i = 0; i < response.data.data.posts.length; i++){
                data[i] =  {
                    src: `http://localhost:5000/photo/${response.data.data.posts[i].photos[0].image}`,
                    width: 1,
                    height: 1,
                    to: `/detail/${response.data.data.posts[i].id}`
                }
            }

            setPhotos(data)
            
        } catch(err){
            console.log(err);
        }
    }

    const handleClick = (event) => {
        const to = event.target.getAttribute('to');
        router.push(to);
    }

    useEffect(() => {
        getPosts();
    },[]);

    return(
        <Fragment>
            <NavBar />
            <FilterBar />
            <div className="main-container">
                {error ? (
                    <h1>Server Error</h1>
                ):loading ? (
                    <h1>Loading....</h1>
                ):photos.length > 0 ?(
                    <Gallery 
                        photos={photos} 
                        onClick={handleClick}
                    />
                ):null}
            </div>
        </Fragment>
        
    )
}

export default Home;
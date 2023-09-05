import { Link, useHistory } from 'react-router-dom';
import './navbar.css';
import logo from '../../assets/icon/logo.svg';
import { useState, useEffect} from 'react';
import Dropdown from '../dropdown/Dropdown';

const NavBar = () => {
    const [loading, setLoading] = useState(true);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const pathName = window.location.pathname;
    const [isDropdown, setDropdown] = useState(false);
    const router = useHistory();

    const handleDropdown = () => {
        isDropdown? setDropdown(false):setDropdown(true);
    }

    const getUser = () => {
        if(!currentUser){
            setLoading(true);
        } else {
            setLoading(false);
        }
    }

    useEffect(() => {
        getUser();
    },[currentUser])

    useEffect(() => {
        return router.listen(() => {
            setDropdown(false);
        })
    }, [router]);
    return(
        <div className="navbar-container">
            <div className="navbar-wrapper">
                <div className="navbar-logo">
                    <Link to="/" className="link">
                        <img src={logo} alt="logo" />
                    </Link>
                </div>
                <div className="navbar-menu">
                    <ul className="navbar-menu-list">
                        <Link to="/upload" className="link">
                            <li className="navbar-menu-item">
                                <button className="button-primary">Upload</button>
                            </li>
                        </Link>

                        <li className="navbar-menu-item">
                            <button className="navbar-menu-button" onClick={handleDropdown}>
                                {loading ? "":<img src={`http://localhost:5000/avatar/${currentUser.avatar}`} alt="add_video_icon"/>}
                            </button>
                            {isDropdown ? <Dropdown/>: ""}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default NavBar;
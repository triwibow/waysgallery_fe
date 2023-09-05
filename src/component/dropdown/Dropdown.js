import {Link} from 'react-router-dom';
import {useContext} from 'react';
import {AppContext} from '../../context/AppContext';

import './dropdown.css';
import user from '../../assets/icon/user.svg';
import logout from '../../assets/icon/logout.svg';
import order from '../../assets/icon/order.svg';

const Dropdown = () => {
    const [state, dispatch] = useContext(AppContext);

    const handleClick = () => {
        dispatch({
            type:"LOGOUT"
        })
    }

    return(
        <div className="dropdown-wrapper">
            <div className="polygon"></div>
            <ul className="dropdown-list">
                <li className="dropdown-item">
                    <Link to="/profile" className="dropdown-link link">
                        <img src={user} alt="user icon" />
                        <span>Profile</span>
                    </Link>
                </li>
                <li className="dropdown-item">
                    <Link to="/transactions" className="dropdown-link link">
                        <img src={order} alt="user icon" />
                        <span>Order</span>
                    </Link>
                </li>
                <li className="dropdown-item last-item">
                    <div className="dropdown-link" onClick={handleClick}>
                        <img src={logout} alt="logout icon" />
                        <span>Logout</span>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default Dropdown;
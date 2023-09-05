import { useState } from 'react';
import './landing.css';
import landing_image from '../../assets/images/landing_image.png';

import LoginModal from '../../component/modal/LoginModal';
import RegisterModal from '../../component/modal/RegisterModal';
import topleft from '../../assets/icon/topleft.svg';
import bottomleft from '../../assets/icon/bottomleft.svg';
import bottomright from '../../assets/icon/bottomright.svg';
import ways from '../../assets/icon/ways.svg';
import rectangle from '../../assets/icon/rectangle.svg';


const Landing = () => {
    const [modalLogin, setModalLogin] = useState(false);
    const [modalRegister, setModalRegister] = useState(false);

    const showModalRegister = () => {
        if(modalRegister){
            setModalRegister(false);
            setModalLogin(false);
            return;
        }
        setModalLogin(false);
        setModalRegister(true);
    }

    const showModalLogin = () => {
        if(modalLogin){
            setModalLogin(false);
            setModalRegister(false);
            return;
        }

        setModalRegister(false);
        setModalLogin(true);
    }

    const closeModal = () => {
        setModalLogin(false);
        setModalRegister(false);
    }



    return(
        <div className="landing-container">
            
            <img src={topleft} alt='topleft' className="top-left" />
            <img src={bottomleft} alt='topleft' className="bottom-left" />
            <img src={bottomright} alt='topleft' className="bottom-right" />
            {modalLogin ? <LoginModal closeModal={closeModal} switchModal={showModalRegister} />: null}
            {modalRegister ? <RegisterModal closeModal={closeModal} switchModal={showModalLogin} />: null}

            <div className="landing-info">
                <div className="landing-logo">
                    <img src={ways} alt="ways" />
                    <img src={rectangle} alt="rectagle"/>
                </div>
                <h1 className="landing-title">show your work to inspire everyone</h1>
                <p className="landing-quote">Ways Exhibition is a website design creators gather to share their work with other creators</p>
                <button className="button-primary" onClick={showModalRegister}>Join Now</button>
                <button className="button-secondary" onClick={showModalLogin}>Login</button>
            </div>

            <div className="landing-image">
                <img src={landing_image} alt="landing" />
            </div>
        </div> 
    )
}

export default Landing;
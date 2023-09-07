import './card.css';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config/keys';

const CardItem = (props) => {
    return(
        <div className="card-image">
            <Link to={`/detail/${props.post.id}`} className="link">
                <img src={`${API_URL}/photo/${props.post.photos[0].image}`} alt="post" />
            </Link>
        </div>
    );
}

export default CardItem;
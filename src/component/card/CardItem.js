import './card.css';
import { Link } from 'react-router-dom';

const CardItem = (props) => {
    return(
        <div className="card-image">
            <Link to={`/detail/${props.post.id}`} className="link">
                <img src={`http://localhost:5000/photo/${props.post.photos[0].image}`} alt="post" />
            </Link>
        </div>
    );
}

export default CardItem;
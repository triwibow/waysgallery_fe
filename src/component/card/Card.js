import './card.css';
import CardItem from './CardItem';

const Card = (props) => {
    return(
        <div className="card">
            {props.posts.map(post => {
                return <CardItem key={post.id} post={post} />
            })}
        </div>
    );
}

export default Card;
import './filterbar.css';
import search from '../../assets/icon/search.svg';
const FilterBar = () => {
    return(
        <div className="filterbar-container">
            <div className="filterbar-wrapper">
                <div className="filterbar-select">
                    <select>
                        <option>Today</option>
                    </select>
                    <span>today's post</span>
                </div>
                <div className="filterbar-search">
                    <div className="search-input">
                        <img src={search} alt="search" className="filter-search-icon" />
                        <input type="text" placeholder="Search" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FilterBar;
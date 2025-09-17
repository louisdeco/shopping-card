import { useParams, useSearchParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import styles from '../styles/components/Navigation.module.css'
import { Search } from 'lucide-react'

function Navigation() {
    const { category } = useParams();
    const { data } = useFetch('PRODUCTS');

    const [searchParams, setSearchParams] = useSearchParams();

    const types = [... new Set(data?.data.filter(item => item.category === category).map(item => item.type))] || [];

    const selectedType = searchParams.get('type');

    function handleTypeSelect(type) {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('type', type);
            return newParams
        });
    }

    function handleSearch(e) {
        const searchValue = e.target.value;

        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);

            if(searchValue.trim()) {
                newParams.set('search', searchValue);
            } else {
                newParams.delete('search')
            }
            return newParams;
        })
    }

    return (
        <nav className={styles.navigation}>
            {
                types && 
                types.map(type => {
                    return <button onClick={() => handleTypeSelect(type)} className={`${styles.filterButton} ${selectedType === type ? styles.activeFilterButton : '' }`}  key={type}>{type}</button>
                })
            }
            <div className={styles.searchContainer}>
                <Search></Search>
                <input type="text" placeholder='What are you looking for?' onChange={handleSearch}/>
            </div>
        </nav>
    )
}

export default Navigation;


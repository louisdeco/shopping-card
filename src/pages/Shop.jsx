import { useParams, useSearchParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import styles from '../styles/pages/Shop.module.css';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';


function Shop() {
    const { category } = useParams();
    const { data, error, loading } = useFetch('PRODUCTS');

    const [searchParams, setSearchParams] = useSearchParams();

    const selectedType = searchParams.get('type');
    const searchParameters = searchParams.get('search');

    const filteredData = data?.data.filter(item => (item.category === category && (!selectedType || item.type === selectedType)) && (!searchParameters || item.title.toLowerCase().includes(searchParameters.toLowerCase())));
    
    if (loading) {
        return (
            <Loader />
        )
    }

    return (
            <div className={styles.articleGrid}>
                {
                    filteredData &&
                    filteredData.map(item => {
                        return <ProductCard
                            key={item._id}
                            title={item.title}
                            price={item.price}
                            image={item.image}
                            brand={item.brand}
                            id={item._id}
                        />
                    })
                }
            </div>
    )
}

export default Shop;
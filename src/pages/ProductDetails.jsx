import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import styles from '../styles/pages/ProductDetails.module.css';
import Loader from '../components/Loader';
import { Heart } from 'lucide-react';
import { useCartDispatch } from '../contexts/CartContext';


function ProductDetails() {
    const { id } = useParams();
    const { data, error, loading } = useFetch('PRODUCTS', id);
    
    const [selectedSize, setSelectedSize] = useState('');
    const dispatch = useCartDispatch();

    const addToCart = () => {
        dispatch({
            type: 'added',
            id: id,
            size: selectedSize,
            quantity: 1
        })
    }

    if (loading) {
        return (
            <Loader />
        )
    }

    const item = data;
    const availableSize = item.size;

    return (
        <div className={styles.productDetails}>
            <img className={styles.productImage} src={data.image} alt="Product picture" />
            <div className={styles.productInfo}>
                <div className={styles.brandWrapper}>
                    <p className={styles.productBrand}>{data.brand}</p>
                    <p className={styles.productTitle}>{data.title}</p>
                </div>
                <p className={styles.productPrice}>${data.price}</p>
                <div className={styles.userInteractions}>
                    <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} id="size-select" className={styles.sizeDropdown} aria-label="Select size" required>
                        <option value="" disabled> Select a size</option>
                        {
                            availableSize &&
                            availableSize.map(size => {
                                return <option key={size} value={size}>{size}</option>
                            })
                        }
                    </select>
                    <div className={styles.interactionButtons}>
                        <button className={styles.addButton} onClick={addToCart} disabled={!selectedSize} style={{opacity: selectedSize ? 1 : 0.5, cursor: selectedSize ? 'pointer' : 'not-allowed'}}>Add To Bag</button>
                        <button className={styles.wishlistButton}>Wishlist
                            <Heart size={20} className={styles.wishlistHeart} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetails;
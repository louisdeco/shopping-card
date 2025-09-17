import styles from '../styles/components/ProductCard.module.css';
import { Link } from 'react-router-dom';

function ProductCard({ title, price, image, brand }) {
    return (
        <Link className={styles.productCard}>
            <img className={styles.productImage} src={image} alt="Picture of the product" />
            <div className={styles.productInformation}>
                <p className={styles.productBrand}>{brand}</p>
                <p className={styles.productTitle}>{title}</p>
            </div>
            <p className={styles.productPrice}>${price}</p>
        </Link>
    )
}

export default ProductCard;
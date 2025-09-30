import styles from '../styles/components/CartItem.module.css'
import { Trash } from 'lucide-react';
import { useCartDispatch } from '../contexts/CartContext';

function CartItem({ image, brand, price, quantity, sizeSelected, title, type, id }) {
    const dispatch = useCartDispatch();

    const deleteFromCart = () => {
        dispatch({
            type: 'delete',
            id: id,
            size: sizeSelected
        })
    }
    return (
        <div className={styles.cartItem}>
            <img className={styles.productImage} src={image} alt="" />
            <div className={styles.productInfo}>
                <p className={styles.productType}>{type}</p>
                <div className={styles.brandTitle}>
                    <p className={styles.brand}>{brand}</p>
                    <p className={styles.title}>{title}</p>
                </div>
            </div>
            <div className={styles.pricing}>
                <p className={styles.price}>${price}</p>
                <p className={styles.taxInfo}>VAT included</p>
            </div>
            <div className={styles.sizeInfo}>
                <p className={styles.sizeLabel}>Size</p>
                <p>{sizeSelected}</p>
            </div>
            <div className={styles.quantityInfo}>
                <p className={styles.quantityLabel}>Quantity</p>
                <p>{quantity}</p>
            </div>
            <button className={styles.deleteButton} onClick={deleteFromCart}>
                <Trash size={20}/>
            </button>
        </div>
    )
}

export default CartItem;
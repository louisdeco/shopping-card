import styles from '../styles/pages/Cart.module.css';
import useFetch from '../hooks/useFetch';
import Loader from '../components/Loader';
import CartItem from '../components/CartItem';
import { useCart } from '../contexts/CartContext';

function Cart() {
    const cart = useCart();
    const { data, error, loading } = useFetch('PRODUCTS');

    if (loading) {
        return (
            <Loader />
        )
    }

    const cartWithProducts = cart.map(cartItem => {
        const product = data?.data.find(item => String(item._id) === String(cartItem.id));
        return {
            ...product,
            sizeSelected: cartItem.size,
            quantity: cartItem.quantity
        }
    })

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return (
        <div className={styles.cart}>
            <h1 className={styles.pageTitle}>
                Shopping Bag
            </h1>
            {
                cart.length === 0 && <h1 className={styles.emptyMessage}>Your shopping bag is empty!</h1>
            }
            {
                cart.length > 0 &&
                    <div className={styles.cartInfo}>
                    <div className={styles.cartItems}>
                        {cartWithProducts &&
                            cartWithProducts.map(item => {
                                return <CartItem key={item._id} image={item.image} brand={item.brand} price={item.price} quantity={item.quantity} sizeSelected={item.sizeSelected} title={item.title} type={item.type} id={String(item._id)} />
                            })
                        }
                    </div>
                    <div className={styles.summary}>
                        <h2 className={styles.title}>Summary</h2>
                        <div className={styles.summaryInfo}>
                            <div className={`${styles.lineItem} ${styles.subTotalInfo}`}>
                                <p className={styles.Label}>Subtotal</p>
                                <p className={styles.subTotal}>${total}</p>
                            </div>
                            <div className={`${styles.lineItem} ${styles.deliveryInfo}`}>
                                <p className={styles.Label}>Delivery</p>
                                <p className={styles.delivery}>$0</p>
                            </div>
                        </div>
                        <div className={`${styles.lineItem} ${styles.totalInfo}`}>
                            <p className={styles.Label}>Total</p>
                            <p className={styles.total}>${total}</p>
                        </div>
                        <button className={styles.checkoutButton}>Go To Checkout</button>
                    </div>
                </div>
            }
            
        </div>
    )
}

export default Cart;
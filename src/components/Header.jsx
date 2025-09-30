import Flag from 'react-world-flags';
import { NavLink, Link } from 'react-router-dom';
import styles from '../styles/components/Header.module.css';
import { CircleUser, Heart, ShoppingBasket } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

function Header() {
    const cart = useCart();
    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className={styles.header}>
            <nav className={styles.navigation}>
                <NavLink className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`} to="/shopping/women">Womenswear</NavLink>
                <NavLink className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`} to="/shopping/men">Menswear</NavLink>
                <NavLink className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`} to="/shopping/kids">Kidswear</NavLink>
            </nav>
            <Link className={styles.logoLink}>
                <h1 className={styles.logo}>FAKEFETCH</h1>
            </Link>
            <div className={styles.userActions}>
                <button className={styles.languageButton} aria-label="Select language">
                    <Flag className={styles.flag} code="FR" />
                </button>
                <button className={styles.accountButtonButton} aria-label="accountButton menu">
                    <CircleUser size={20}></CircleUser>
                </button>
                <Link className={styles.actionLink} aria-label="Favorites">
                    <Heart size={20}></Heart>
                </Link>
                <Link to="/cart" className={`${styles.actionLink} ${styles.cartLink}`} aria-label="Shopping cart">
                    <ShoppingBasket size={20}></ShoppingBasket>
                    {cartItemCount > 0 && (
                        <span className={styles.cartBadge}>{cartItemCount}</span>
                    )}
                </Link>
            </div>
        </header>
    )
}

export default Header;
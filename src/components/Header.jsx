import Flag from 'react-world-flags';
import { Link } from 'react-router-dom';
import styles from '../styles/components/Header.module.css';
import { CircleUser, Heart, ShoppingBasket } from 'lucide-react';

function Header() {
    return (
        <header className={styles.header}>
            <nav className={styles.navigation}>
                <Link className={styles.navLink} to="/shopping/women">Womenswear</Link>
                <Link className={styles.navLink} to="/shopping/men">Menswear</Link>
                <Link className={styles.navLink} to="/shopping/kids">Kidswear</Link>
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
                <Link className={styles.actionLink} aria-label="Shopping cart">
                    <ShoppingBasket size={20}></ShoppingBasket>
                </Link>
            </div>
        </header>
    )
}

export default Header;
import { Outlet, useLocation } from 'react-router-dom';
import styles from '../styles/components/Layout.module.css';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { CartProvider } from '../contexts/CartContext';

function Layout() {
    const location = useLocation();
    const showNavigation = location.pathname.startsWith('/shopping');
    return (
        <CartProvider>
            <div className={styles.layout}>
                <Header />
                { showNavigation && <Navigation /> }
                <main>
                    <Outlet />
                </main>
            </div>
        </CartProvider>
    )
}

export default Layout;
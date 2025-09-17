import { Outlet, useLocation } from 'react-router-dom';
import styles from '../styles/components/Layout.module.css';
import Header from '../components/Header';
import Navigation from '../components/Navigation';

function Layout() {
    const location = useLocation();
    const showNavigation = location.pathname.startsWith('/shopping');
    return (
        <div className={styles.layout}>
            <Header />
            { showNavigation && <Navigation /> }
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default Layout;
import { Outlet } from 'react-router-dom';
import styles from '../styles/components/Layout.module.css';
import Header from '../components/Header';
import Navigation from '../components/Navigation';

function Layout() {
    return (
        <div className={styles.layout}>
            <Header />
            <Navigation />
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default Layout;
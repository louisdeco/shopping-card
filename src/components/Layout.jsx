import { Outlet } from 'react-router-dom';
import styles from '../styles/components/Layout.module.css';
import Header from '../components/Header';

function Layout() {
    return (
        <div className={styles.layout}>
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default Layout;
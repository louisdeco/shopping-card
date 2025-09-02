import styles from '../styles/pages/NotFound.module.css';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className={styles.notFound}>
            <h1>404 - Page Not Found</h1>
            <h2>Sorry, this page does not exist</h2>
            <p>This may be because the link has expired or the website is experiencing few issues behind the scenes</p>
            <Link to="/">← Back to home</Link>
        </div>
    )
}

export default NotFound;
import { useRouteError } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from '../styles/pages/ErrorPage.module.css';

function ErrorPage() {
    const error = useRouteError();

    return (
        <div className={styles.errorPage}>
        <h1>Oops! Something went wrong</h1>
        <p>We are experiencing technical difficulties.</p>
        <details>
            <summary>Error details</summary>
            <pre>{error?.message || 'Unknown error'}</pre>
        </details>
        <Link to="/">← Back to Home</Link>
        </div>
    )
}
export default ErrorPage;
import { LoaderCircle } from 'lucide-react';
import styles from '../styles/components/Loader.module.css';

function Loader() {
    return (
        <div className={styles.loader}>
            <LoaderCircle className={styles.spinner} size={80} />
        </div>
    )
}

export default Loader;
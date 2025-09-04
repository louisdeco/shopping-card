import styles from '../styles/pages/Home.module.css';
import { Link } from 'react-router-dom';
import menswearImg from '../assets/menswear.avif';
import womenswearImg from '../assets/womenswear.jpeg';
import kidswearImg from '../assets/kidswear.jpg';
import { ShoppingCart, CircleQuestionMark, MessageSquare } from 'lucide-react';

function Home() {
    return (
        <div className={styles.home}>
            <p className={styles.sectionTitle}>Chose a department</p>
            <div className={styles.categoriesContainer}>
                <Link to="/shopping/women" className={styles.categoryLink}>
                    <img className={styles.categoryImage} src={womenswearImg} alt="Womenswear collection" />
                    <span className={styles.categoryTitle}>WOMENSWEAR</span>
                </Link>
                <Link to="/shopping/men" className={styles.categoryLink}>
                    <img src={menswearImg} alt="Menswear collection" className={styles.categoryImage} />
                    <span className={styles.categoryTitle}>MENSWEAR</span>
                </Link>
                <Link to="/shopping/kids" className={styles.categoryLink}>
                    <img src={kidswearImg} alt="Kidswear collection" className={styles.categoryImage} />
                    <span className={styles.categoryTitle}>KIDSWEAR</span>
                </Link>
            </div>
            <div className={styles.helpContainer}>
                <Link to="/" className={styles.helpLink}>
                    <ShoppingCart></ShoppingCart>
                    <span className={styles.helpTitle}>HOW TO SHOP</span>
                    <span className={styles.helpDescription}>Your guide to shopping and placing orders</span>
                </Link>
                <Link to="/" className={styles.helpLink}>
                    <CircleQuestionMark></CircleQuestionMark>
                    <span className={styles.helpTitle}>FAQS</span>
                    <span className={styles.helpDescription}>Your questions answered</span>
                </Link>
                <Link to="/" className={styles.helpLink}>
                    <MessageSquare></MessageSquare>
                    <span className={styles.helpTitle}>NEED HELP?</span>
                    <span className={styles.helpDescription}>Contact our global Customer Service team</span>
                </Link>
            </div>
        </div>
    )
}

export default Home;
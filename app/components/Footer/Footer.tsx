import React from 'react';
import styles from './Footer.module.css';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <a href="/about" className={styles.link}>关于我们</a>
          <a href="/contact" className={styles.link}>联系我们</a>
          <a href="/privacy" className={styles.link}>隐私政策</a>
          <a href="/terms" className={styles.link}>使用条款</a>
        </nav>
        <div className={styles.socialIcons}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
            <FaFacebook />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
            <FaInstagram />
          </a>
        </div>
        <p className={styles.copyright}>© {new Date().getFullYear()} 资源桶. 保留所有权利.</p>
      </div>
    </footer>
  );
};

export default Footer;

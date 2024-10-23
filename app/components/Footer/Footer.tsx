import React from 'react';
import styles from './Footer.module.css';
import { FaFacebook, FaTwitter, FaInstagram, FaWeixin, FaPaperPlane, FaQq } from 'react-icons/fa';

interface SocialInfo {
  icon: React.ElementType;
  link: string;
  qrCode?: string;
  info?: string;
}

const socialInfos: SocialInfo[] = [
  { icon: FaFacebook, link: 'https://facebook.com', info: 'Facebook: 资源桶' },
  { icon: FaTwitter, link: 'https://twitter.com', info: 'Twitter: @resourcebucket' },
  { icon: FaInstagram, link: 'https://instagram.com', info: 'Instagram: @resourcebucket' },
  { icon: FaWeixin, link: 'https://weixin.qq.com', qrCode: 'https://img.4040000.xyz/file/4a858c5f6ddac6fb26b0b-f43d37bc2b71c1e230.png', info: '微信: 资源桶' },
  { icon: FaPaperPlane, link: 'https://t.me/resourcebucket', info: 'Telegram: @resourcebucket' },
  { icon: FaQq, link: 'https://im.qq.com', info: 'QQ群: 6200052' },
];

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.socialIcons}>
          {socialInfos.map((info, index) => (
            <div key={index} className={styles.socialIconWrapper}>
              <a href={info.link} target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                <info.icon />
              </a>
              <a href={info.qrCode} target="_blank" rel="noopener noreferrer" className={styles.infoCard}>
                <h3 className={styles.infoCardTitle}>{info.info}</h3>
                <img className={styles.qrCode} src={info.qrCode} alt="QR Code" />
              </a>
            </div>
          ))}
        </div>
        <p className={styles.copyright}>© {new Date().getFullYear()} 资源桶. 保留所有权利.</p>
      </div>
    </footer>
  );
};

export default Footer;

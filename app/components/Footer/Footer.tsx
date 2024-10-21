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
  { icon: FaWeixin, link: 'https://weixin.qq.com', qrCode: '/images/wechat-qr.png', info: '微信: 资源桶' },
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
              <div className={styles.infoCard}>
                {info.qrCode ? (
                  <>
                    <img src={info.qrCode} alt="QR Code" className={styles.qrCode} />
                    <p>{info.info}</p>
                  </>
                ) : (
                  <p>{info.info}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className={styles.copyright}>© {new Date().getFullYear()} 资源桶. 保留所有权利.</p>
      </div>
    </footer>
  );
};

export default Footer;

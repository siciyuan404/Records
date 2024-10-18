import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store/store';
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryData {
  icon: string;
  link: string;
  items?: Record<string, CategoryData>;
}

interface CategoryMenuProps {
  categories: Record<string, CategoryData>;
  depth?: number;
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({ categories, depth = 0 }) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <ul className={`${styles.categoryList} ${depth === 0 ? styles.topLevelMenu : styles.subMenu}`}>
      {Object.entries(categories).map(([key, value]) => (
        <li
          key={key}
          className={styles.categoryItem}
          onMouseEnter={() => setHoveredCategory(key)}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <Link href={`/category/${value.link.replace(/\//g, '')}`} className={styles.categoryLink}>
            <span style={{ fontWeight: value.items ? 'bold' : 'normal' }}>{key}</span>
          </Link>
          {value.items && hoveredCategory === key && (
            <CategoryMenu categories={value.items} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  );
};

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: categories, status, error } = useSelector((state: RootState) => state.categories);
  const [logoText, setLogoText] = useState('');
  const fullLogoText = '资源桶';


  // 这里处理fullLogoText是为了实现一个打字机效果的动画
  // 当组件加载时，"资源桶"这三个字会逐个显示出来，给用户一种动态的感觉
  // 这种效果可以吸引用户的注意力，并为网站增添一些视觉趣味性
  // 具体实现方法是:
  // 1. 使用useState hook来管理logoText状态
  // 2. 使用useEffect hook在组件挂载后启动一个定时器
  // 3. 定时器每200毫秒添加一个字符到logoText中
  // 4. 当所有字符都添加完毕后，清除定时器
  // 5. 组件卸载时也会清除定时器，防止内存泄漏
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullLogoText.length) {
        setLogoText(fullLogoText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 200);

    return () => {
      clearInterval(timer);
      setLogoText(fullLogoText); // 确保在组件卸载时显示完整文本
    };
  }, []);

  // 如果logoText为空，显示完整文本
  const displayLogoText = logoText || fullLogoText;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={`${styles.logo} ${styles.enhancedLogo}`}>
          <span className={styles.logoText}>{displayLogoText}</span>
        </Link>
        <nav className={styles.nav}>
          {status === 'loading' ? (
            <div className={styles.skeletonContainer}>
              <Skeleton className="h-10 w-[100px]" />
              <Skeleton className="h-10 w-[100px]" />
            </div>
          ) : status === 'failed' ? (
            <div className={styles.errorMessage}>错误: {error}</div>
          ) : (
            <>
              <div
                className={`${styles.menuContainer} ${styles.hideOnMobile}`}
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => setIsMenuOpen(false)}
              >
                <button className={`${styles.menuButton} ${styles.enhancedMenuButton}`}>
                  <span className={styles.menuText}>分类</span>
                  <svg className={styles.arrowDown} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M562.5 771c-14.3 14.3-33.7 27.5-52 23.5-18.4 3.1-35.7-11.2-50-23.5L18.8 327.3c-22.4-22.4-22.4-59.2 0-81.6s59.2-22.4 81.6 0L511.5 668l412.1-422.3c22.4-22.4 59.2-22.4 81.6 0s22.4 59.2 0 81.6L562.5 771z" />
                  </svg>
                </button>
                {isMenuOpen && <CategoryMenu categories={categories} />}
              </div>
              <Link href="https://chatbot.weixin.qq.com/webapp/zR6XpGC9NjMrGjpuuboUQACIxqCwLZ?robotName=%E8%B5%84%E6%BA%90%E6%90%9C%E7%B4%A2%E6%9C%BA%E5%99%A8%E4%BA%BA" className={`${styles.menuButton} ${styles.enhancedMenuButton}`}>
                <span className={styles.menuText}>资源求助</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>

  );
};

export default Header;
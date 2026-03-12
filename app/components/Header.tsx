'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import { useGetCategoriesQuery } from '@/app/store/api/categoriesApi';
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { CategoryData } from '@/app/types';

interface CategoryMenuProps {
  categories: Record<string, CategoryData>;
  depth?: number;
}

const CategoryMenu: React.FC<CategoryMenuProps> = memo(({ categories, depth = 0 }) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <ul
      className={`${styles.categoryList} ${depth === 0 ? styles.topLevelMenu : styles.subMenu}`}
      role={depth === 0 ? 'menu' : 'group'}
      aria-label={depth === 0 ? '分类菜单' : undefined}
    >
      {Object.entries(categories).map(([key, value]) => (
        <li
          key={key}
          className={styles.categoryItem}
          onMouseEnter={() => setHoveredCategory(key)}
          onMouseLeave={() => setHoveredCategory(null)}
          role="none"
        >
          <Link
            href={`/category/${value.link.replace(/\//g, '')}`}
            className={styles.categoryLink}
            role="menuitem"
            aria-label={`查看${key}分类`}
          >
            <span style={{ fontWeight: value.items ? 'bold' : 'normal' }}>{key}</span>
          </Link>
          {value.items && hoveredCategory === key && (
            <CategoryMenu categories={value.items} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  );
});

CategoryMenu.displayName = 'CategoryMenu';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: categories, isLoading, isError, error } = useGetCategoriesQuery();
  const [logoText, setLogoText] = useState('');
  const fullLogoText = '四次元资源桶';

  // 直接从 Redux store 中获取数据
  const categoriesFromStore = useSelector((state: RootState) => state.categoriesApi.queries['getCategories(undefined)']?.data);

  // 添加窗口宽度监听，使用防抖
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth <= 768);
      }, 150);
    };

    // 初始化检查
    setIsMobile(window.innerWidth <= 768);

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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

  useEffect(() => {
  }, [categories, categoriesFromStore, isLoading, isError, error]);

  // 修改资源机器人按钮的渲染逻辑
  const renderResourceBotButton = () => (
    <Link
      href="https://chatbot.weixin.qq.com/webapp/zR6XpGC9NjMrGjpuuboUQACIxqCwLZ?robotName=%E8%B5%84%E6%BA%90%E6%90%9C%E7%B4%A2%E6%9C%BA%E5%99%A8%E4%BA%BA"
      className={`${styles.menuButton} ${styles.enhancedMenuButton}`}
      aria-label="打开资源搜索机器人"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className={styles.menuText}>
        {isMobile ? '机器人' : '资源机器人'}
      </span>
    </Link>
  );

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={`${styles.logo} ${styles.enhancedLogo}`} aria-label="四次元资源桶首页">
          <span className={styles.logoText}>{displayLogoText}</span>
        </Link>
        <nav className={styles.nav}>
          {isLoading ? (
            <div className={styles.skeletonContainer}>
              <Skeleton className="h-10 w-[100px]" />
              {!isMobile && <Skeleton className="h-10 w-[100px]" />}
            </div>
          ) : isError ? (
            <div className={styles.errorMessage}>
              {error && 'status' in error && (
                <span> (状态码: {error.status})</span>
              )}
            </div>
          ) : categories && Object.keys(categories).length > 0 ? (
            <>
              <div
                className={`${styles.menuContainer} ${styles.hideOnMobile}`}
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => setIsMenuOpen(false)}
              >
                <button
                  className={`${styles.menuButton} ${styles.enhancedMenuButton}`}
                  aria-label="打开分类菜单"
                  aria-expanded={isMenuOpen}
                  aria-haspopup="true"
                >
                  <span className={styles.menuText}>分类</span>
                  <svg className={styles.arrowDown} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M562.5 771c-14.3 14.3-33.7 27.5-52 23.5-18.4 3.1-35.7-11.2-50-23.5L18.8 327.3c-22.4-22.4-22.4-59.2 0-81.6s59.2-22.4 81.6 0L511.5 668l412.1-422.3c22.4-22.4 59.2-22.4 81.6 0s22.4 59.2 0 81.6L562.5 771z" />
                  </svg>
                </button>
                {isMenuOpen && (
                  <div className={styles.menuDropdown}>
                    <CategoryMenu categories={categories as Record<string, CategoryData>} />
                  </div>
                )}
              </div>
              {renderResourceBotButton()}
            </>
          ) : (
            <div className={styles.errorMessage}>没有可用的分类数据</div>
          )}
        </nav> 
      </div>
    </header>
  );
};

export default memo(Header);

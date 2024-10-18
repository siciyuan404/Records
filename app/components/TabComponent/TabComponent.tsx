import React, { useState, useEffect, useRef } from 'react';
import styles from './TabComponent.module.css';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store/store';
import { Skeleton } from "@/components/ui/skeleton";

interface Tab {
  name: string;
  link: string;
}


export default function TabComponent() {
  const [isExceed, setIsExceed] = useState(false); // 修改初始状态为 false
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false); // 添加状态来控制“更多”按钮的显示
  const headerRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLDivElement>(null);
  const moreModalRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { data: categories, status, error } = useSelector((state: RootState) => state.categories);
  const [tabs, setTabs] = useState<Tab[]>([]);

  // 渲染骨架屏的函数
  const renderSkeletons = () => {
    return Array(10).fill(0).map((_, index) => (
      <Skeleton key={index} className={`${styles.tabItem} ${styles.skeletonTab}`} />
    ));
  };

  useEffect(() => {
    setIsExceed(window.innerWidth < 768); // 在 useEffect 中设置 isExceed
    setShowMoreButton(window.innerWidth >= 768); // 根据屏幕宽度设置 showMoreButton
    if (status === 'succeeded' && categories) {
      const extractCategories = (obj: any): Tab[] => {
        let extractedCategories: Tab[] = [];
        for (let key in obj) {
          if (obj[key] && typeof obj[key] === 'object') {
            if (obj[key].items) {
              extractedCategories = [...extractedCategories, ...extractCategories(obj[key].items)];
            } else {
              extractedCategories.push({ name: key, link: obj[key].link });
            }
          }
        }
        return extractedCategories;
      };

      const allCategories = extractCategories(categories);
      setTabs(allCategories);
    }

    const handleScroll = () => {
      if (headerRef.current) {
        const headerBottom = headerRef.current.getBoundingClientRect().bottom;
        setIsExceed(headerBottom <= 50);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (moreModalRef.current && !moreModalRef.current.contains(event.target as Node) &&
          moreButtonRef.current && !moreButtonRef.current.contains(event.target as Node)) {
        setShowMoreModal(false);
      }
    };

    const handleResize = () => {
      setIsExceed(window.innerWidth < 768 || (headerRef.current?.getBoundingClientRect().bottom || 0) <= 50);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dispatch, categories, status]);

  const toggleMoreModal = () => {
    setShowMoreModal(!showMoreModal);
  };

  if (status === 'loading') {
    return (
      <div className={styles.tabContainer} ref={headerRef}>
        <div className={styles.tabList}>
          {renderSkeletons()}
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return <div>错误: {error}</div>;
  }

  return (
    <div className={styles.tabContainer} ref={headerRef}>
      {!isExceed && (
        <div className={styles.tabList}>
          {tabs.slice(0, showMoreButton ? 23 : tabs.length).map((tab, index) => ( // 根据 showMoreButton 控制显示数量
            <Link href={`/category/${tab.link}`} className={styles.tabItem} key={index}>{tab.name}</Link>
          ))}
          {showMoreButton && ( // 仅在大屏幕上显示“更多”按钮
            <div className={styles.tabItem} onClick={toggleMoreModal} ref={moreButtonRef}>
              更多
            </div>
          )}
          {showMoreModal && (
            <div className={styles.moreModal} ref={moreModalRef} style={{
              top: moreButtonRef.current ? `${moreButtonRef.current.offsetHeight + 135}px` : '100%',
              left: moreButtonRef.current ? `${moreButtonRef.current.offsetLeft}px` : '0'
            }}>
              {tabs.slice(19).map((tab, index) => (
                <Link href={`/category/${tab.link}`} className={styles.tabItem} key={index + 23}>{tab.name}</Link>
              ))}
            </div>
          )}
        </div>
      )}

      {isExceed && (
        <div className={`${styles.exceedList} ${styles.fadeIn}`}>
          {tabs.map((tab, index) => (
            <Link href={`/category/${tab.link}`} className={styles.exceedListItem} key={index}>{tab.name}</Link>
          ))}
        </div>
      )}
    </div>
  );
}

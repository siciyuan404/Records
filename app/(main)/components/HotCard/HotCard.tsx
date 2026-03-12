import React, { memo } from 'react';
import styles from './HotCard.module.css';
import Link from 'next/link';
import { useGetListItemsQuery } from '@/app/store/api/listApi';
import { usePagination } from '@/hooks/usePagination';

interface HotItem {
    uuid: string;
    name: string;
    introduction: string;
    images: string[];
    rating: number;
    category: string;
}

interface HotCardProps {
    title: string;
}

const Skeleton: React.FC = () => {
    return (
        <ul className={styles.list}>
            {[...Array(8)].map((_, index) => (
                <li key={index} className={`${styles.item} ${styles.skeleton}`}>
                    <div className={styles.skeletonTitle}></div>
                    <div className={styles.skeletonDetails}>
                        <div className={styles.skeletonDescription}></div>
                        <div className={styles.skeletonRating}></div>
                        <div className={styles.skeletonCategory}></div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

const HotCard: React.FC<HotCardProps> = ({ title }) => {
    const { data, isLoading, isError } = useGetListItemsQuery();
    const hot: HotItem[] = data?.hot || [];
    const itemsPerPage = 8;

    const { currentPage, pageCount, nextPage, prevPage, goToPage, startIndex, endIndex } = usePagination({
        totalItems: hot.length,
        itemsPerPage,
    });

    if (isLoading) {
        return (
            <div className={styles.hotCard}>
                <h2 className={styles.title}>{title}</h2>
                <Skeleton />
            </div>
        );
    }

    if (isError) {
        return <div className={styles.hotCard}>加载失败，请重试</div>;
    }

    // 键盘导航支持
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
            prevPage();
        } else if (e.key === 'ArrowRight') {
            nextPage();
        }
    };

    const currentItems = hot.slice(startIndex, endIndex);

    return (
        <div
            className={styles.hotCard}
            role="region"
            aria-label={`${title} 热门资源列表`}
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            <h2 className={styles.title}>{title}</h2>
            <ul className={styles.list} role="list">
                {currentItems.map((item, index) => (
                    <li key={item.uuid} className={styles.item}>
                        <Link
                            href={`/resource/${item.uuid}`}
                            className={styles.link}
                            aria-label={`查看 ${item.name} 的详细信息`}
                        >
                            <span className={styles.itemTitle}>{item.name}</span>
                            <div
                                className={styles.itemDetails}
                                style={{backgroundImage: `url(${item.images[0]}?${index + startIndex})`}}
                                aria-hidden="true"
                            >
                                <div className={styles.itemInfo}>
                                    <p className={styles.itemDescription}>{item.introduction}</p>
                                    <p className={styles.itemRating}>评分: {item.rating}</p>
                                    <p className={styles.itemCategory}>类别: {item.category}</p>
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
            <div className={styles.navigationWrapper}>
                <button
                    onClick={prevPage}
                    className={`${styles.navButton} ${styles.prevButton}`}
                    aria-label="上一页"
                >
                    &#9664;
                </button>
                <button
                    onClick={nextPage}
                    className={`${styles.navButton} ${styles.nextButton}`}
                    aria-label="下一页"
                >
                    &#9654;
                </button>
            </div>
            <div className={styles.pageIndicator} role="group" aria-label="页面指示器">
                {[...Array(pageCount)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToPage(index)}
                        className={`${styles.dot} ${index === currentPage ? styles.activeDot : ''}`}
                        aria-label={`跳转到第 ${index + 1} 页`}
                        aria-current={index === currentPage ? 'true' : 'false'}
                    />
                ))}
            </div>
        </div>
    );
};

export default memo(HotCard);

import React, { useState, useEffect, memo } from 'react';
import styles from './CarouselCard.module.css';
import { useGetListItemsQuery } from '@/app/store/api/listApi';

// 添加类型定义
interface CarouselCardProps {
    title: string;
}

const Skeleton: React.FC = () => {
    return (
        <div className={styles.skeletonCard}>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonImage}></div>
        </div>
    );
};

const CarouselCard: React.FC<CarouselCardProps> = ({ title }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const { data, isLoading, isError } = useGetListItemsQuery();
    
    const carousel = data?.carousel || [];
    
    useEffect(() => {
        if (carousel.length > 0 && currentIndex >= carousel.length) {
            setCurrentIndex(0);
        }
    }, [carousel, currentIndex]);

    if (isLoading) {
        return (
            <div className={styles.carouselCard}>
                <h2 className={styles.title}>{title}</h2>
                <Skeleton />
            </div>
        );
    }

    if (isError || carousel.length === 0) {
        return (
            <div className={styles.carouselCard}>
                <h2 className={styles.title}>{title}</h2>
                <p>暂无轮播图片</p>
            </div>
        );
    }

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carousel.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + carousel.length) % carousel.length);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    // 键盘导航支持
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    };

    return (
        <div
            className={styles.carouselCard}
            style={{ backgroundImage: `url(${carousel[currentIndex]})` }}
            role="region"
            aria-label={`${title} 轮播图`}
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            <div className={styles.overlay}>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.navigationWrapper}>
                    <button
                        onClick={prevSlide}
                        className={`${styles.navButton} ${styles.prevButton}`}
                        aria-label="上一张图片"
                    >
                        &#9664;
                    </button>
                    <button
                        onClick={nextSlide}
                        className={`${styles.navButton} ${styles.nextButton}`}
                        aria-label="下一张图片"
                    >
                        &#9654;
                    </button>
                </div>
                <div className={styles.pageIndicator} role="group" aria-label="轮播图页面指示器">
                    {carousel.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
                            aria-label={`跳转到第 ${index + 1} 张图片`}
                            aria-current={index === currentIndex ? 'true' : 'false'}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default memo(CarouselCard);

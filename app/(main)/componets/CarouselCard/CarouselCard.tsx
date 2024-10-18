import React, { useState, useEffect } from 'react';
import styles from './CarouselCard.module.css';
import { RootState } from '@/app/store/store';
import { useSelector, useDispatch } from 'react-redux';

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
    const { data, status } = useSelector((state: RootState) => state.list);
    
    const carousel = status === 'succeeded' ? data?.carousel || [] : []; // 根据状态获取 carousel 数据
    
    useEffect(() => {
        if (carousel.length > 0 && currentIndex >= carousel.length) {
            setCurrentIndex(0);
        }
    }, [carousel, currentIndex]);

    if (status === 'loading') {
        return (
            <div className={styles.carouselCard}>
                <h2 className={styles.title}>{title}</h2>
                <Skeleton />
            </div>
        );
    }

    if (carousel.length === 0) {
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

    return (
        <div 
            className={styles.carouselCard} 
            style={{ backgroundImage: `url(${carousel[currentIndex] + `?${Date.now()}`})` }} // 使用 images 数组中的第一张图片
        >
            <div className={styles.overlay}>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.navigationWrapper}>
                    <button onClick={prevSlide} className={`${styles.navButton} ${styles.prevButton}`}>&#9664;</button>
                    <button onClick={nextSlide} className={`${styles.navButton} ${styles.nextButton}`}>&#9654;</button>
                </div>
                <div className={styles.pageIndicator}>
                    {carousel.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CarouselCard;

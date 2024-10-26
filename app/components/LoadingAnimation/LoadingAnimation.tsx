import React from 'react';
import styles from './LoadingAnimation.module.css';

const LoadingAnimation: React.FC = () => {
  return (
    <div className={styles.loader}>
      {/* 这里可以使用任何加载动画的实现方式 */}
      Loading...
    </div>
  );
};

export default LoadingAnimation;

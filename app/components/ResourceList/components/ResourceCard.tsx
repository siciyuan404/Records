import Image from 'next/image';
import Link from 'next/link';
import styles from './ResourceCard.module.css';
import { Resource } from '@/app/sys/add/types';

interface ResourceCardProps {
    uuid: string;
    resource?: Resource;
    isLoading?: boolean;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ uuid,resource, isLoading = false }) => {
    if (isLoading) {
        return (
            <div className={`${styles.card} ${styles.skeleton}`}>
                <div className={styles.skeletonImage}></div>
                <div className={styles.skeletonTitle}></div>
                <div className={styles.skeletonCategory}></div>
                <div className={styles.skeletonTags}>
                    <div className={styles.skeletonTag}></div>
                    <div className={styles.skeletonTag}></div>
                    <div className={styles.skeletonTag}></div>
                </div>
                <div className={styles.skeletonIntroduction}></div>
            </div>
        );
    }

    if (!resource) return null;

    return (
        <Link href={`/resource/${uuid}`} className={styles.cardLink}>
            <div className={styles.card}>
                <Image
                    src={resource.images[0]}
                    alt={resource.name}
                    width={200}
                    height={200}
                    className={styles.image}
                />
                <h3 className={styles.title}>{resource.name}</h3>
                <p className={styles.category}>{resource.category}</p>
                <div className={styles.tags}>
                    {resource.tags.map((tag: string) => (  // 添加类型注解
                        <span key={tag} className={styles.tag}>
                            {tag}
                        </span>
                    ))}
                </div>
                <p className={styles.introduction}>{resource.introduction}</p>
            </div>
        </Link>
    );
};

export default ResourceCard;

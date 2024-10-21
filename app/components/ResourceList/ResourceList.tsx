import { useGetResourcesQuery } from '@/app/store/api/resourcesApi';
import ResourceCard from './components/ResourceCard';
import styles from './ResourceList.module.css';
import { FiAlertCircle, FiInbox } from 'react-icons/fi';

const ResourceList = () => {
  const { data: resources, isLoading, isError } = useGetResourcesQuery();

  if (isLoading) {
    return (
      <div className={styles.resourceList}>
        {[...Array(8)].map((_, index) => (
          <ResourceCard key={index} uuid={`loading-${index}`} isLoading={true} />
        ))}
      </div>
    );
  }

  if (isError) return (
    <div className={styles.messageContainer}>
      <FiAlertCircle className={styles.icon} />
      <p className={styles.message}>加载出错，请稍后重试</p>
    </div>
  );
  
  if (!resources || Object.keys(resources).length === 0) return (
    <div className={styles.messageContainer}>
      <FiInbox className={styles.icon} />
      <p className={styles.message}>暂无资源</p>
    </div>
  );

  return (
    <div className={styles.resourceList}>
      {Object.entries(resources).map(([key, resource]) => (
        <ResourceCard key={key} uuid={key} resource={resource} />
      ))}
    </div>
  );
};

export default ResourceList;

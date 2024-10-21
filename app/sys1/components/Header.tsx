import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { addTab, removeTab, clearCache } from '../../store/features/resources/resourcesSlice';

interface Tab {
  path: string;
  title: string;
}

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const tabs = useSelector((state: any) => state.resources.tabs);

  React.useEffect(() => {
    const currentTab = tabs.find((tab: Tab) => tab.path === pathname);
    if (!currentTab) {
      dispatch(addTab({ path: pathname, title: getTabTitle(pathname) }));
    }
  }, [pathname, dispatch, tabs]);

  const getTabTitle = (path: string) => {
    return path.split('/').pop() || 'Home';
  };

  const closeTab = (path: string) => {
    dispatch(removeTab(path));
    dispatch(clearCache(path)); // 清除与该标签相关的缓存

    if (pathname === path && tabs.length > 1) {
      const newTabs = tabs.filter((tab: Tab) => tab.path !== path);
      router.push(newTabs[newTabs.length - 1].path);
    } else if (tabs.length === 1) {
      // 如果关闭的是最后一个标签，可以跳转到默认页面或保持当前页面
      router.push('/sys/dashboard'); // 或者您希望跳转的默认页面
    }
  };

  return (
    <header className="bg-white shadow flex-shrink-0 sticky top-0 z-10"> {/* 修改这里 */}
      <nav className="flex overflow-x-auto">
        {tabs.map((tab: Tab) => (
          <div key={tab.path} className="flex items-center flex-shrink-0">
            <button
              onClick={() => router.push(tab.path)}
              className={`px-4 py-2 whitespace-nowrap ${pathname === tab.path ? 'bg-gray-200' : ''}`}
            >
              {tab.title}
            </button>
            <button
              onClick={() => closeTab(tab.path)}
              className="ml-1 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        ))}
      </nav>
    </header>
  );
};

export default Header;
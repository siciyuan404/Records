import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { addTab, removeTab, setActiveTab, clearAllTabs } from '../../store/features/tabs/tabsSlice';
import { X, XCircle } from 'lucide-react';
import { RootState } from '../../store/store';

interface Tab {
  path: string;
  title: string;
}

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { tabs, activeTab } = useSelector((state: RootState) => state.tabs);

  React.useEffect(() => {
    if (pathname) {
      const currentTab = tabs.find((tab: Tab) => tab.path === pathname);
      if (!currentTab) {
        dispatch(addTab({ path: pathname, title: getTabTitle(pathname) }));
      } else {
        dispatch(setActiveTab(pathname));
      }
    }
  }, [pathname, dispatch, tabs]);

  const getTabTitle = (path: string): string => {
    const pathSegments = path.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    // 这里定义路径与中文标题的映射
    const titleMap: { [key: string]: string } = {
      'add': '添加',
      'dashboard': '仪表盘',
      'categories': '分类树',
      'resource': '资源列表',
      'recommend': '推荐',
      'hot': '热门',
      'latest': '最新',
      'top': '置顶'
    };

    return titleMap[lastSegment] || lastSegment;
  };

  const closeTab = (path: string) => {
    dispatch(removeTab(path));
    if (pathname === path) {
      if (tabs.length > 1) {
        const newTabs = tabs.filter((tab: Tab) => tab.path !== path);
        router.push(newTabs[newTabs.length - 1].path);
      } else {
        router.push('/sys/add');
      }
    }
  };

  const closeAllTabs = () => {
    dispatch(clearAllTabs());
    router.push('/sys/add');
  };

  if (!tabs || tabs.length === 0) {
    return null; // 或者显示一个加载指示器
  }

  return (
    <header className="bg-white shadow flex-shrink-0 sticky top-0 z-10">
      <nav className="flex items-center justify-between overflow-x-auto">
        <div className="flex">
          {tabs.map((tab: Tab) => (
            <div key={tab.path} className="flex items-center flex-shrink-0 m-1">
              <button
                onClick={() => {
                  dispatch(setActiveTab(tab.path));
                  router.push(tab.path);
                }}
                className={`px-3 py-1 rounded-md flex items-center border border-transparent ${
                  activeTab === tab.path ? 'bg-gray-200' : 'bg-gray-100'
                }`}
              >
                <span className="mr-2">{tab.title}</span>
                <X
                  size={16}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.path);
                  }}
                />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={closeAllTabs}
          className="px-4 py-2 text-gray-500 hover:text-gray-700 flex items-center"
        >
          <XCircle size={20} className="mr-1" />
          关闭所有
        </button>
      </nav>
    </header>
  );
};

export default Header;

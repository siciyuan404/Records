"use client"

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { PlusCircle, LayoutDashboard, FileText, List, Sidebar as SidebarIcon, Home, FolderTree, Table, History } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { addTab, setActiveTab } from '../../../store/features/tabs/tabsSlice'
import ChangeHistoryDrawer from './components/ChangeHistoryDrawer'

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isListExpanded, setIsListExpanded] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const changeHistoryButtonRef = useRef<HTMLButtonElement>(null);

  const toggleSidebar = () => setIsExpanded(!isExpanded)
  const toggleList = () => setIsListExpanded(!isListExpanded)

  const handleNavigation = (href: string, label: string) => {
    dispatch(addTab({ path: href, title: label }))
    dispatch(setActiveTab(href))
    router.push(href)
  }

  const menuItems = [
    { href: '/sys/add', icon: PlusCircle, label: '添加', className: 'bg-gray-800 text-white rounded-full p-1', labelClassName: 'font-semibold' },
    { href: '/sys/dashboard', icon: LayoutDashboard, label: '仪表盘' },
    { href: '/sys/categories', icon: FolderTree, label: '分类树' },
    { href: '/sys/resource', icon: FileText, label: '资源列表' },
    {
      icon: Table,
      label: '列表',
      subItems: [
        { href: '/sys/list/recommend', label: '推荐' },
        { href: '/sys/list/hot', label: '热门' },
        { href: '/sys/list/latest', label: '最新' },
        { href: '/sys/list/top', label: '置顶' },
      ],
    },
  ]

  return (
    <aside className={`bg-gray-100 text-gray-800 h-full transition-all duration-300 ease-in-out relative flex flex-col ${
      isExpanded ? 'w-56' : 'w-12'
    } text-xs`}>
      <div className="flex justify-between items-center p-2 overflow-hidden relative ">
        <Link href="/sys" className="flex items-center">
          <Image src="/favicon.ico" alt="管理后台图标" width={20} height={20} className="flex-shrink-0" />
          <span className={`ml-2 font-bold whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            管理后台
          </span>
        </Link>
        {isExpanded && (
          <button
            onClick={toggleSidebar}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-5 h-5 bg-gray-200 rounded-full hover:bg-gray-300 transition-all duration-300 ease-in-out"
          >
            <SidebarIcon className="rotate-180" size={16} />
          </button>
        )}
      </div>

      <nav className="flex-grow mt-3 overflow-hidden px-1">
        {menuItems.map((item, index) => (
          <div key={index} className="mb-1">
            {item.subItems ? (
              <div>
                <button
                  onClick={toggleList}
                  className="flex items-center w-full px-2 py-1 hover:bg-gray-200 transition-colors overflow-hidden rounded-lg"
                >
                  <item.icon className="inline-block flex-shrink-0" size={16} />
                  <span className={`ml-2 whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'}`}>
                    {item.label}
                  </span>
                </button>
                {isListExpanded && isExpanded && (
                  <div className="ml-2 mt-1">
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        className="flex items-center px-2 py-1 hover:bg-gray-200 transition-colors overflow-hidden rounded-lg"
                      >
                        <span className="whitespace-nowrap">{subItem.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNavigation(item.href, item.label)}
                className={`flex items-center w-full px-2 py-1 transition-colors overflow-hidden rounded-lg ${item.className || 'hover:bg-gray-200'}`}
              >
                <item.icon className={`inline-block flex-shrink-0 ${item.className ? 'text-black' : ''}`} size={16} />
                <span className={`ml-2 whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'} ${item.labelClassName || ''}`}>
                  {item.label}
                </span>
              </button>
            )}
          </div>
        ))}
      </nav>

      <div
        className="absolute top-0 right-0 w-[1px] h-full bg-gray-300 hover:w-1 hover:bg-gray-400 transition-all duration-200 cursor-ew-resize"
        onClick={toggleSidebar}
      ></div>

      <div className="mb-1 px-1">
        {!isExpanded && (
          <button
            onClick={toggleSidebar}
            className="flex items-center w-full px-2 py-1 hover:bg-gray-200 transition-colors overflow-hidden rounded-lg"
          >
            <SidebarIcon className="inline-block flex-shrink-0" size={16} />
          </button>
        )}
        <button
          onClick={() => router.push('/')}
          className="flex items-center w-full px-2 py-1 hover:bg-gray-200 transition-colors overflow-hidden rounded-lg"
        >
          {isExpanded ? (
            <>
              <Home className="inline-block flex-shrink-0" size={16} />
              <span className="ml-2 whitespace-nowrap transition-all duration-300">返回主页</span>
            </>
          ) : (
            <Home className="inline-block flex-shrink-0" size={16} />
          )}
        </button>
      </div>

      <div className="mb-1 px-1">
        <button
          ref={changeHistoryButtonRef}
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className="flex items-center w-full px-2 py-1 hover:bg-gray-200 transition-colors overflow-hidden rounded-lg"
        >
          <History className="inline-block flex-shrink-0" size={16} />
          <span className={`ml-2 whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'}`}>
            变更历史
          </span>
        </button>
      </div>

      <ChangeHistoryDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
      />
    </aside>
  )
}

export default Sidebar

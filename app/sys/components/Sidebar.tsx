"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, LayoutDashboard, FileText, List, Sidebar as SidebarIcon, Home } from 'lucide-react'

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isListExpanded, setIsListExpanded] = useState(false)
  const router = useRouter()

  const toggleSidebar = () => setIsExpanded(!isExpanded)
  const toggleList = () => setIsListExpanded(!isListExpanded)

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  const menuItems = [
    { href: '/sys/add', icon: Plus, label: '添加', className: 'border border-gray-300 rounded-full p-1', labelClassName: 'font-semibold' },
    { href: '/sys/categories', icon: FileText, label: '分类' },
    { href: '/sys/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/sys/resource', icon: FileText, label: 'Resource' },
    {
      icon: List,
      label: 'List',
      subItems: [
        { href: '/sys/list/recommend', label: 'Recommend' },
        { href: '/sys/list/hot', label: 'Hot' },
        { href: '/sys/list/latest', label: 'Latest' },
        { href: '/sys/list/top', label: 'Top' },
      ],
    },
  ]

  return (
    <aside className={`bg-gray-100 text-gray-800 h-full transition-all duration-300 ease-in-out relative flex flex-col ${isExpanded ? 'w-64' : 'w-16'}`}>
      <div className="flex justify-between items-center p-4 overflow-hidden relative">
        <Link href="/admin" className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex-shrink-0"></div>
          <span className={`ml-2 font-bold whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            管理后台
          </span>
        </Link>
        {isExpanded && (
          <button
            onClick={toggleSidebar}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition-all duration-300 ease-in-out"
          >
            <SidebarIcon size={16} className="rotate-180" />
          </button>
        )}
      </div>

      <nav className="flex-grow mt-5 overflow-hidden px-2">
        {menuItems.map((item, index) => (
          <div key={index} className="mb-1">
            {item.subItems ? (
              <div>
                <button
                  onClick={toggleList}
                  className="flex items-center w-full px-4 py-2 hover:bg-gray-200 transition-colors overflow-hidden rounded-lg"
                >
                  <item.icon className="inline-block flex-shrink-0" size={20} />
                  <span className={`ml-2 whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'}`}>
                    {item.label}
                  </span>
                </button>
                {isListExpanded && isExpanded && (
                  <div className="ml-4 mt-1">
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        className="flex items-center px-4 py-2 hover:bg-gray-200 transition-colors overflow-hidden rounded-lg"
                      >
                        <span className="whitespace-nowrap">{subItem.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNavigation(item.href)}
                className={`flex items-center w-full px-4 py-2 hover:bg-gray-200 transition-colors overflow-hidden rounded-lg ${item.className || ''}`}
              >
                <item.icon className={`inline-block flex-shrink-0 ${item.className ? 'text-gray-600' : ''}`} size={20} />
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

      <div className="mb-1 px-2" >
        {!isExpanded && (
          <button
            onClick={toggleSidebar}
            className="flex items-center w-full px-4 py-2 hover:bg-gray-200 transition-colors overflow-hidden rounded-lg"
          >
            <SidebarIcon className="inline-block flex-shrink-0" size={20} />
          </button>
        )}
        <button
          onClick={() => router.push('/')}
          className="flex items-center w-full px-4 py-2 hover:bg-gray-200 transition-colors overflow-hidden rounded-lg"
        >
          {isExpanded ? (
            <>
              <Home className="inline-block flex-shrink-0" size={20} />
              <span className="ml-2 whitespace-nowrap transition-all duration-300">返回主页</span>
            </>
          ) : (
            <Home className="inline-block flex-shrink-0" size={20} />
          )}
        </button>
      </div>



    </aside>
  )
}

export default Sidebar
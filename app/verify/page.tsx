'use client'; // 声明这是一个客户端组件

// 导入必要的React hooks和Next.js的路由功能
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './VerifyPage.module.css'; // 导入CSS模块

// 自定义hook：用于管理token的存储、获取和删除
function useToken() {
  // 从localStorage获取token
  const getToken = () => {
    return localStorage.getItem('token');
  };
  // 将token存储到localStorage
  const setToken = (token: string) => {
    localStorage.setItem('token', token);
  };
  // 从localStorage删除token
  const removeToken = () => {
    localStorage.removeItem('token');
  };

  // 返回一个包含这三个方法的对象
  return { getToken, setToken, removeToken };
}

// 验证页面的主组件
export default function VerifyPage() {
    // 使用useState hook管理组件状态
    const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'failure'>('idle'); // 验证状态
    const [password, setPassword] = useState(''); // 用户输入的密码
    const router = useRouter(); // 用于页面导航
    const { getToken, setToken, removeToken } = useToken(); // 使用自定义hook管理token
    
    // 处理验证逻辑的异步函数
    const handleVerify = async () => {
        setStatus('verifying'); // 设置状态为验证中
        try {
            // 发送POST请求到验证API
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });
            const data = await response.json(); // 解析响应数据
            if (data.success) {
                setStatus('success'); // 验证成功
                setToken(data.token);  // 存储token
                router.push('/sys'); // 跳转到系统页面
            } else {
                setStatus('failure'); // 验证失败
            }
        } catch (error) {
            setStatus('failure'); // 发生错误，验证失败
        }
    };

    // 使用useEffect hook在组件挂载时检查token
    useEffect(() => {  
        const token = getToken(); // 获取存储的token
        
        if (token === undefined) {
            setStatus('idle'); // 没有token，设置为初始状态
        } else if (token) {
            setStatus('verifying'); // 有token，开始验证
            // 发送验证请求
            fetch('/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ token }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setToken(data.token);  // 更新token
                    router.push('/sys'); // 验证成功，跳转到系统页面
                } else {
                    removeToken();  // 验证失败，删除token
                    setStatus('failure');
                }
            })
            .catch(error => {
                removeToken();  // 发生错误，删除token
                setStatus('failure');
            });
        } else {
            setStatus('idle'); // token为空，设置为初始状态
        }
    }, [router, getToken, setToken, removeToken]); // 依赖项列表

    // 渲染组件UI
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>验证您的身份</h2>
                <div className={styles.inputWrapper}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="请输入密码"
                        className={styles.input}
                    />
                </div>
                <div className={styles.statusMessage}>
                    {status === 'idle' && <p>请输入密码并点击验证按钮。</p>}
                    {status === 'verifying' && <p className={styles.verifying}>正在验证<span>...</span></p>}
                    {status === 'success' && <p className={styles.success}>验证通过！正在跳转...</p>}
                    {status === 'failure' && <p className={styles.failure}>验证失败，请重试。</p>}
                </div>
                <button 
                    onClick={handleVerify} 
                    disabled={status === 'verifying'} 
                    className={`${styles.button} ${status === 'verifying' ? styles.disabled : ''}`}
                >
                    {status === 'failure' ? '重新验证' : '验证'}
                </button>
            </div>
        </div>
    );
}
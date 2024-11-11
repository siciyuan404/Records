'use client'; // 声明这是一个客户端组件

// 导入必要的React hooks和Next.js的路由功能
import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './VerifyPage.module.css'; // 导入CSS模块
import ReCAPTCHA from 'react-google-recaptcha';

// 自定义hook：用于管理token的存储、获取和删除
function useToken() {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    // 在客户端初始化时从localStorage获取token
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setTokenState(storedToken);
    }
  }, []);

  const getToken = useCallback(() => token, [token]);

  const setToken = useCallback((newToken: string) => {
    setTokenState(newToken);
    localStorage.setItem('token', newToken);
  }, []);

  const removeToken = useCallback(() => {
    setTokenState(null);
    localStorage.removeItem('token');
  }, []);

  return { getToken, setToken, removeToken };
}

// 验证页面的主组件
export default function VerifyPage() {
    // 使用useState hook管理组件态
    const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'failure'>('idle'); // 验证状态
    const [password, setPassword] = useState(''); // 用户输入的密码
    const router = useRouter(); // 用于页面导航
    const { setToken, removeToken } = useToken(); // 使用自定义hook管理token
    const isVerifying = useRef(false);
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const [captchaModalOpen, setCaptchaModalOpen] = useState(false); // 管理弹窗状态
    const recaptchaRef = useRef<ReCAPTCHA>(null); // 引用 reCAPTCHA 组件
    const siteKey = process.env.RECAPTCHA_SITE_KEY || process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) {
        console.error('ReCAPTCHA sitekey is missing. Please set RECAPTCHA_SITE_KEY in your environment variables.');
        return <div>{process.env.VERIFY_PASSWORD}</div>;
    }

    const handleCaptchaChange = (value: string | null) => {
        if (value) {
            setCaptchaVerified(true);
            setCaptchaModalOpen(false); // 关闭弹窗
            handleVerify(); // 继续验证流程
        }
    };

    const handleVerifyClick = () => {
        setCaptchaModalOpen(true); // 打开弹窗
    };

    // 处理验证逻辑的异步函数
    const handleVerify = async () => {
        if (isVerifying.current || !captchaVerified) return; // 只有验证码通过才继续验证
        isVerifying.current = true;
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
        } finally {
            isVerifying.current = false;
        }
    };

    const verifyToken = useCallback(async (token: string) => {
        if (isVerifying.current) return;
        isVerifying.current = true;
        try {
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });
            const data = await response.json();
            if (data.success) {
                setToken(data.token);
                setStatus('success');
                router.push('/sys');
            } else {
                removeToken();
                setStatus('idle');
            }
        } catch (error) {
            removeToken();
            setStatus('idle');
        } finally {
            isVerifying.current = false;
        }
    }, [setToken, removeToken, router]);





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
                    {status === 'idle' && <p className={styles.message}>🔒 请输入密码并点击验证按钮。</p>}
                    {status === 'verifying' && <p className={`${styles.verifying} ${styles.message}`}>⏳ 正在验证<span>...</span></p>}
                    {status === 'success' && <p className={`${styles.success} ${styles.message}`}>✅ 验证通过！正在跳转...</p>}
                    {status === 'failure' && <p className={`${styles.failure} ${styles.message}`}>❌ 验证失败，请重试。</p>}
                </div>
                <button 
                    onClick={handleVerifyClick} 
                    disabled={isVerifying.current} 
                    className={`${styles.button} ${isVerifying.current ? styles.disabled : ''}`}
                >
                    {status === 'failure' ? '重新验证' : '验证'}
                </button>
                {/* 增：弹窗模态框 */}
                {captchaModalOpen && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={siteKey || ''}
                                onChange={handleCaptchaChange}
                            />
                            <button onClick={() => setCaptchaModalOpen(false)} className={styles.closeButton}>关闭</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

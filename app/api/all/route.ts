import { NextResponse } from 'next/server';
import axios from 'axios';
import AdmZip from 'adm-zip';
import crypto from 'crypto';

const GITHUB_ZIP_URL = 'https://github.com/mxrain/resources/archive/refs/heads/master.zip';

// 加密函数
function encrypt(text: string, key: string): string {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// 解密函数
function decrypt(encryptedText: string, key: string): string {
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export async function GET() {
  // 禁用缓存
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store, max-age=0');

  try {
    // 下载ZIP文件
    const response = await axios.get(GITHUB_ZIP_URL, { responseType: 'arraybuffer' });
    const zipBuffer = Buffer.from(response.data);

    // 解压ZIP文件
    const zip = new AdmZip(zipBuffer);
    const zipEntries = zip.getEntries();

    // 打印所有文件名，以便调试
    // console.log('ZIP文件中的所有文件:');
    // zipEntries.forEach(entry => console.log(entry.entryName));

    // 查找并读取all.json文件（修改这里以匹配正确的文件路径）
    const allEntry = zipEntries.find(entry => entry.entryName.includes('db/categories.json'));
    if (!allEntry) {
      throw new Error('在ZIP文件中未找到db/categories.json');
    }

    const allContent = allEntry.getData().toString('utf8');
    const allData = JSON.parse(allContent);

    // 对数据进行加密
    const encryptionKey = process.env.ENCRYPTION_KEY || 'defaultKey';
    const encryptedData = encrypt(JSON.stringify(allData), encryptionKey);
    // 对数据进行解密
    const decryptedData = decrypt(encryptedData, encryptionKey);
    const parsedData = JSON.parse(decryptedData);

    return NextResponse.json({ encryptedData, parsedData }, { headers });
  } catch (error: unknown) {
    console.error('获取所有数据时出错:', error);
    return NextResponse.json(
      { error: '获取所有数据失败', details: (error as Error).message },
      { status: 500 }
    );
  }
}


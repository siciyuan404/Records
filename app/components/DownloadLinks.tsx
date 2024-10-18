import { useState } from 'react';
import { FaLink, FaLock, FaCopy, FaCheck } from 'react-icons/fa';

interface DownloadLink {
  platform: string;
  url: string;
  password?: string;
}

interface DownloadLinksProps {
  links: DownloadLink[];
}

export default function DownloadLinks({ links }: DownloadLinksProps) {
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates({ ...copiedStates, [key]: true });
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [key]: false });
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {links.map((link, index) => (
        <div key={index} className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <FaLink className="mr-2 text-blue-500" />
            {link.platform}
          </h3>
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={link.url}
              readOnly
              className="flex-grow bg-gray-100 p-2 rounded-l-md"
            />
            <button
              onClick={() => copyToClipboard(link.url, `url-${index}`)}
              className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 transition-colors"
            >
              {copiedStates[`url-${index}`] ? <FaCheck /> : <FaCopy />}
            </button>
          </div>
          {link.password && (
            <div className="flex items-center">
              <FaLock className="mr-2 text-gray-500" />
              <input
                type="text"
                value={link.password}
                readOnly
                className="flex-grow bg-gray-100 p-2 rounded-l-md"
              />
              <button
                onClick={() => copyToClipboard(link.password!, `password-${index}`)}
                className="bg-green-500 text-white p-2 rounded-r-md hover:bg-green-600 transition-colors"
              >
                {copiedStates[`password-${index}`] ? <FaCheck /> : <FaCopy />}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ContentContextType {
  content: Record<string, string>;
  isLoading: boolean;
  getContent: (key: string, defaultValue?: string) => string;
  updateContent: (key: string, value: string) => void;
  refetch: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const response = await fetch('https://functions.yandexcloud.net/d4eqrbaalbc7nhcuj3qq');
      if (response.ok) {
        const data = await response.json();
        const contentMap: Record<string, string> = {};
        data.forEach((item: { key: string; value: string }) => {
          contentMap[item.key] = item.value;
        });
        setContent(contentMap);
      }
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const getContent = (key: string, defaultValue = '') => {
    return content[key] || defaultValue;
  };

  const updateContent = (key: string, value: string) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  const refetch = async () => {
    setIsLoading(true);
    await fetchContent();
  };

  return (
    <ContentContext.Provider value={{ content, isLoading, getContent, updateContent, refetch }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within ContentProvider');
  }
  return context;
}

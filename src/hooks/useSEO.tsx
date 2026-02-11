import { useEffect } from 'react';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonicalUrl?: string;
  structuredData?: any;
  article?: {
    author: string;
    publishedTime: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
  };
}

export const useSEO = (config: SEOConfig) => {
  useEffect(() => {
    const baseUrl = window.location.origin;
    const currentPath = window.location.pathname;
    const fullUrl = `${baseUrl}${currentPath}`;

    document.title = config.title;

    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setMetaTag('description', config.description);
    if (config.keywords) {
      setMetaTag('keywords', config.keywords);
    }

    setMetaTag('og:title', config.ogTitle || config.title, true);
    setMetaTag('og:description', config.ogDescription || config.description, true);
    setMetaTag('og:url', fullUrl, true);
    setMetaTag('og:type', config.ogType || 'website', true);
    
    if (config.ogImage) {
      setMetaTag('og:image', config.ogImage, true);
      setMetaTag('og:image:width', '1200', true);
      setMetaTag('og:image:height', '630', true);
    }

    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', config.ogTitle || config.title);
    setMetaTag('twitter:description', config.ogDescription || config.description);
    if (config.ogImage) {
      setMetaTag('twitter:image', config.ogImage);
    }

    if (config.article) {
      setMetaTag('article:author', config.article.author, true);
      setMetaTag('article:published_time', config.article.publishedTime, true);
      if (config.article.modifiedTime) {
        setMetaTag('article:modified_time', config.article.modifiedTime, true);
      }
      if (config.article.section) {
        setMetaTag('article:section', config.article.section, true);
      }
      if (config.article.tags) {
        config.article.tags.forEach(tag => {
          const meta = document.createElement('meta');
          meta.setAttribute('property', 'article:tag');
          meta.setAttribute('content', tag);
          document.head.appendChild(meta);
        });
      }
    }

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = config.canonicalUrl || fullUrl;

    if (config.structuredData) {
      const existingScript = document.querySelector('script[data-seo="structured-data"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', 'structured-data');
      script.textContent = JSON.stringify(config.structuredData);
      document.head.appendChild(script);
    }

    return () => {
      if (config.article?.tags) {
        document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());
      }
    };
  }, [config]);
};

export const generateArticleSchema = (article: {
  title: string;
  description: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  imageUrl?: string;
  url: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "articleBody": article.content.substring(0, 500),
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "Школа актёрского мастерства Казбека Меретукова",
      "logo": {
        "@type": "ImageObject",
        "url": "https://cdn.poehali.dev/projects/d006fe31-f11a-48d3-ba82-54149e58d318/files/01b72b78-652d-4a1b-a035-4f458874219c.jpg"
      }
    },
    "datePublished": article.publishedAt,
    "dateModified": article.updatedAt || article.publishedAt,
    "image": article.imageUrl,
    "url": article.url,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": article.url
    },
    "inLanguage": "ru-RU"
  };
};

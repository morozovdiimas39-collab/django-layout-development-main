import { Helmet } from 'react-helmet';

interface CourseSchema {
  name: string;
  description: string;
  provider: string;
  url: string;
  price?: string;
  duration?: string;
}

interface ReviewSchema {
  author: string;
  rating: number;
  text: string;
  date?: string;
}

interface OrganizationData {
  name: string;
  description: string;
  url: string;
  logo: string;
  phone?: string;
  email?: string;
  address?: string;
  priceRange?: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SchemaMarkupProps {
  type: 'course' | 'organization' | 'reviews' | 'faq' | 'localbusiness' | 'breadcrumbs';
  courseData?: CourseSchema;
  organizationData?: OrganizationData;
  reviews?: ReviewSchema[];
  faqItems?: Array<{ question: string; answer: string }>;
  breadcrumbs?: BreadcrumbItem[];
}

export default function SchemaMarkup({ 
  type, 
  courseData, 
  organizationData,
  reviews, 
  faqItems,
  breadcrumbs 
}: SchemaMarkupProps) {
  const renderCourseSchema = () => {
    if (!courseData) return null;

    const schema = {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": courseData.name,
      "description": courseData.description,
      "provider": {
        "@type": "Organization",
        "name": courseData.provider,
        "sameAs": "https://xn----7sbdfnbalzedv3az5aq.xn--p1ai"
      },
      "url": courseData.url,
      ...(courseData.price && {
        "offers": {
          "@type": "Offer",
          "price": courseData.price,
          "priceCurrency": "RUB"
        }
      }),
      ...(courseData.duration && {
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "onsite",
          "duration": courseData.duration
        }
      })
    };

    return <script type="application/ld+json">{JSON.stringify(schema)}</script>;
  };

  const renderOrganizationSchema = () => {
    if (!organizationData) return null;

    const schema = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": organizationData.name,
      "description": organizationData.description,
      "url": organizationData.url,
      "logo": organizationData.logo,
      "image": organizationData.logo,
      "sameAs": [
        "https://xn----7sbdfnbalzedv3az5aq.xn--p1ai"
      ]
    };

    return <script type="application/ld+json">{JSON.stringify(schema)}</script>;
  };

  const renderLocalBusinessSchema = () => {
    if (!organizationData) return null;

    const schema = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": organizationData.name,
      "description": organizationData.description,
      "url": organizationData.url,
      "logo": organizationData.logo,
      "image": organizationData.logo,
      ...(organizationData.phone && { "telephone": organizationData.phone }),
      ...(organizationData.email && { "email": organizationData.email }),
      ...(organizationData.address && {
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Москва",
          "addressCountry": "RU",
          "streetAddress": organizationData.address
        }
      }),
      ...(organizationData.priceRange && { "priceRange": organizationData.priceRange }),
      "aggregateRating": reviews && reviews.length > 0 ? {
        "@type": "AggregateRating",
        "ratingValue": (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
        "reviewCount": reviews.length,
        "bestRating": "5",
        "worstRating": "1"
      } : undefined
    };

    return <script type="application/ld+json">{JSON.stringify(schema)}</script>;
  };

  const renderReviewsSchema = () => {
    if (!reviews || reviews.length === 0) return null;

    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Школа актёрского мастерства Казбека Меретукова",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
        "reviewCount": reviews.length,
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": reviews.slice(0, 10).map(review => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": review.author
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.rating,
          "bestRating": "5"
        },
        "reviewBody": review.text,
        ...(review.date && { "datePublished": review.date })
      }))
    };

    return <script type="application/ld+json">{JSON.stringify(schema)}</script>;
  };

  const renderFAQSchema = () => {
    if (!faqItems || faqItems.length === 0) return null;

    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };

    return <script type="application/ld+json">{JSON.stringify(schema)}</script>;
  };

  const renderBreadcrumbsSchema = () => {
    if (!breadcrumbs || breadcrumbs.length === 0) return null;

    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    };

    return <script type="application/ld+json">{JSON.stringify(schema)}</script>;
  };

  return (
    <Helmet>
      {type === 'course' && renderCourseSchema()}
      {type === 'organization' && renderOrganizationSchema()}
      {type === 'localbusiness' && renderLocalBusinessSchema()}
      {type === 'reviews' && renderReviewsSchema()}
      {type === 'faq' && renderFAQSchema()}
      {type === 'breadcrumbs' && renderBreadcrumbsSchema()}
    </Helmet>
  );
}

import React from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  organization?: {
    name?: string;
    logo?: string;
    telephone?: string;
    email?: string;
    address?: any;
  };
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Express English Hub - Kuasai Tes TOEFL ITP & iBT Anda',
  description = 'Platform persiapan TOEFL ITP dan TOEFL iBT terbaik di Indonesia. Kursus online, tes simulasi, dan bimbingan ahli untuk raih skor target TOEFL Anda. Trainer bersertifikat ETS.',
  keywords = 'TOEFL ITP, TOEFL iBT, kursus TOEFL, tes TOEFL online, persiapan TOEFL, bimbingan TOEFL, skor TOEFL tinggi, TOEFL Indonesia, kelas TOEFL, latihan TOEFL, simulasi TOEFL, tips TOEFL, strategi TOEFL, beasiswa luar negeri, studi luar negeri, tes bahasa inggris, ETS TOEFL, TOEFL preparation, TOEFL course, TOEFL training',
  image = '/logo.jpg',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  author = 'Express English Hub',
  article,
  organization,
  breadcrumbs,
  faq
}) => {
  React.useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('author', author);
    updateMeta('robots', 'index, follow');
    updateMeta('language', 'id');
    
    // Open Graph tags
    updateMeta('og:title', title, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:image', image, 'property');
    updateMeta('og:url', url, 'property');
    updateMeta('og:type', type, 'property');
    updateMeta('og:site_name', 'Express English Hub', 'property');
    updateMeta('og:locale', 'id_ID', 'property');
    
    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image', 'name');
    updateMeta('twitter:title', title, 'name');
    updateMeta('twitter:description', description, 'name');
    updateMeta('twitter:image', image, 'name');
    updateMeta('twitter:site', '@ExpressEnglishHub', 'name');
    
    // Additional SEO meta tags
    updateMeta('theme-color', '#e87211', 'name');
    updateMeta('msapplication-TileColor', '#e87211', 'name');
    updateMeta('application-name', 'Express English Hub', 'name');
    
    // Canonical URL
    updateCanonical(url);
    
    // Add structured data
    addStructuredData(title, description, image, url);
  }, [title, description, keywords, image, url, type, author]);

  const updateMeta = (name: string, content: string, attribute: string = 'name') => {
    let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      document.head.appendChild(element);
    }
    element.content = content;
  };

  const updateCanonical = (url: string) => {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  };

  const addStructuredData = (title: string, description: string, image: string, url: string) => {
    const baseSchema = {
      "@context": "https://schema.org",
      "@graph": []
    };

    // Main Organization Schema
    const organizationSchema = {
      "@type": "EducationalOrganization",
      "@id": `${url}#organization`,
      "name": "Express English Hub",
      "alternateName": ["EEH", "Express English Hub Indonesia"],
      "description": description,
      "url": url,
      "logo": {
        "@type": "ImageObject",
        "url": image,
        "width": 200,
        "height": 200
      },
      "image": image,
      "telephone": "+62-21-XXXXXXX",
      "email": "info@expressenglishhub.com",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": ["Indonesian", "English"],
        "telephone": "+62-21-XXXXXXX"
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "ID",
        "addressLocality": "Jakarta",
        "addressRegion": "DKI Jakarta",
        "streetAddress": "Jl. Pendidikan No. 123"
      },
      "sameAs": [
        "https://www.facebook.com/ExpressEnglishHub",
        "https://www.instagram.com/expressenglishhub",
        "https://www.youtube.com/@ExpressEnglishHub",
        "https://linkedin.com/company/expressenglishhub"
      ],
      "foundingDate": "2020-01-01",
      "numberOfEmployees": "50-100",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "847",
        "bestRating": "5",
        "worstRating": "1"
      }
    };

    // Website Schema
    const websiteSchema = {
      "@type": "WebSite",
      "@id": `${url}#website`,
      "url": url,
      "name": "Express English Hub",
      "description": description,
      "publisher": {
        "@id": `${url}#organization`
      },
      "potentialAction": [
        {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${url}/blog?search={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      ],
      "inLanguage": ["id", "en"]
    };

    // Course Schemas for TOEFL programs
    const toefliTPCourse = {
      "@type": "Course",
      "@id": `${url}#toefl-itp-course`,
      "name": "TOEFL ITP Preparation Course",
      "description": "Comprehensive TOEFL ITP preparation course with expert guidance",
      "provider": {
        "@id": `${url}#organization`
      },
      "courseCode": "TOEFL-ITP-2025",
      "educationalCredentialAwarded": "TOEFL ITP Certificate",
      "teaches": ["TOEFL Reading", "TOEFL Listening", "TOEFL Structure"],
      "timeRequired": "P3M",
      "coursePrerequisites": "Basic English proficiency",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "312"
      },
      "offers": {
        "@type": "Offer",
        "category": "Education",
        "price": "2500000",
        "priceCurrency": "IDR",
        "availability": "https://schema.org/InStock"
      }
    };

    const toefLiBTCourse = {
      "@type": "Course", 
      "@id": `${url}#toefl-ibt-course`,
      "name": "TOEFL iBT Preparation Course",
      "description": "Advanced TOEFL iBT preparation with speaking and writing components",
      "provider": {
        "@id": `${url}#organization`
      },
      "courseCode": "TOEFL-IBT-2025",
      "educationalCredentialAwarded": "TOEFL iBT Certificate",
      "teaches": ["TOEFL Reading", "TOEFL Listening", "TOEFL Speaking", "TOEFL Writing"],
      "timeRequired": "P4M",
      "coursePrerequisites": "Intermediate English proficiency",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.7",
        "reviewCount": "289"
      },
      "offers": {
        "@type": "Offer",
        "category": "Education",
        "price": "3500000",
        "priceCurrency": "IDR",
        "availability": "https://schema.org/InStock"
      }
    };

    baseSchema["@graph"] = [organizationSchema, websiteSchema, toefliTPCourse, toefLiBTCourse];

    // Add article schema if it's an article page
    if (article) {
      const articleSchema = {
        "@type": "Article",
        "@id": `${url}#article`,
        "headline": title,
        "description": description,
        "image": image,
        "url": url,
        "datePublished": article.publishedTime || new Date().toISOString(),
        "dateModified": article.modifiedTime || new Date().toISOString(),
        "author": {
          "@type": "Organization",
          "@id": `${url}#organization`
        },
        "publisher": {
          "@id": `${url}#organization`
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": url
        },
        "articleSection": article.section || "TOEFL Tips",
        "keywords": article.tags?.join(", ") || keywords,
        "inLanguage": "id"
      };
      baseSchema["@graph"].push(articleSchema);
    }

    // Add breadcrumb schema if provided
    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        "itemListElement": breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": crumb.url
        }))
      };
      baseSchema["@graph"].push(breadcrumbSchema);
    }

    // Add FAQ schema if provided
    if (faq && faq.length > 0) {
      const faqSchema = {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        "mainEntity": faq.map(item => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      };
      baseSchema["@graph"].push(faqSchema);
    }

    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(baseSchema, null, 2);
  };

  return null;
};

export default SEO;
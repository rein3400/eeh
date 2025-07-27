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
  author = 'Express English Hub'
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
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "Express English Hub",
      "description": description,
      "url": url,
      "logo": image,
      "image": image,
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": ["Indonesian", "English"]
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "ID",
        "addressLocality": "Indonesia"
      },
      "sameAs": [
        "https://www.facebook.com/ExpressEnglishHub",
        "https://www.instagram.com/expressenglishhub",
        "https://www.youtube.com/@ExpressEnglishHub"
      ],
      "offers": {
        "@type": "Offer",
        "category": "TOEFL Preparation Course",
        "description": "Comprehensive TOEFL ITP and iBT preparation courses"
      },
      "educationalCredentialAwarded": "TOEFL ITP Certificate",
      "hasCredential": {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "TOEFL ITP",
        "recognizedBy": {
          "@type": "Organization",
          "name": "Educational Testing Service (ETS)"
        }
      }
    };

    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
  };

  return null;
};

export default SEO;
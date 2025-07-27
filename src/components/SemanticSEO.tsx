import React from 'react';

interface SemanticSEOProps {
  pageType: 'homepage' | 'course' | 'organization' | 'article' | 'faq' | 'contact';
  courseData?: {
    name: string;
    description: string;
    provider: string;
    price?: string;
    currency?: string;
    duration?: string;
    category: 'TOEFL ITP' | 'TOEFL iBT';
    skills?: string[];
    level?: 'Beginner' | 'Intermediate' | 'Advanced';
    rating?: {
      value: number;
      count: number;
    };
  };
  organizationData?: {
    name: string;
    description: string;
    logo: string;
    address?: string;
    phone?: string;
    email?: string;
    socialMedia?: string[];
  };
  articleData?: {
    title: string;
    description: string;
    author: string;
    publishDate: string;
    modifiedDate?: string;
    image?: string;
    category?: string;
    tags?: string[];
  };
  faqData?: {
    questions: Array<{
      question: string;
      answer: string;
    }>;
  };
}

const SemanticSEO: React.FC<SemanticSEOProps> = ({
  pageType,
  courseData,
  organizationData,
  articleData,
  faqData
}) => {
  const generateHomepageSchema = () => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://expressenglishhub.com/#organization",
        "name": "Express English Hub",
        "alternateName": "EEH",
        "description": "Platform persiapan TOEFL ITP dan TOEFL iBT terbaik di Indonesia dengan trainer bersertifikat ETS dan metode pembelajaran terintegrasi AI.",
        "url": "https://expressenglishhub.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://expressenglishhub.com/logo.jpg",
          "width": 512,
          "height": 512
        },
        "image": "https://expressenglishhub.com/logo.jpg",
        "sameAs": [
          "https://www.facebook.com/ExpressEnglishHub",
          "https://www.instagram.com/expressenglishhub",
          "https://www.youtube.com/@ExpressEnglishHub",
          "https://www.linkedin.com/company/express-english-hub"
        ],
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+62-21-XXXX-XXXX",
            "contactType": "customer service",
            "availableLanguage": ["Indonesian", "English"],
            "areaServed": "ID"
          }
        ],
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "ID",
          "addressLocality": "Jakarta",
          "addressRegion": "DKI Jakarta"
        },
        "foundingDate": "2020",
        "numberOfEmployees": "25-50",
        "slogan": "Your Gateway to Global Opportunities"
      },
      {
        "@type": "WebSite",
        "@id": "https://expressenglishhub.com/#website",
        "url": "https://expressenglishhub.com",
        "name": "Express English Hub - TOEFL Preparation Platform",
        "description": "Platform persiapan TOEFL ITP dan TOEFL iBT terbaik di Indonesia",
        "publisher": {
          "@id": "https://expressenglishhub.com/#organization"
        },
        "inLanguage": "id-ID",
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://expressenglishhub.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "WebPage",
        "@id": "https://expressenglishhub.com/#webpage",
        "url": "https://expressenglishhub.com",
        "name": "Express English Hub - Kursus TOEFL ITP & iBT Terbaik Indonesia",
        "isPartOf": {
          "@id": "https://expressenglishhub.com/#website"
        },
        "about": {
          "@id": "https://expressenglishhub.com/#organization"
        },
        "description": "Platform persiapan TOEFL ITP dan TOEFL iBT terbaik di Indonesia. Kursus online, tes simulasi, dan bimbingan ahli untuk raih skor target TOEFL Anda.",
        "breadcrumb": {
          "@id": "https://expressenglishhub.com/#breadcrumb"
        },
        "inLanguage": "id-ID"
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://expressenglishhub.com/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://expressenglishhub.com"
          }
        ]
      },
      {
        "@type": "EducationalOrganization",
        "name": "Express English Hub",
        "description": "Lembaga pendidikan bahasa Inggris yang fokus pada persiapan TOEFL ITP dan TOEFL iBT",
        "hasCredential": [
          {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "TOEFL ITP Official Test Center",
            "recognizedBy": {
              "@type": "Organization",
              "name": "Educational Testing Service (ETS)"
            }
          }
        ],
        "educationalCredentialAwarded": "TOEFL ITP Certificate",
        "offers": [
          {
            "@type": "Course",
            "name": "TOEFL ITP Preparation Course",
            "description": "Kursus persiapan TOEFL ITP dengan trainer bersertifikat",
            "provider": {
              "@id": "https://expressenglishhub.com/#organization"
            },
            "courseMode": ["online", "blended"],
            "educationalLevel": "intermediate",
            "teaches": ["Reading Comprehension", "Listening Comprehension", "Structure and Written Expression"]
          },
          {
            "@type": "Course",
            "name": "TOEFL iBT Preparation Course",
            "description": "Kursus persiapan TOEFL iBT untuk studi luar negeri",
            "provider": {
              "@id": "https://expressenglishhub.com/#organization"
            },
            "courseMode": ["online", "blended"],
            "educationalLevel": "intermediate",
            "teaches": ["Reading", "Listening", "Speaking", "Writing"]
          }
        ]
      }
    ]
  });

  const generateCourseSchema = () => {
    if (!courseData) return null;

    return {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": courseData.name,
      "description": courseData.description,
      "provider": {
        "@type": "Organization",
        "name": courseData.provider,
        "url": "https://expressenglishhub.com"
      },
      "courseCode": courseData.category.replace(' ', '_').toLowerCase(),
      "educationalLevel": courseData.level || "intermediate",
      "courseMode": "online",
      "teaches": courseData.skills || [],
      "inLanguage": "id-ID",
      "availableLanguage": ["id-ID", "en-US"],
      "timeRequired": courseData.duration,
      "coursePrerequisites": "Basic English proficiency",
      "educationalCredentialAwarded": `${courseData.category} Certificate`,
      "aggregateRating": courseData.rating ? {
        "@type": "AggregateRating",
        "ratingValue": courseData.rating.value,
        "reviewCount": courseData.rating.count,
        "bestRating": 5,
        "worstRating": 1
      } : undefined,
      "offers": courseData.price ? {
        "@type": "Offer",
        "price": courseData.price.replace(/[^\d]/g, ''),
        "priceCurrency": courseData.currency || "IDR",
        "availability": "https://schema.org/InStock",
        "validFrom": new Date().toISOString(),
        "category": "Education"
      } : undefined,
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "online",
        "instructor": {
          "@type": "Person",
          "name": "Express English Hub Certified Trainers",
          "jobTitle": "TOEFL Specialist"
        }
      }
    };
  };

  const generateArticleSchema = () => {
    if (!articleData) return null;

    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": articleData.title,
      "description": articleData.description,
      "author": {
        "@type": "Person",
        "name": articleData.author
      },
      "publisher": {
        "@type": "Organization",
        "name": "Express English Hub",
        "logo": {
          "@type": "ImageObject",
          "url": "https://expressenglishhub.com/logo.jpg"
        }
      },
      "datePublished": articleData.publishDate,
      "dateModified": articleData.modifiedDate || articleData.publishDate,
      "image": articleData.image ? {
        "@type": "ImageObject",
        "url": articleData.image
      } : undefined,
      "articleSection": articleData.category,
      "keywords": articleData.tags?.join(', '),
      "inLanguage": "id-ID",
      "about": {
        "@type": "Thing",
        "name": "TOEFL Preparation"
      }
    };
  };

  const generateFAQSchema = () => {
    if (!faqData || !faqData.questions.length) return null;

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.questions.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  };

  const generateOrganizationSchema = () => {
    if (!organizationData) return null;

    return {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": organizationData.name,
      "description": organizationData.description,
      "logo": organizationData.logo,
      "address": organizationData.address ? {
        "@type": "PostalAddress",
        "streetAddress": organizationData.address,
        "addressCountry": "ID"
      } : undefined,
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": organizationData.phone,
        "email": organizationData.email,
        "contactType": "customer service"
      },
      "sameAs": organizationData.socialMedia || []
    };
  };

  const generateLocalBusinessSchema = () => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Express English Hub",
    "image": "https://expressenglishhub.com/logo.jpg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jalan Sudirman",
      "addressLocality": "Jakarta",
      "addressRegion": "DKI Jakarta",
      "postalCode": "10220",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -6.2088,
      "longitude": 106.8456
    },
    "telephone": "+62-21-XXXX-XXXX",
    "email": "info@expressenglishhub.com",
    "url": "https://expressenglishhub.com",
    "openingHours": ["Mo-Fr 08:00-18:00", "Sa 09:00-15:00"],
    "priceRange": "$$",
    "servesCuisine": "Education",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": 4.8,
      "reviewCount": 150
    }
  });

  const getSchema = () => {
    switch (pageType) {
      case 'homepage':
        return generateHomepageSchema();
      case 'course':
        return generateCourseSchema();
      case 'organization':
        return generateOrganizationSchema();
      case 'article':
        return generateArticleSchema();
      case 'faq':
        return generateFAQSchema();
      case 'contact':
        return generateLocalBusinessSchema();
      default:
        return generateHomepageSchema();
    }
  };

  const schema = getSchema();

  React.useEffect(() => {
    if (!schema) return;

    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const scriptElement = document.querySelector('script[type="application/ld+json"]');
      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, [schema]);

  return null;
};

export default SemanticSEO;
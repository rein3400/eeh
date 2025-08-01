import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics configuration
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your actual GA4 Measurement ID
// TODO: Ganti GA_MEASUREMENT_ID dengan ID Google Analytics asli sebelum deploy production!

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Initialize Google Analytics
export const initGA = () => {
  // Only initialize in production or when GA_MEASUREMENT_ID is set
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    console.log('Google Analytics not initialized - no measurement ID provided');
    return;
  }

  // Create script tag for Google Analytics
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  // Configure Google Analytics
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
    send_page_view: true,
    // Enhanced ecommerce and user engagement
    custom_map: {
      custom_parameter: 'toefl_course_type'
    },
    // Cookie settings
    cookie_flags: 'SameSite=None;Secure',
    // User properties
    user_properties: {
      platform: 'web',
      course_interest: 'toefl'
    }
  });

  console.log('Google Analytics initialized with ID:', GA_MEASUREMENT_ID);
};

// Track page views
export const pageView = (url: string, title?: string) => {
  if (typeof window.gtag !== 'function') return;
  
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: title || document.title,
    page_location: url,
    send_page_view: true
  });
};

// Track events
export const trackEvent = (eventName: string, parameters?: {
  event_category?: string;
  event_label?: string;
  value?: number;
  course_type?: string;
  user_engagement?: string;
  [key: string]: any;
}) => {
  if (typeof window.gtag !== 'function') return;

  window.gtag('event', eventName, {
    event_category: parameters?.event_category || 'general',
    event_label: parameters?.event_label,
    value: parameters?.value,
    // Custom dimensions for TOEFL platform
    course_type: parameters?.course_type,
    user_engagement: parameters?.user_engagement,
    timestamp: new Date().toISOString(),
    ...parameters
  });
};

// Track specific TOEFL events
export const trackTOEFLEvent = {
  // Course registration events
  courseRegistration: (courseType: 'ITP' | 'iBT', packageName: string) => {
    trackEvent('course_registration', {
      event_category: 'course',
      event_label: packageName,
      course_type: courseType,
      value: courseType === 'iBT' ? 2000000 : 600000 // Approximate course value
    });
  },

  // Test preparation events
  practiceTestStart: (testType: 'ITP' | 'iBT', section: string) => {
    trackEvent('practice_test_start', {
      event_category: 'learning',
      event_label: `${testType}_${section}`,
      course_type: testType,
      user_engagement: 'high'
    });
  },

  practiceTestComplete: (testType: 'ITP' | 'iBT', section: string, score: number) => {
    trackEvent('practice_test_complete', {
      event_category: 'learning',
      event_label: `${testType}_${section}`,
      course_type: testType,
      value: score,
      user_engagement: 'high'
    });
  },

  // User engagement events
  videoWatch: (videoTitle: string, watchTime: number) => {
    trackEvent('video_engagement', {
      event_category: 'content',
      event_label: videoTitle,
      value: Math.round(watchTime),
      user_engagement: watchTime > 300 ? 'high' : watchTime > 60 ? 'medium' : 'low'
    });
  },

  // Form submissions
  contactForm: (formType: 'contact' | 'registration' | 'consultation') => {
    trackEvent('form_submit', {
      event_category: 'lead_generation',
      event_label: formType,
      user_engagement: 'high'
    });
  },

  // Content interactions
  downloadResource: (resourceName: string, resourceType: 'pdf' | 'audio' | 'video') => {
    trackEvent('download', {
      event_category: 'content',
      event_label: resourceName,
      file_type: resourceType,
      user_engagement: 'medium'
    });
  },

  // Navigation and search
  siteSearch: (searchTerm: string, resultsCount: number) => {
    trackEvent('search', {
      event_category: 'navigation',
      event_label: searchTerm,
      value: resultsCount,
      search_term: searchTerm
    });
  },

  // Social sharing
  socialShare: (platform: string, contentType: string, contentTitle: string) => {
    trackEvent('share', {
      event_category: 'social',
      event_label: `${platform}_${contentType}`,
      content_title: contentTitle,
      share_platform: platform
    });
  }
};

// Enhanced ecommerce tracking for course purchases
export const trackPurchase = (transactionId: string, courseDetails: {
  courseType: 'ITP' | 'iBT';
  courseName: string;
  price: number;
  currency?: string;
}) => {
  if (typeof window.gtag !== 'function') return;

  window.gtag('event', 'purchase', {
    transaction_id: transactionId,
    value: courseDetails.price,
    currency: courseDetails.currency || 'IDR',
    items: [{
      item_id: `toefl_${courseDetails.courseType.toLowerCase()}`,
      item_name: courseDetails.courseName,
      category: 'TOEFL Course',
      quantity: 1,
      price: courseDetails.price,
      item_brand: 'Express English Hub',
      item_category: 'Education',
      item_category2: `TOEFL ${courseDetails.courseType}`,
      course_type: courseDetails.courseType
    }]
  });
};

// Track user properties and custom dimensions
export const setUserProperties = (properties: {
  user_id?: string;
  course_level?: 'beginner' | 'intermediate' | 'advanced';
  target_score?: number;
  preferred_course?: 'ITP' | 'iBT' | 'both';
  study_mode?: 'self_paced' | 'instructor_led' | 'hybrid';
}) => {
  if (typeof window.gtag !== 'function') return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    user_id: properties.user_id,
    custom_map: {
      course_level: properties.course_level,
      target_score: properties.target_score,
      preferred_course: properties.preferred_course,
      study_mode: properties.study_mode
    }
  });
};

// Hook for automatic page view tracking
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view when location changes
    const url = window.location.origin + location.pathname + location.search;
    pageView(url);
    
    // Track specific page types
    const path = location.pathname;
    let pageType = 'general';
    
    if (path === '/') pageType = 'homepage';
    else if (path.includes('/toefl-itp')) pageType = 'toefl_itp';
    else if (path.includes('/toefl-ibt')) pageType = 'toefl_ibt';
    else if (path.includes('/products')) pageType = 'products';
    else if (path.includes('/contact')) pageType = 'contact';
    else if (path.includes('/blog')) pageType = 'blog';
    else if (path.includes('/eeh-admin')) pageType = 'admin';

    trackEvent('page_view', {
      event_category: 'navigation',
      event_label: path,
      page_type: pageType
    });

  }, [location]);
};

// Performance tracking
export const trackPerformance = () => {
  if (typeof window === 'undefined' || !window.performance) return;

  // Track Core Web Vitals
  const trackWebVital = (name: string, value: number) => {
    trackEvent('web_vital', {
      event_category: 'performance',
      event_label: name,
      value: Math.round(value),
      metric_name: name
    });
  };

  // Largest Contentful Paint (LCP)
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    trackWebVital('LCP', lastEntry.startTime);
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // First Input Delay (FID)
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      trackWebVital('FID', entry.processingStart - entry.startTime);
    });
  }).observe({ entryTypes: ['first-input'] });

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    });
    trackWebVital('CLS', clsValue);
  }).observe({ entryTypes: ['layout-shift'] });
};

export default {
  initGA,
  pageView,
  trackEvent,
  trackTOEFLEvent,
  trackPurchase,
  setUserProperties,
  usePageTracking,
  trackPerformance
};
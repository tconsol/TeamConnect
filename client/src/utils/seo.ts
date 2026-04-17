/**
 * SEO utilities for generating meta tags and structured data
 */

export const getCanonicalUrl = (pathname: string) => {
  const baseUrl = 'https://tconsolutions.com';
  return `${baseUrl}${pathname}`;
};

export const generateJsonLd = (data: {
  '@context'?: string;
  '@type': string;
  [key: string]: any;
}) => {
  return {
    '@context': 'https://schema.org',
    ...data,
  };
};

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TCON Solutions',
  url: 'https://tconsolutions.com',
  logo: 'https://tconsolutions.com/logo.svg',
  description: 'Premium software development, web applications, and digital products for forward-thinking businesses.',
  sameAs: [
    'https://www.facebook.com/tconsolutions',
    'https://twitter.com/tconsolutions',
    'https://www.linkedin.com/company/tconsolutions',
  ],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
  },
};

export const breadcrumbJsonLd = (items: Array<{ name: string; url: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

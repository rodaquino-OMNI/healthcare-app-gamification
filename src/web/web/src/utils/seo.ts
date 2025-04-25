import { NextSeo } from 'next-seo'; // next-seo 5.15.0

/**
 * Generates SEO metadata for a given page, including title, description, and Open Graph properties.
 * 
 * @param title - The title of the page
 * @param description - The description of the page
 * @param imageUrl - The URL of the image to use for Open Graph
 * @param route - The route of the page
 * @returns The NextSeo component with the generated metadata
 */
export const generateSeoMetadata = (
  title: string,
  description: string,
  imageUrl: string,
  route: string
): JSX.Element => {
  // Ensure the route has a leading slash
  const normalizedRoute = route.startsWith('/') ? route : `/${route}`;
  
  // Construct the full URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://app.austa.com.br';
  const fullUrl = `${baseUrl}${normalizedRoute}`;
  
  // Define the Open Graph metadata
  const openGraph = {
    title,
    description,
    type: 'website',
    url: fullUrl,
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
    site_name: 'AUSTA SuperApp',
  };
  
  // Return the NextSeo component with the generated metadata
  return (
    <NextSeo
      title={title}
      description={description}
      openGraph={openGraph}
      canonical={fullUrl}
      twitter={{
        handle: '@AUSTAapp',
        site: '@AUSTAapp',
        cardType: 'summary_large_image',
      }}
      additionalMetaTags={[
        {
          name: 'application-name',
          content: 'AUSTA SuperApp',
        },
        {
          name: 'apple-mobile-web-app-capable',
          content: 'yes',
        },
        {
          name: 'theme-color',
          content: '#0066CC',
        },
      ]}
    />
  );
};
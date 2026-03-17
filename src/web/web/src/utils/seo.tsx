import Head from 'next/head';
import React from 'react';

/**
 * Generates SEO metadata for a given page, including title, description, and Open Graph properties.
 *
 * @param title - The title of the page
 * @param description - The description of the page
 * @param imageUrl - The URL of the image to use for Open Graph
 * @param route - The route of the page
 * @returns The Head component with the generated metadata
 */
export const generateSeoMetadata = (
    title: string,
    description: string,
    imageUrl: string,
    route: string
): React.ReactElement => {
    // Ensure the route has a leading slash
    const normalizedRoute = route.startsWith('/') ? route : `/${route}`;

    // Construct the full URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://app.austa.com.br';
    const fullUrl = `${baseUrl}${normalizedRoute}`;

    // Return the Head component with the generated metadata
    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={fullUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={title} />
            <meta property="og:site_name" content="AUSTA SuperApp" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@AUSTAapp" />
            <meta name="twitter:creator" content="@AUSTAapp" />
            <meta name="application-name" content="AUSTA SuperApp" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="theme-color" content="#0066CC" />
        </Head>
    );
};

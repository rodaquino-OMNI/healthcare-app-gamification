import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';
import { ServerStyleSheet } from 'styled-components'; // styled-components@6.0+

/**
 * Custom Document component that extends Next.js Document to enhance the HTML structure.
 * Handles server-side rendering of styled-components and sets up proper document
 * structure with appropriate meta tags and accessibility attributes.
 *
 * CSP nonce: the middleware generates a per-request nonce and forwards it via the
 * `x-nonce` request header. We read it here and pass it to <NextScript> so that
 * Next.js framework scripts carry the correct nonce attribute, satisfying the
 * nonce-based `script-src` directive in the Content-Security-Policy.
 */
class MyDocument extends Document<{ nonce: string }> {
    /**
     * Collect and inject styled-components styles during server-side rendering.
     * This prevents the "flash of unstyled content" that would otherwise occur
     * when the JavaScript loads.
     *
     * Also extracts the CSP nonce forwarded by middleware via x-nonce so it can
     * be threaded through to <NextScript>.
     */
    static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps & { nonce: string }> {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;

        // Read nonce forwarded by middleware.ts via the x-nonce request header.
        // Falls back to empty string when rendering outside a real request (e.g. static export).
        const nonce: string = (ctx.req?.headers?.['x-nonce'] as string) ?? '';

        try {
            // Render the app and collect styles
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
                });

            // Run the parent getInitialProps
            const initialProps = await Document.getInitialProps(ctx);

            // Return the initial props with styled-components styles and nonce
            return {
                ...initialProps,
                nonce,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            };
        } finally {
            // Always make sure to release the sheet to prevent memory leaks
            sheet.seal();
        }
    }

    render(): React.ReactElement {
        // this.props.nonce is populated by getInitialProps above
        const { nonce } = this.props;

        return (
            // Set primary language to Brazilian Portuguese
            <Html lang="pt-BR">
                <Head nonce={nonce}>
                    {/* Character set and viewport meta tags */}
                    <meta charSet="utf-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover"
                    />

                    {/* Essential meta tags */}
                    <meta name="application-name" content="AUSTA SuperApp" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                    <meta name="apple-mobile-web-app-title" content="AUSTA SuperApp" />
                    <meta name="format-detection" content="telephone=no" />
                    <meta name="mobile-web-app-capable" content="yes" />
                    <meta name="theme-color" content="#FFFFFF" />

                    {/* Accessibility meta tags */}
                    <meta
                        name="description"
                        content="AUSTA SuperApp - Transformando saúde digital com jornadas unificadas"
                    />

                    {/* Preconnect to domains that will be used */}
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

                    {/* Roboto font as specified in the design system */}
                    <link
                        href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
                        rel="stylesheet"
                    />

                    {/* Roboto Mono for monospace content */}
                    <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap" rel="stylesheet" />

                    {/* Favicon and other icons */}
                    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                    <link rel="manifest" href="/manifest.json" />
                </Head>
                <body>
                    {/* Skip to content link for accessibility */}
                    <a href="#main-content" className="skip-link">
                        Pular para o conteúdo
                    </a>
                    <Main />
                    {/* nonce allows Next.js framework scripts to satisfy the CSP nonce directive */}
                    <NextScript nonce={nonce} />
                </body>
            </Html>
        );
    }
}

export default MyDocument;

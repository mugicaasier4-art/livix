import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
    title: string;
    description: string;
    canonical?: string;
    ogImage?: string;
    structuredData?: object;
    noIndex?: boolean;
}

export const SEOHead = ({
    title,
    description,
    canonical,
    ogImage = "/og-default.jpg",
    structuredData,
    noIndex = false
}: SEOHeadProps) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            {noIndex && <meta name="robots" content="noindex, nofollow" />}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            {canonical && <link rel="canonical" href={canonical} />}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
};

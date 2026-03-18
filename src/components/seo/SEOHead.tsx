import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
    title: string;
    description: string;
    canonical?: string;
    ogImage?: string;
    ogType?: string;
    structuredData?: object | object[];
    noIndex?: boolean;
}

export const SEOHead = ({
    title,
    description,
    canonical,
    ogImage = "https://livix.es/og-livix.jpg",
    ogType = "website",
    structuredData,
    noIndex = false
}: SEOHeadProps) => {
    const structuredDataArray = structuredData
        ? Array.isArray(structuredData) ? structuredData : [structuredData]
        : [];

    const ogUrl = canonical || (typeof window !== "undefined" ? window.location.href : "https://livix.es/");

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            {noIndex && <meta name="robots" content="noindex, nofollow" />}

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:type" content={ogType} />
            <meta property="og:site_name" content="Livix" />
            <meta property="og:locale" content="es_ES" />
            <meta property="og:url" content={ogUrl} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@livix_es" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {canonical && <link rel="canonical" href={canonical} />}

            {structuredDataArray.map((data, index) => (
                <script key={index} type="application/ld+json">
                    {JSON.stringify(data)}
                </script>
            ))}
        </Helmet>
    );
};

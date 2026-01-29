import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

interface BreadcrumbItem {
    label: string;
    path: string;
}

interface BreadcrumbSEOProps {
    items: BreadcrumbItem[];
}

export const BreadcrumbSEO = ({ items }: BreadcrumbSEOProps) => {
    const breadcrumbList = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.label,
            "item": `https://livix.es${item.path}`
        }))
    };

    return (
        <>
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbList)}
                </script>
            </Helmet>

            <nav className="text-sm mb-6 flex items-center flex-wrap gap-2 text-muted-foreground">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <div key={item.path} className="flex items-center">
                            {index > 0 && <span className="mx-2">/</span>}
                            {isLast ? (
                                <span className="font-medium text-foreground">{item.label}</span>
                            ) : (
                                <Link to={item.path} className="hover:underline hover:text-foreground transition-colors">
                                    {item.label}
                                </Link>
                            )}
                        </div>
                    );
                })}
            </nav>
        </>
    );
};

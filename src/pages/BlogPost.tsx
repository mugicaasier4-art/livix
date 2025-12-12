import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import DOMPurify from "dompurify";
import Layout from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Clock, ArrowRight } from "lucide-react";
import { blogPosts, categories } from "@/data/blogContent";
import { analytics } from "@/utils/analytics";

// Markdown to HTML converter (sanitized with DOMPurify)
const renderMarkdown = (content: string): string => {
  let html = content;
  
  // Escape HTML first (for safety)
  // But we need to preserve our markdown syntax
  
  // Headers
  html = html.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-foreground mt-10 mb-4 pb-2 border-b border-border">$1</h2>');
  html = html.replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-foreground mt-8 mb-3">$1</h3>');
  
  // Bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
  
  // Emoji warnings
  html = html.replace(/^⚠️ (.*$)/gm, '<div class="bg-amber-500/10 border-l-4 border-amber-500 text-foreground p-4 rounded-r-lg my-4"><span class="mr-2">⚠️</span>$1</div>');
  html = html.replace(/^❌ (.*$)/gm, '<div class="text-destructive flex items-center gap-2 my-2"><span>❌</span><span>$1</span></div>');
  html = html.replace(/^✅ (.*$)/gm, '<div class="text-green-600 flex items-center gap-2 my-2"><span>✅</span><span>$1</span></div>');
  
  // Tables - process before other replacements
  const tableRegex = /(\|.*\|[\r\n]+)+/g;
  html = html.replace(tableRegex, (tableBlock) => {
    const rows = tableBlock.trim().split('\n').filter(row => row.trim());
    if (rows.length < 2) return tableBlock;
    
    let tableHtml = '<div class="overflow-x-auto my-6"><table class="w-full border-collapse border border-border rounded-lg overflow-hidden">';
    
    rows.forEach((row, index) => {
      // Skip separator row (|---|---|)
      if (row.match(/^\|[\s-:|]+\|$/)) return;
      
      const cells = row.split('|').filter(c => c.trim() !== '');
      const isHeader = index === 0;
      const cellTag = isHeader ? 'th' : 'td';
      const cellClass = isHeader 
        ? 'bg-secondary text-foreground font-semibold p-3 text-left border-b border-border'
        : 'p-3 text-muted-foreground border-b border-border';
      
      tableHtml += '<tr>';
      cells.forEach(cell => {
        tableHtml += `<${cellTag} class="${cellClass}">${cell.trim()}</${cellTag}>`;
      });
      tableHtml += '</tr>';
    });
    
    tableHtml += '</table></div>';
    return tableHtml;
  });
  
  // Lists - unordered
  html = html.replace(/^- (.*$)/gm, '<li class="text-muted-foreground ml-4 mb-2">$1</li>');
  html = html.replace(/(<li.*<\/li>\n?)+/g, (match) => {
    if (!match.includes('class="text-muted-foreground ml-4')) return match;
    return `<ul class="list-disc pl-6 my-4 space-y-1">${match}</ul>`;
  });
  
  // Lists - ordered
  html = html.replace(/^\d+\. (.*$)/gm, '<li class="text-muted-foreground ml-4 mb-2">$1</li>');
  
  // Paragraphs - split by double newlines
  const sections = html.split(/\n\n+/);
  html = sections.map(section => {
    const trimmed = section.trim();
    // Don't wrap if it's already a block element
    if (trimmed.startsWith('<h') || 
        trimmed.startsWith('<ul') || 
        trimmed.startsWith('<ol') || 
        trimmed.startsWith('<table') ||
        trimmed.startsWith('<div') ||
        trimmed.startsWith('<li')) {
      return trimmed;
    }
    // Wrap in paragraph if it's text content
    if (trimmed.length > 0) {
      return `<p class="text-muted-foreground leading-relaxed mb-4">${trimmed}</p>`;
    }
    return '';
  }).join('\n');
  
  // Clean up extra newlines within paragraphs
  html = html.replace(/<p[^>]*>(\s*<\/p>)/g, '');
  
  return html;
};

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const post = blogPosts.find(p => p.id === Number(id));
  
  useEffect(() => {
    if (post) {
      analytics.track('blog_post_viewed', { postId: post.id, title: post.title });
      window.scrollTo(0, 0);
    }
  }, [post]);

  const renderedContent = useMemo(() => {
    if (!post) return '';
    const rawHtml = renderMarkdown(post.content);
    // Sanitize HTML to prevent XSS attacks
    return DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: ['h2', 'h3', 'p', 'ul', 'ol', 'li', 'strong', 'div', 'span', 'table', 'tr', 'th', 'td'],
      ALLOWED_ATTR: ['class'],
    });
  }, [post]);

  if (!post) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Artículo no encontrado</h1>
            <Button onClick={() => navigate('/blog')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al blog
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Get related posts (same category, excluding current)
  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 4);

  // If not enough related, add some from other categories
  const otherPosts = relatedPosts.length < 4 
    ? blogPosts
        .filter(p => p.id !== post.id && !relatedPosts.includes(p))
        .slice(0, 4 - relatedPosts.length)
    : [];

  const sidebarPosts = [...relatedPosts, ...otherPosts];

  const categoryLabel = categories.find(c => c.id === post.category)?.label || post.category;

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Image */}
        <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        <div className="container mx-auto px-4 -mt-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl">
                <CardContent className="p-8 md:p-12">
                  {/* Back button */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate('/blog')}
                    className="mb-6 -ml-2"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver al blog
                  </Button>

                  {/* Category */}
                  <Badge variant="secondary" className="mb-4">
                    {categoryLabel}
                  </Badge>

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                    {post.title}
                  </h1>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.date).toLocaleDateString('es-ES', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime} min de lectura</span>
                    </div>
                  </div>

                  {/* Content */}
                  <article 
                    className="blog-content"
                    dangerouslySetInnerHTML={{ __html: renderedContent }}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4">Artículos relacionados</h3>
                    <div className="space-y-4">
                      {sidebarPosts.map((relatedPost) => (
                        <Link 
                          key={relatedPost.id}
                          to={`/blog/${relatedPost.id}`}
                          className="group block"
                        >
                          <div className="flex gap-3">
                            <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={relatedPost.image} 
                                alt={relatedPost.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                {relatedPost.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {relatedPost.readTime} min
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t">
                      <Link 
                        to="/blog"
                        className="flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                      >
                        Ver todos los artículos
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* CTA Card */}
                <Card className="mt-6 bg-primary text-primary-foreground">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-bold text-lg mb-2">¿Buscas piso?</h3>
                    <p className="text-sm opacity-90 mb-4">
                      Encuentra tu habitación ideal en Zaragoza
                    </p>
                    <Button 
                      variant="secondary" 
                      className="w-full"
                      onClick={() => navigate('/explore')}
                    >
                      Explorar pisos
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-16" />
      </div>
    </Layout>
  );
};

export default BlogPost;

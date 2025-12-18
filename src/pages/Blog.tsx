import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight, Home, GraduationCap, Lightbulb, PartyPopper, Sparkles, Scale, Banknote, Clock, TrendingUp } from "lucide-react";
import { analytics } from "@/utils/analytics";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { blogPosts, categories, BlogCategory } from "@/data/blogContent";
import blogHeroCollage from "@/assets/blog/blog-hero-collage.jpg";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>("all");

  useEffect(() => {
    analytics.track('blog_viewed');
  }, []);

  const categoryIcons: Record<BlogCategory, React.ComponentType<{ className?: string }>> = {
    all: Sparkles,
    pisos: Home,
    legalidad: Scale,
    becas: Banknote,
    estudiante: GraduationCap,
    consejos: Lightbulb,
    eventos: PartyPopper,
  };

  const filteredPosts = selectedCategory === "all"
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  const [featuredPost, ...otherPosts] = filteredPosts;

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section with Collage Background */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          {/* Background Collage */}
          <div className="absolute inset-0">
            <img
              src={blogHeroCollage}
              alt="Estudiantes en pisos compartidos"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto text-center px-4 py-20">
            {/* 3D Text Title */}
            <div
              className="mb-8"
              style={{ perspective: '1000px' }}
            >
              <h1
                className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight text-white"
                style={{
                  transform: 'rotateX(10deg) rotateY(-5deg)',
                  textShadow: `
                    2px 2px 0 #000,
                    4px 4px 0 #000,
                    6px 6px 0 #000,
                    8px 8px 0 #000,
                    10px 10px 20px rgba(0,0,0,0.6)
                  `,
                }}
              >
                Blog Livix
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-foreground/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium mb-8">
              Consejos prácticos, guías y recursos para encontrar tu piso ideal y sobrevivir a la vida universitaria.
            </p>

            <Badge className="bg-primary text-primary-foreground shadow-lg text-base py-1.5 px-4">
              <TrendingUp className="h-4 w-4 mr-2" />
              Lo más leído por estudiantes
            </Badge>
          </div>
        </section>

        {/* Category Pills - Floating */}
        <section className="sticky top-16 z-40 py-4">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 p-1.5 bg-background/80 backdrop-blur-xl rounded-full border shadow-lg overflow-x-auto scrollbar-hide">
                {categories.map((category) => {
                  const Icon = categoryIcons[category.id];
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0",
                        selectedCategory === category.id
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {category.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post - Hero Card */}
        {featuredPost && (
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <Link to={`/blog/${featuredPost.id}`} className="block group">
                  <Card className="overflow-hidden border-0 bg-gradient-to-br from-muted/50 to-muted/30 hover:shadow-2xl transition-all duration-500">
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className="aspect-video md:aspect-auto md:min-h-[320px] overflow-hidden">
                        <img
                          src={featuredPost.image}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <CardContent className="p-6 md:p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                            {categories.find(c => c.id === featuredPost.category)?.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {featuredPost.readTime} min lectura
                          </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors mb-4 leading-tight">
                          {featuredPost.title}
                        </h2>
                        <p className="text-muted-foreground mb-6 line-clamp-3">
                          {featuredPost.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <span>{featuredPost.author}</span>
                          </div>
                          <span className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                            Leer más <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {otherPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherPosts.map((post, index) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.id}`}
                      className="group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-muted/50">
                        <div className="aspect-[16/10] overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <CardContent className="p-5 space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {categories.find(c => c.id === post.category)?.label}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {post.readTime} min
                            </span>
                          </div>

                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                            {post.title}
                          </h3>

                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {post.excerpt}
                          </p>

                          <div className="flex items-center justify-between pt-3 border-t border-muted/50">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(post.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                            </div>
                            <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg text-muted-foreground">
                    Próximamente más artículos en esta categoría
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                <h3 className="text-2xl font-bold mb-2">¿Quieres más consejos?</h3>
                <p className="text-muted-foreground mb-6">
                  Estamos preparando contenido exclusivo para ti
                </p>
                <Badge variant="outline" className="text-primary border-primary/30">
                  🚀 Próximamente newsletter
                </Badge>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Blog;


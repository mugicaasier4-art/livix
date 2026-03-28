import { Button } from "@/components/ui/button";
import { Link, Share2, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonsProps {
  title: string;
  text: string;
  url: string;
}

const ShareButtons = ({ title, text, url }: ShareButtonsProps) => {
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Enlace copiado al portapapeles");
    } catch {
      toast.error("No se pudo copiar el enlace");
    }
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title, text, url });
    } catch {
      // User cancelled or not supported
    }
  };

  const supportsNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div className="flex flex-row items-center gap-3">
      <Button
        asChild
        className="bg-[#25D366] hover:bg-[#1da851] text-white font-semibold px-6"
        size="lg"
      >
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="w-5 h-5 mr-2" />
          WhatsApp
        </a>
      </Button>

      <Button variant="outline" size="lg" onClick={handleCopyLink}>
        <Link className="w-5 h-5 mr-2" />
        Copiar enlace
      </Button>

      {supportsNativeShare && (
        <Button variant="outline" size="lg" onClick={handleNativeShare}>
          <Share2 className="w-5 h-5 mr-2" />
          Compartir
        </Button>
      )}
    </div>
  );
};

export default ShareButtons;

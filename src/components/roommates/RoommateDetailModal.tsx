
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MockRoommate } from "@/data/mockRoommates";
import {
    GraduationCap,
    MapPin,
    Calendar,
    Sparkles,
    MessageCircle,
    Cigarette,
    PawPrint,
    Heart,
    CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RoommateDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    roommate: MockRoommate | null;
}

const RoommateDetailModal = ({ isOpen, onClose, roommate }: RoommateDetailModalProps) => {
    if (!roommate) return null;

    const handleContact = () => {
        toast.success(`Solicitud de contacto enviada a ${roommate.name}`);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto p-0 gap-0 rounded-[2rem] border-none shadow-2xl">
                {/* Header with cover photo */}
                <div className="relative h-48 w-full bg-gradient-to-br from-primary/20 to-primary/10">
                    <img
                        src={roommate.image}
                        alt={roommate.name}
                        className="w-full h-full object-cover opacity-50 blur-sm scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />

                    {/* Avatar overlap */}
                    <div className="absolute -bottom-12 left-8 p-1.5 bg-background rounded-full shadow-xl">
                        <Avatar className="h-24 w-24 border-4 border-background">
                            <AvatarImage src={roommate.image} alt={roommate.name} className="object-cover" />
                            <AvatarFallback className="text-2xl bg-primary/10 text-primary">{roommate.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <div className="px-8 pt-16 pb-8 space-y-8">
                    {/* Header Info */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-black text-foreground flex items-center gap-3">
                                {roommate.name}, {roommate.age}
                                {roommate.verified && (
                                    <Badge className="bg-primary text-white border-0 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                                        Verificado
                                    </Badge>
                                )}
                            </h2>
                            <div className="flex items-center gap-2 mt-2 text-muted-foreground font-medium">
                                <GraduationCap className="w-4 h-4 text-primary" />
                                <span>{roommate.studies} en {roommate.university}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {roommate.tags.map((tag, i) => (
                            <Badge
                                key={i}
                                variant="secondary"
                                className={
                                    i === 0
                                        ? "bg-red-50 text-red-600 border-0"
                                        : "bg-blue-50 text-blue-600 border-0"
                                }
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    {/* Bio Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Sobre mí</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {roommate.bio}
                        </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-3xl border border-border/10">
                            <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Zona preferida</p>
                                <p className="font-bold text-sm">{roommate.location}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-3xl border border-border/10">
                            <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Mudanza</p>
                                <p className="font-bold text-sm">{roommate.moveDate}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-3xl border border-border/10">
                            <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Género</p>
                                <p className="font-bold text-sm">{roommate.gender}</p>
                            </div>
                        </div>
                    </div>

                    {/* Habits */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Estilo de vida</h3>
                        <div className="flex gap-4">
                            <Badge variant="outline" className="flex gap-1.5 py-1.5 px-3">
                                <Cigarette className="w-4 h-4" />
                                {roommate.smoking}
                            </Badge>
                            <Badge variant="outline" className="flex gap-1.5 py-1.5 px-3">
                                <PawPrint className="w-4 h-4" />
                                {roommate.pets}
                            </Badge>
                        </div>
                    </div>

                    {/* Interests */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Intereses</h3>
                        <div className="flex flex-wrap gap-2">
                            {roommate.interests.map((interest) => (
                                <Badge key={interest} variant="secondary" className="bg-primary/5 hover:bg-primary/10 text-primary border-primary/20">
                                    {interest}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 flex gap-4">
                        <Button className="flex-1 h-14 rounded-2xl text-base font-bold shadow-xl shadow-primary/20 transition-all active:scale-95" onClick={handleContact}>
                            <MessageCircle className="w-5 h-5 mr-3" />
                            Enviar mensaje
                        </Button>
                        <Button variant="outline" className="h-14 w-14 p-0 rounded-2xl border-muted transition-all active:scale-95">
                            <Heart className="w-6 h-6 text-primary" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RoommateDetailModal;

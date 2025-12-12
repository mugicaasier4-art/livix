import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Copy, UserPlus, LogOut, Sparkles } from 'lucide-react';
import { useSquads } from '@/hooks/useSquads';
import { toast } from 'sonner';

const SquadCard = () => {
  const { mySquad, squadMembers, isLoading, createSquad, joinSquad, leaveSquad } = useSquads();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [squadName, setSquadName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateSquad = async () => {
    if (!squadName.trim()) {
      toast.error('Por favor ingresa un nombre para el squad');
      return;
    }

    setIsSubmitting(true);
    try {
      await createSquad(squadName);
      setShowCreateDialog(false);
      setSquadName('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinSquad = async () => {
    if (!inviteCode.trim()) {
      toast.error('Por favor ingresa un código de invitación');
      return;
    }

    setIsSubmitting(true);
    try {
      await joinSquad(inviteCode);
      setShowJoinDialog(false);
      setInviteCode('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyInviteCode = () => {
    if (mySquad?.invite_code) {
      navigator.clipboard.writeText(mySquad.invite_code);
      toast.success('Código copiado al portapapeles');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  // Empty state - no squad
  if (!mySquad) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Tu Grupo de Convivencia
          </CardTitle>
          <CardDescription>
            Forma un squad con amigos para buscar piso juntos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center py-6">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              Aún no tienes un squad. ¡Crea uno o únete al de tus amigos!
            </p>
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="w-full" variant="default">
                <Users className="mr-2 h-4 w-4" />
                Crear Squad
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear un nuevo Squad</DialogTitle>
                <DialogDescription>
                  Dale un nombre a tu grupo de convivencia
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="squad-name">Nombre del Squad</Label>
                  <Input
                    id="squad-name"
                    placeholder="Los Fantásticos"
                    value={squadName}
                    onChange={(e) => setSquadName(e.target.value)}
                    maxLength={50}
                  />
                </div>
                <Button
                  onClick={handleCreateSquad}
                  disabled={isSubmitting || !squadName.trim()}
                  className="w-full"
                >
                  {isSubmitting ? 'Creando...' : 'Crear Squad'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
            <DialogTrigger asChild>
              <Button className="w-full" variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Unirme a un Squad
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Unirse a un Squad</DialogTitle>
                <DialogDescription>
                  Ingresa el código de invitación que te compartió tu amigo
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="invite-code">Código de Invitación</Label>
                  <Input
                    id="invite-code"
                    placeholder="LIVIX-1234"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    maxLength={10}
                  />
                </div>
                <Button
                  onClick={handleJoinSquad}
                  disabled={isSubmitting || !inviteCode.trim()}
                  className="w-full"
                >
                  {isSubmitting ? 'Uniéndose...' : 'Unirse al Squad'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  // Squad exists - show details
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          {mySquad.name}
        </CardTitle>
        <CardDescription>
          {squadMembers.length} miembro{squadMembers.length !== 1 ? 's' : ''} en el grupo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Members avatars */}
        <div className="flex items-center gap-2">
          {squadMembers.slice(0, 5).map((member) => (
            <Avatar key={member.id} className="h-10 w-10 border-2 border-background">
              <AvatarImage src={member.profiles?.avatar_url || undefined} />
              <AvatarFallback className="text-xs">
                {member.profiles?.name?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
          ))}
          {squadMembers.length > 5 && (
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              +{squadMembers.length - 5}
            </div>
          )}
        </div>

        {/* Invite code */}
        <div className="bg-muted p-3 rounded-lg space-y-2">
          <p className="text-xs text-muted-foreground font-medium">
            Código de invitación
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm font-mono bg-background px-3 py-2 rounded border">
              {mySquad.invite_code}
            </code>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopyInviteCode}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Actions */}
        <Button
          variant="outline"
          size="sm"
          className="w-full text-destructive hover:text-destructive"
          onClick={leaveSquad}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Salir del Squad
        </Button>
      </CardContent>
    </Card>
  );
};

export default SquadCard;

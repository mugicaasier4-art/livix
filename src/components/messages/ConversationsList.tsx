import React, { useState } from 'react';
import { Search, Archive, VolumeX, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useMessaging } from '@/contexts/MessagingContext';
import { useI18n } from '@/contexts/I18nContext';
import { MessageThread, MessageParticipant } from '@/data/messages';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

interface ThreadItemProps {
  thread: MessageThread;
  isActive: boolean;
  onClick: () => void;
  onArchive: () => void;
  onMute: () => void;
}

const ThreadItem = ({ thread, isActive, onClick, onArchive, onMute }: ThreadItemProps) => {
  const { user } = useAuth();
  const { language } = useI18n();
  const { isUserOnline } = useMessaging();
  
  // Get the other participant (not current user)
  const otherParticipant = thread.participants.find(p => p.id !== user?.id);
  if (!otherParticipant) return null;

  const isOnline = isUserOnline(otherParticipant.id);

  const formatTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { 
      addSuffix: true,
      locale: language === 'es' ? es : enUS 
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const truncateMessage = (text: string, maxLength: number = 60) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <div
      className={`group relative p-3 border-b border-border cursor-pointer transition-all hover:bg-accent/50 ${
        isActive ? 'bg-accent/70' : ''
      }`}
      onClick={onClick}
      role="option"
      aria-selected={isActive}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="text-sm bg-primary/10 text-primary font-medium">
              {getInitials(otherParticipant.name)}
            </AvatarFallback>
          </Avatar>
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
          )}
          {thread.unread_count > 0 && (
            <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
              {thread.unread_count > 9 ? '9+' : thread.unread_count}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm truncate">
                {otherParticipant.name}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {otherParticipant.role === 'landlord' ? 'Propietario' : 'Estudiante'}
              </Badge>
              {otherParticipant.verified && (
                <Badge variant="outline" className="text-xs">
                  Verificado
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {formatTime(thread.last_message.timestamp)}
            </span>
          </div>

          {/* Listing context */}
          <div className="text-xs text-muted-foreground mb-1">
            {thread.listing_title} • {thread.listing_neighborhood} • €{thread.listing_price}/mes
          </div>

          {/* Last message */}
          <p className={`text-sm line-clamp-2 ${thread.unread_count > 0 ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
            {truncateMessage(thread.last_message.text)}
          </p>

          {/* Badges */}
          <div className="flex gap-1 mt-2">
            {thread.listing_badges.slice(0, 2).map(badge => (
              <Badge key={badge} variant="outline" className="text-xs">
                {badge}
              </Badge>
            ))}
            {thread.is_muted && (
              <Badge variant="secondary" className="text-xs">
                <VolumeX className="h-3 w-3" />
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions (visible on hover) */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all flex gap-1 bg-background/90 backdrop-blur-sm rounded-lg p-1 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:bg-accent"
          onClick={(e) => {
            e.stopPropagation();
            onArchive();
          }}
          title="Archivar"
        >
          <Archive className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:bg-accent"
          onClick={(e) => {
            e.stopPropagation();
            onMute();
          }}
          title="Silenciar"
        >
          <VolumeX className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

const ConversationsList = () => {
  const { threads, isLoading, searchQuery, searchThreads, setActiveThread, activeThread, archiveThread, muteThread } = useMessaging();
  const { t } = useI18n();
  const [showArchived, setShowArchived] = useState(false);

  const displayThreads = showArchived 
    ? threads.filter(t => t.is_archived)
    : threads.filter(t => !t.is_archived);

  if (isLoading) {
    return (
      <div className="w-full border-r border-border">
        <div className="p-4 border-b border-border">
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="space-y-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 border-b border-border">
              <div className="flex items-start gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-1">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border-r border-border flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold">{t('messages.title')}</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowArchived(!showArchived)}
            className="text-xs h-8"
          >
            {showArchived ? 'Activos' : 'Archivados'}
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder={t('messages.search_placeholder')}
            value={searchQuery}
            onChange={(e) => searchThreads(e.target.value)}
            className="pl-10 h-10 rounded-full bg-muted/50 border-none focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Threads list */}
      <div className="flex-1 overflow-y-auto" role="listbox">
        {displayThreads.length === 0 ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">{t('messages.empty_title')}</h3>
            <p className="text-sm text-muted-foreground px-4">
              {t('messages.empty_description')}
            </p>
          </div>
        ) : (
          displayThreads.map((thread) => (
            <ThreadItem
              key={thread.id}
              thread={thread}
              isActive={activeThread?.id === thread.id}
              onClick={() => setActiveThread(thread.id)}
              onArchive={() => archiveThread(thread.id)}
              onMute={() => muteThread(thread.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationsList;
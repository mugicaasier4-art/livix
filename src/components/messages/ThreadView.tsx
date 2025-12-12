import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  MessageSquare, 
  Calendar, 
  FileText, 
  MoreVertical,
  ExternalLink,
  MapPin,
  Euro
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useMessaging } from '@/contexts/MessagingContext';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { Message } from '@/data/messages';
import { formatDistanceToNow, format, isSameDay, isToday, isYesterday } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { toast } from 'sonner';

const MessageBubble = ({ message, isOwn, showAvatar, participant, onImageLoad }: {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
  participant?: any;
  onImageLoad?: () => void;
}) => {
  const { language } = useI18n();
  
  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), 'HH:mm', {
      locale: language === 'es' ? es : enUS
    });
  };

  return (
    <div className={`flex gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {showAvatar && participant ? (
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {getInitials(participant.name)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-8" />
        )}
      </div>

      {/* Message content */}
      <div className={`max-w-[75%] md:max-w-[65%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`rounded-2xl px-3 py-2 shadow-sm ${
            isOwn
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-card border border-border rounded-bl-sm'
          } ${message.status === 'sending' ? 'opacity-70' : ''}`}
        >
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
            {message.text}
          </p>
          
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((attachment, idx) => {
                const isImage = attachment.type.startsWith('image/');
                return isImage ? (
                  <a
                    key={idx}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg overflow-hidden"
                  >
                    <img
                      src={attachment.url}
                      alt={attachment.name}
                      className="max-w-full h-auto max-h-64 object-cover"
                      onLoad={onImageLoad}
                    />
                  </a>
                ) : (
                  <a
                    key={idx}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                      isOwn 
                        ? 'bg-primary-foreground/10 hover:bg-primary-foreground/20' 
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    <FileText className="h-4 w-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{attachment.name}</p>
                      <p className="text-xs opacity-70">
                        {(attachment.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
          
          {/* Time inline for compact look */}
          <div className={`flex items-center justify-end gap-1 mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
            <span className="text-[10px]">
              {formatMessageTime(message.timestamp)}
            </span>
            {isOwn && (
              <span className="text-[10px]">
                {message.status === 'sending' && '○'}
                {message.status === 'sent' && '✓'}
                {message.status === 'seen' && '✓✓'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DateSeparator = ({ date }: { date: string }) => {
  const { language } = useI18n();
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return language === 'es' ? 'Hoy' : 'Today';
    }
    if (isYesterday(date)) {
      return language === 'es' ? 'Ayer' : 'Yesterday';
    }
    return format(date, 'dd MMM yyyy', {
      locale: language === 'es' ? es : enUS
    });
  };

  return (
    <div className="flex items-center justify-center my-4">
      <div className="bg-muted/60 backdrop-blur-sm rounded-full px-3 py-1">
        <span className="text-xs font-medium text-muted-foreground">
          {formatDate(date)}
        </span>
      </div>
    </div>
  );
};

const MessageComposer = () => {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { activeThread, sendMessage, startTyping, stopTyping } = useMessaging();
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const maxChars = 1000;
  const remainingChars = maxChars - message.length;

  const handleSend = async () => {
    if (!activeThread || !message.trim()) return;

    try {
      // Stop typing indicator when sending
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      stopTyping(activeThread.id);
      
      await sendMessage(activeThread.id, message);
      setMessage('');
    } catch (error) {
      toast.error('No se pudo enviar el mensaje. Reintentar.');
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    if (!activeThread) return;

    // Start typing indicator
    startTyping(activeThread.id);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(activeThread.id);
    }, 2000);
  };

  // Cleanup typing indicator on unmount
  useEffect(() => {
    return () => {
      if (activeThread && typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        stopTyping(activeThread.id);
      }
    };
  }, [activeThread]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate files
    const validFiles = files.filter(file => {
      const isValidType = file.type.match(/^(image\/(jpeg|jpg|png|webp)|application\/pdf)$/);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      
      if (!isValidType) {
        toast.error(`${file.name}: Tipo de archivo no válido`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name}: Archivo muy grande (máx. 10MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (activeThread) {
        await sendMessage(activeThread.id, message || 'Archivo adjunto', validFiles);
        setMessage('');
      }
    } catch (error) {
      toast.error('Error al subir archivos');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (!activeThread) return null;

  return (
    <div className="border-t border-border bg-background sticky bottom-0 pb-safe">
      <div className="p-3">
        {/* Character counter - only show when getting close to limit */}
        {remainingChars < 100 && (
          <div className="flex justify-end mb-2">
            <span className={`text-xs transition-colors ${remainingChars < 50 ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
              {remainingChars}
            </span>
          </div>
        )}

        <div className="flex gap-2 items-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex-shrink-0"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleMessageChange}
              onKeyDown={handleKeyDown}
              placeholder="Escribe un mensaje..."
              className="resize-none min-h-[44px] max-h-[120px] rounded-2xl pr-12"
              maxLength={maxChars}
            />
          </div>
          
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isUploading}
            size="icon"
            className="flex-shrink-0 rounded-full h-11 w-11"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

const ThreadView = () => {
  const { activeThread, messages, isTyping, isUserOnline } = useMessaging();
  const { user } = useAuth();
  const { t } = useI18n();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevThreadIdRef = useRef<string | null>(null);
  
  const otherParticipant = activeThread?.participants.find(p => p.id !== user?.id);
  const isOnline = otherParticipant ? isUserOnline(otherParticipant.id) : false;

  // Scroll helper
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Instant scroll when switching conversations
  useEffect(() => {
    if (activeThread && activeThread.id !== prevThreadIdRef.current) {
      scrollToBottom('instant');
      prevThreadIdRef.current = activeThread.id;
    }
  }, [activeThread?.id]);

  // Smooth scroll when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom('smooth');
    }
  }, [messages.length]);

  if (!activeThread) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/10">
        <div className="text-center px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <MessageSquare className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Tus mensajes</h3>
          <p className="text-muted-foreground max-w-sm">
            Selecciona una conversación para ver los mensajes o inicia una nueva conversación con propietarios.
          </p>
        </div>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups: { [key: string]: Message[] }, message) => {
    const date = format(new Date(message.timestamp), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border bg-background p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Contact info */}
            {otherParticipant && (
              <>
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {otherParticipant.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-medium">{otherParticipant.name}</h2>
                    {isOnline && (
                      <span className="text-xs text-green-600 dark:text-green-400">Online</span>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {otherParticipant.role === 'landlord' ? 'Propietario' : 'Estudiante'}
                    </Badge>
                    {otherParticipant.verified && (
                      <Badge variant="outline" className="text-xs">
                        Verificado
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isOnline ? 'Activo ahora' : `Responde en ~${otherParticipant.response_time_hours}h`} • {otherParticipant.languages.join(', ').toUpperCase()}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              {t('messages.schedule_visit')}
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              {t('messages.view_application')}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  {t('messages.archive')}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {t('messages.mute')}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  {t('messages.report')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Listing context */}
        <div className="mt-3 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="font-medium text-sm">{activeThread.listing_title}</h3>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {activeThread.listing_neighborhood}
                  </span>
                  <span className="flex items-center gap-1">
                    <Euro className="h-3 w-3" />
                    {activeThread.listing_price}/mes
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activeThread.listing_badges.slice(0, 3).map(badge => (
                <Badge key={badge} variant="outline" className="text-xs">
                  {badge}
                </Badge>
              ))}
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4 mr-1" />
                {t('messages.view_listing')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-muted/20">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">
                No hay mensajes aún. ¡Inicia la conversación!
              </p>
            </div>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, dayMessages]) => (
            <div key={date}>
              <DateSeparator date={dayMessages[0].timestamp} />
              {dayMessages.map((message, index) => {
                const isOwn = message.from_id === user?.id;
                const prevMessage = index > 0 ? dayMessages[index - 1] : null;
                const showAvatar = !isOwn && (!prevMessage || prevMessage.from_id !== message.from_id);
                
                return (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={isOwn}
                    showAvatar={showAvatar}
                    participant={otherParticipant}
                    onImageLoad={() => scrollToBottom('smooth')}
                  />
                );
              })}
            </div>
          ))
        )}
        
        {/* Typing indicator */}
        {activeThread && isTyping(activeThread.id) && otherParticipant && (
          <div className="flex gap-2 mb-2 animate-fade-in">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {otherParticipant.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }} />
                <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1s' }} />
                <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1s' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <MessageComposer />
    </div>
  );
};

export default ThreadView;
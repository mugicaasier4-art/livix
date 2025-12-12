import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConversationsList from '@/components/messages/ConversationsList';
import ThreadView from '@/components/messages/ThreadView';
import { useMessaging } from '@/contexts/MessagingContext';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Messages = () => {
  const { threadId } = useParams<{ threadId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setActiveThread, activeThread } = useMessaging();
  const isMobile = useIsMobile();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/messages');
      return;
    }
    
    // Only allow students and landlords
    if (user.role === 'admin') {
      navigate('/unauthorized');
      return;
    }
  }, [user, navigate]);

  // Handle thread selection from URL
  useEffect(() => {
    if (threadId) {
      setActiveThread(threadId);
    }
  }, [threadId, setActiveThread]);

  // Update URL when active thread changes
  useEffect(() => {
    if (activeThread) {
      if (isMobile) {
        navigate(`/messages/${activeThread.id}`, { replace: true });
      }
    } else if (threadId) {
      navigate('/messages', { replace: true });
    }
  }, [activeThread, navigate, isMobile, threadId]);

  if (!user || user.role === 'admin') {
    return null;
  }

  // Mobile: show only one panel at a time
  if (isMobile) {
    if (activeThread && threadId) {
      return (
        <div className="h-[100dvh] flex flex-col">
          <ThreadView />
        </div>
      );
    }
    
    return (
      <div className="h-[100dvh]">
        <ConversationsList />
      </div>
    );
  }

  // Desktop: split pane layout
  return (
    <div className="h-[100dvh] flex">
      <div className="w-80 flex-shrink-0">
        <ConversationsList />
      </div>
      <div className="flex-1">
        <ThreadView />
      </div>
    </div>
  );
};

export default Messages;
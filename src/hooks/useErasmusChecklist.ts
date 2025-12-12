import { useState, useEffect } from 'react';
import { erasmusChecklist, ChecklistSection } from '@/data/erasmus-checklist';

export interface ChecklistProgress {
  [sectionId: string]: {
    [itemId: string]: boolean;
  };
}

export const useErasmusChecklist = () => {
  const [progress, setProgress] = useState<ChecklistProgress>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load progress from localStorage (mock persistence)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('erasmus_checklist_progress');
      if (saved) {
        setProgress(JSON.parse(saved));
      } else {
        // Initialize empty progress
        const initialProgress: ChecklistProgress = {};
        erasmusChecklist.forEach(section => {
          initialProgress[section.id] = {};
          section.items.forEach(item => {
            initialProgress[section.id][item.id] = false;
          });
        });
        setProgress(initialProgress);
      }
    } catch (error) {
      console.error('Error loading checklist progress:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (newProgress: ChecklistProgress) => {
    try {
      localStorage.setItem('erasmus_checklist_progress', JSON.stringify(newProgress));
      setProgress(newProgress);
    } catch (error) {
      console.error('Error saving checklist progress:', error);
    }
  };

  const toggleItem = (sectionId: string, itemId: string) => {
    const newProgress = {
      ...progress,
      [sectionId]: {
        ...progress[sectionId],
        [itemId]: !progress[sectionId]?.[itemId]
      }
    };
    saveProgress(newProgress);
  };

  const getSectionProgress = (sectionId: string): { completed: number; total: number } => {
    const section = erasmusChecklist.find(s => s.id === sectionId);
    if (!section) return { completed: 0, total: 0 };

    const completed = section.items.filter(item => 
      progress[sectionId]?.[item.id] === true
    ).length;

    return { completed, total: section.items.length };
  };

  const getTotalProgress = (): { completed: number; total: number } => {
    let totalCompleted = 0;
    let totalItems = 0;

    erasmusChecklist.forEach(section => {
      const sectionProgress = getSectionProgress(section.id);
      totalCompleted += sectionProgress.completed;
      totalItems += sectionProgress.total;
    });

    return { completed: totalCompleted, total: totalItems };
  };

  const isItemCompleted = (sectionId: string, itemId: string): boolean => {
    return progress[sectionId]?.[itemId] === true;
  };

  const resetProgress = () => {
    const resetProgress: ChecklistProgress = {};
    erasmusChecklist.forEach(section => {
      resetProgress[section.id] = {};
      section.items.forEach(item => {
        resetProgress[section.id][item.id] = false;
      });
    });
    saveProgress(resetProgress);
  };

  return {
    progress,
    isLoading,
    toggleItem,
    getSectionProgress,
    getTotalProgress,
    isItemCompleted,
    resetProgress
  };
};
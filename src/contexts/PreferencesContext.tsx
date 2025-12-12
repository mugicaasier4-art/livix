import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// All preference factors for matching
export interface UserPreferences {
    // Sleep & Schedule
    sleepSchedule: 'madrugador' | 'intermedio' | 'nocturno'; // 6-7am | 11pm-12am | 1am+
    wakeUpTime: string; // "07:00", "10:00", etc.

    // Lifestyle
    cleanlinessLevel: 1 | 2 | 3 | 4 | 5; // 1=relajado, 5=muy ordenado
    noiseLevel: 'silencioso' | 'moderado' | 'social'; // Estudio en silencio | Música baja | Fiestas ocasionales
    smokingAllowed: boolean;
    petsAllowed: boolean;
    alcoholAllowed: boolean;

    // Social
    socialLevel: 'introvertido' | 'ambivertido' | 'extrovertido';
    guestsFrequency: 'nunca' | 'ocasional' | 'frecuente';
    partiesAllowed: boolean;

    // Academic
    faculty?: string;
    studyYear?: string;
    studyLocation: 'casa' | 'biblioteca' | 'ambos';

    // Budget
    budgetMin: number;
    budgetMax: number;

    // Living preferences
    genderPreference: 'cualquiera' | 'solo_chicos' | 'solo_chicas' | 'mixto';
    ageRangeMin: number;
    ageRangeMax: number;

    // Interests (tags)
    interests: string[];

    // Additional
    dietaryRestrictions?: string[]; // vegetariano, vegano, halal, etc.
    workSchedule?: 'estudia' | 'trabaja' | 'ambos';
    languagesSpoken?: string[];

    // Metadata
    completedAt?: string;
    version: number;
}

// Default preferences for new users
export const defaultPreferences: UserPreferences = {
    sleepSchedule: 'intermedio',
    wakeUpTime: '08:00',
    cleanlinessLevel: 3,
    noiseLevel: 'moderado',
    smokingAllowed: false,
    petsAllowed: true,
    alcoholAllowed: true,
    socialLevel: 'ambivertido',
    guestsFrequency: 'ocasional',
    partiesAllowed: false,
    studyLocation: 'ambos',
    budgetMin: 250,
    budgetMax: 500,
    genderPreference: 'cualquiera',
    ageRangeMin: 18,
    ageRangeMax: 35,
    interests: [],
    version: 1
};

// Available interest tags
export const interestTags = [
    'Deportes', 'Gaming', 'Música', 'Cine', 'Series', 'Lectura',
    'Cocina', 'Arte', 'Fotografía', 'Viajes', 'Gym', 'Yoga',
    'Senderismo', 'Fiestas', 'Estudiar juntos', 'Programación',
    'Idiomas', 'Voluntariado', 'Mascotas', 'Plantas'
];

// Dietary options
export const dietaryOptions = [
    'Vegetariano', 'Vegano', 'Sin gluten', 'Halal', 'Kosher', 'Sin lactosa'
];

interface PreferencesContextType {
    preferences: UserPreferences | null;
    isLoading: boolean;
    hasCompletedQuestionnaire: boolean;
    savePreferences: (prefs: Partial<UserPreferences>) => Promise<boolean>;
    resetPreferences: () => void;
    calculateMatchScore: (otherUser: UserPreferences) => number;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const PREFERENCES_KEY = 'livix_user_preferences';
const QUESTIONNAIRE_SHOWN_KEY = 'livix_questionnaire_shown';

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [preferences, setPreferences] = useState<UserPreferences | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load preferences on mount
    useEffect(() => {
        loadPreferences();
    }, [user]);

    const loadPreferences = async () => {
        setIsLoading(true);

        if (user) {
            // Try to load from Supabase first
            try {
                const { data, error } = await supabase
                    .from('user_preferences')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (data && !error) {
                    setPreferences(data.preferences as UserPreferences);
                    setIsLoading(false);
                    return;
                }
            } catch (e) {
                console.log('Preferences table may not exist, using localStorage');
            }
        }

        // Fall back to localStorage
        const stored = localStorage.getItem(`${PREFERENCES_KEY}_${user?.id || 'guest'}`);
        if (stored) {
            try {
                setPreferences(JSON.parse(stored));
            } catch {
                setPreferences(null);
            }
        }

        setIsLoading(false);
    };

    const savePreferences = async (prefs: Partial<UserPreferences>): Promise<boolean> => {
        const updated = {
            ...defaultPreferences,
            ...preferences,
            ...prefs,
            completedAt: new Date().toISOString(),
            version: 1
        };

        setPreferences(updated);

        // Save to localStorage always
        localStorage.setItem(`${PREFERENCES_KEY}_${user?.id || 'guest'}`, JSON.stringify(updated));

        // Try to save to Supabase if logged in
        if (user) {
            try {
                await supabase
                    .from('user_preferences')
                    .upsert({
                        user_id: user.id,
                        preferences: updated,
                        updated_at: new Date().toISOString()
                    });
            } catch (e) {
                console.log('Could not save to Supabase, saved locally');
            }
        }

        return true;
    };

    const resetPreferences = () => {
        setPreferences(null);
        localStorage.removeItem(`${PREFERENCES_KEY}_${user?.id || 'guest'}`);
        localStorage.removeItem(`${QUESTIONNAIRE_SHOWN_KEY}_${user?.id || 'guest'}`);
    };

    // Calculate match score between two users (0-100)
    const calculateMatchScore = (otherUser: UserPreferences): number => {
        if (!preferences) return 50; // Default score if no preferences

        let score = 0;
        let maxScore = 0;

        // Sleep schedule (weight: 15)
        maxScore += 15;
        if (preferences.sleepSchedule === otherUser.sleepSchedule) {
            score += 15;
        } else if (
            (preferences.sleepSchedule === 'intermedio') ||
            (otherUser.sleepSchedule === 'intermedio')
        ) {
            score += 8; // Partial match for intermediate
        }

        // Cleanliness (weight: 15)
        maxScore += 15;
        const cleanDiff = Math.abs(preferences.cleanlinessLevel - otherUser.cleanlinessLevel);
        score += Math.max(0, 15 - (cleanDiff * 4));

        // Noise level (weight: 12)
        maxScore += 12;
        if (preferences.noiseLevel === otherUser.noiseLevel) {
            score += 12;
        } else if (preferences.noiseLevel === 'moderado' || otherUser.noiseLevel === 'moderado') {
            score += 6;
        }

        // Smoking (weight: 10)
        maxScore += 10;
        if (preferences.smokingAllowed === otherUser.smokingAllowed) {
            score += 10;
        }

        // Pets (weight: 8)
        maxScore += 8;
        if (preferences.petsAllowed === otherUser.petsAllowed) {
            score += 8;
        } else if (preferences.petsAllowed) {
            score += 4; // If I allow pets but they don't have any
        }

        // Social level (weight: 10)
        maxScore += 10;
        if (preferences.socialLevel === otherUser.socialLevel) {
            score += 10;
        } else if (preferences.socialLevel === 'ambivertido' || otherUser.socialLevel === 'ambivertido') {
            score += 5;
        }

        // Guests frequency (weight: 8)
        maxScore += 8;
        if (preferences.guestsFrequency === otherUser.guestsFrequency) {
            score += 8;
        }

        // Budget overlap (weight: 12)
        maxScore += 12;
        const budgetOverlap = Math.min(preferences.budgetMax, otherUser.budgetMax) -
            Math.max(preferences.budgetMin, otherUser.budgetMin);
        if (budgetOverlap > 100) {
            score += 12;
        } else if (budgetOverlap > 0) {
            score += 6;
        }

        // Shared interests (weight: 10)
        maxScore += 10;
        const sharedInterests = preferences.interests.filter(i =>
            otherUser.interests.includes(i)
        ).length;
        score += Math.min(10, sharedInterests * 2);

        // Return normalized score
        return Math.round((score / maxScore) * 100);
    };

    const hasCompletedQuestionnaire = preferences?.completedAt != null;

    return (
        <PreferencesContext.Provider value={{
            preferences,
            isLoading,
            hasCompletedQuestionnaire,
            savePreferences,
            resetPreferences,
            calculateMatchScore
        }}>
            {children}
        </PreferencesContext.Provider>
    );
};

export const usePreferences = () => {
    const context = useContext(PreferencesContext);
    if (!context) {
        throw new Error('usePreferences must be used within a PreferencesProvider');
    }
    return context;
};

export default PreferencesContext;

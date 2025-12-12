import { format, formatDistance } from 'date-fns';
import { es, enUS, fr } from 'date-fns/locale';

const locales = {
  es,
  en: enUS,
  fr
};

export const formatDate = (date: Date | string, formatStr: string, language: string = 'es') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const locale = locales[language as keyof typeof locales] || locales.es;
  
  return format(dateObj, formatStr, { locale });
};

export const formatRelativeTime = (date: Date | string, language: string = 'es') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const locale = locales[language as keyof typeof locales] || locales.es;
  
  return formatDistance(dateObj, new Date(), { 
    addSuffix: true, 
    locale 
  });
};

export const formatCurrency = (amount: number, language: string = 'es') => {
  const localeMap = {
    es: 'es-ES',
    en: 'en-GB',
    fr: 'fr-FR'
  };
  
  const locale = localeMap[language as keyof typeof localeMap] || localeMap.es;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (num: number, language: string = 'es') => {
  const localeMap = {
    es: 'es-ES',
    en: 'en-GB',
    fr: 'fr-FR'
  };
  
  const locale = localeMap[language as keyof typeof localeMap] || localeMap.es;
  
  return new Intl.NumberFormat(locale).format(num);
};

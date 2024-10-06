import { format, isBefore, addMinutes, differenceInMinutes } from 'date-fns';

// Formater une date au format lisible
export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd HH:mm:ss');
};

// Ajouter un certain nombre de minutes à une date (utile pour les OTP ou autres tokens)
export const addMinutesToDate = (date: Date, minutes: number): Date => {
  return addMinutes(date, minutes);
};

// Vérifier si une date est avant une autre (vérifier si un OTP est expiré)
export const isDateBeforeNow = (expiryDate: Date): boolean => {
  return isBefore(expiryDate, new Date());
};

// Calculer la différence en minutes entre deux dates
export const getMinutesDifference = (date1: Date, date2: Date): number => {
  return differenceInMinutes(date1, date2);
};
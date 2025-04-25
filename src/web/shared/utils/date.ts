import i18next from 'i18next'; // version 23.0.0

/**
 * Formats a date relative to the current date, e.g., 'today', 'yesterday', or a specific date if it's further in the past.
 *
 * @param date - The date to format, can be a Date object, string, or timestamp
 * @returns The formatted relative date string.
 */
export function formatRelativeDate(date: Date | string | number): string {
  const inputDate = new Date(date);
  if (!isValidDate(inputDate)) {
    return i18next.t('common:dates.invalid_date', 'Invalid date');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  inputDate.setHours(0, 0, 0, 0);
  
  const diffTime = today.getTime() - inputDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return i18next.t('common:dates.today', 'Today');
  } else if (diffDays === 1) {
    return i18next.t('common:dates.yesterday', 'Yesterday');
  } else {
    // Format date according to locale
    const locale = i18next.language || 'pt-BR'; // Default to Brazilian Portuguese
    return new Intl.DateTimeFormat(locale, { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }).format(inputDate);
  }
}

/**
 * Calculates the age based on a given date of birth.
 *
 * @param dateOfBirth - The date of birth, can be a Date object, string, or timestamp
 * @returns The age in years.
 */
export function getAge(dateOfBirth: Date | string | number): number {
  const birthDate = new Date(dateOfBirth);
  if (!isValidDate(birthDate)) {
    return 0;
  }
  
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  // If birth month hasn't occurred yet this year or birth day hasn't occurred yet in the birth month
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Checks if a given value is a valid Date object.
 *
 * @param date - The value to check
 * @returns True if the value is a valid Date object, false otherwise.
 */
export function isValidDate(date: any): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}
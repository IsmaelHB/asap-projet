// Vérifie que la valeur n'est pas vide
export function isRequired(value: string): boolean {
  return value.trim().length > 0;
}

// Vérifie un email basique
export function isEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value.trim());
}

// Vérifie un numéro FR : 0X XX XX XX XX ou +33 X XX XX XX XX (avec ou sans espaces)
export function isPhoneFr(value: string): boolean {
  const cleaned = value.replace(/[\s.-]/g, '');
  const frRegex = /^(0[1-9]\d{8}|(\+33)[1-9]\d{8})$/;
  return frRegex.test(cleaned);
}

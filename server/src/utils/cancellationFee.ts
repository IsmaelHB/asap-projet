// src/utils/cancellationFee.ts

/**
 * Règles :
 * - Annulation dans les 5 minutes après création : 0 €
 * - Annulation plus de 24 h avant le RDV : 0 €
 * - Annulation moins de 24 h avant (et > 5 min après création) : 20 €
 * - NO_SHOW : 20 € (via calculateNoShowFee)
 */
export const calculateCancellationFee = (
  createdAt: Date,
  startTs: Date,
  now: Date = new Date()
): number => {
  const FIVE_MINUTES_MS = 5 * 60 * 1000;
  const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
  const CANCELLATION_FEE_CENTS = 2000; // 20€

  const timeSinceCreation = now.getTime() - createdAt.getTime();
  const timeUntilAppointment = startTs.getTime() - now.getTime();

  // 1) < 5 minutes après création → pas de frais
  if (timeSinceCreation <= FIVE_MINUTES_MS) return 0;

  // 2) > 24 h avant le RDV → pas de frais
  if (timeUntilAppointment > TWENTY_FOUR_HOURS_MS) return 0;

  // 3) Sinon → 20€
  return CANCELLATION_FEE_CENTS;
};

/**
 * Frais fixe en cas de no-show : 20€
 */
export const calculateNoShowFee = (): number => {
  return 2000; // 20€
};

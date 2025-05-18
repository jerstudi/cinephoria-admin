import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ParseStringToArrayProps = {
  str?: string; // Handles the case where str is undefined without generating an error
  separator?: string;
};

export const parseStringToArray = ({
  str = "", // Avoids a .split() on undefined
  separator = ",",
}: ParseStringToArrayProps): string[] => {
  return str
    .split(separator)
    .map((word) => word.trim())
    .filter(Boolean); // Filter empty elements. Removes empty entries from the table (useful if the user puts multiple separators in a row)
};

export function reducer(data: number[]) {
  const init = 0;
  return data.reduce((acc, curr) => acc + curr, init);
}

export function generateItemIdentifier(
  itemIdentifier: string,
  prefix: string,
): string {
  // Generate a random number between 0 and 9999
  // const randomNumber = Math.floor(Math.random() * 10000);
  const lastItemIdentifierNumber = parseInt(itemIdentifier.split("-")[1]);
  const newIdentifierNumber = lastItemIdentifierNumber + 1;
  // Format the number to have 4 digits
  const formattedNumber = newIdentifierNumber.toString().padStart(4, "0");

  // Add the prefix (ex: "TASK-")
  return `${prefix}-${formattedNumber}`;
}

export const slugify = (title: string) => {
  return title
    .toLowerCase()
    .normalize("NFD") // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/[^a-z0-9\s-]/g, "") // Garde uniquement les lettres, chiffres, espaces et tirets
    .replace(/\s+/g, "-") // Remplace les espaces par des tirets
    .replace(/-+/g, "-") // Évite les tirets multiples
    .trim(); // Supprime les espaces au début et à la fin
};

type imageLoaderProps = {
  host: string;
  domain: string;
  src: string;
  width: number;
  quality: number;
};

export const imageLoader = ({
  host,
  domain,
  src,
  width,
  quality,
}: imageLoaderProps) => {
  return `${host}://${domain}/${src}?w=${width}&q=${quality || 75}`;
};

export function calculateRequiredReservations(
  capacity: number,
  disabledPlaces: number,
  target: number,
): number {
  // Calcul de la capacité disponible (capacité totale - places handicapées)
  const availableCapacity = capacity - disabledPlaces;

  // Calcul du nombre de places nécessaires pour atteindre l'objectif
  const requiredReservations = Math.ceil(availableCapacity * (target / 100));

  return requiredReservations;
}

export function calculateRequiredReservationsForPercentage(
  capacity: number,
  percentage: number,
): number {
  // Calcul du nombre de places nécessaires pour atteindre le pourcentage
  const requiredReservations = Math.ceil(capacity * (percentage / 100));

  return requiredReservations;
}

// Exemple d'utilisation :
// Pour une salle de 100 places avec 4 places handicapées et un objectif de 80%
// calculateRequiredReservations(100, 4, 80) = 77 places

// Exemples d'utilisation :
// Pour une salle de 100 places avec un objectif de 3%
// calculateRequiredReservationsForPercentage(100, 3) = 3 places
//
// Pour une salle de 200 places avec un objectif de 3%
// calculateRequiredReservationsForPercentage(200, 3) = 6 places

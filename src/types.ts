export interface CommandeItem {
  nombre_commande: number;
  num_commande: string;
  motif: string;
  date_validation: string;
}

export interface AppConfig {
  outputFileName: string;
  motifs: string[];
  motifsFileName: string;
  windowTitle: string;
  bgColor: string;
  bgName: string;
}

export const COULEURS: Record<string, string> = {
  "Lavande": "#a2d2ff",
  "Bleu ciel": "#bde0fe",
  "Lilas": "#cdb4db",
  "Vert sauge": "#e9edc9",
  "Sable": "#d4a373",
  "Gris rosé": "#d6ccc2",
  "Vert menthe": "#b0c4b1",
  "Olive": "#bfc56b",
  "Terracotta": "#c44536",
};

export const DEFAULT_MOTIFS = [
  "Valide",
  "Client inconnu",
  "Hors périmètre",
  "Illisible",
  "Page Manquante",
  "Produit inconnu"
];

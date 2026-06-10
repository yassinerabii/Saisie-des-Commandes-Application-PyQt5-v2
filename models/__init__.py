# models/__init__.py
import csv
import os
import sys
from datetime import datetime


def resource_path(relative_path):
    """Retourne le chemin absolu vers une ressource, compatible PyInstaller."""
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(os.path.abspath('.'), relative_path)

class CommandeModel:
    """Modèle pour gérer les opérations sur les commandes."""
    
    def __init__(self):
        self.output_file = ""
        self.motifs = []
    
    def set_output_file(self, filename):
        """Définit le fichier de sortie."""
        if not filename.endswith('.csv'):
            filename += '.csv'
        self.output_file = filename
    
    def load_motifs(self, txt_path):
        """Charge les motifs depuis un fichier texte."""
        motifs = []
        try:
            with open(txt_path, mode='r', encoding='utf-8') as file:
                for line in file:
                    motif = line.strip()
                    if motif:
                        motifs.append(motif)
            self.motifs = motifs
            return motifs, None
        except Exception as e:
            return [], str(e)
    
    def save_commande(self, num_commande, motif):
        """Enregistre une commande dans le fichier CSV."""
        if not num_commande:
            return False, "Le numéro de commande ne peut pas être vide."
        
        date_val = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        nombre_commande = 1
        file_exists = os.path.isfile(self.output_file)
        
        if file_exists:
            with open(self.output_file, mode='r', encoding='utf-8') as file:
                lignes = list(csv.reader(file, delimiter=';'))
                if len(lignes) > 1:
                    nombre_commande = len(lignes)
        
        try:
            with open(self.output_file, mode='a', newline='', encoding='utf-8') as file:
                writer = csv.writer(file, delimiter=';')
                
                if not file_exists:
                    writer.writerow(['nombre_commande', 'num_commande', 'motif', 'date_validation'])
                
                writer.writerow([nombre_commande, num_commande, motif, date_val])
            
            return True, f"La commande {num_commande} a été enregistrée."
        except Exception as e:
            return False, f"Erreur lors de l'enregistrement : {e}"
    
    def get_nombre_commandes(self):
        """Retourne le nombre de commandes enregistrées."""
        if not os.path.isfile(self.output_file):
            return 0
        
        try:
            with open(self.output_file, mode='r', encoding='utf-8') as file:
                lignes = list(csv.reader(file, delimiter=';'))
                return max(0, len(lignes) - 1)
        except Exception:
            return 0

    def get_last_commande(self):
        """Retourne (num_commande, motif) de la dernière commande, ou None si inexistant."""
        if not os.path.isfile(self.output_file):
            return None
        
        try:
            with open(self.output_file, mode='r', encoding='utf-8') as file:
                lignes = list(csv.reader(file, delimiter=';'))
                # lignes[0] = en-tête, on veut la dernière ligne de données
                if len(lignes) > 1:
                    derniere = lignes[-1]
                    # ordre des colonnes : nombre_commande ; num_commande ; motif ; date_validation
                    return derniere[1], derniere[2]
            return None
        except Exception:
            return None
    
    def get_all_commandes(self):
        """Retourne la liste de toutes les commandes enregistrées.
        Chaque élément est un dictionnaire avec les clés : num_commande, motif, date_validation
        """
        if not os.path.isfile(self.output_file):
            return []
        
        try:
            commandes = []
            with open(self.output_file, mode='r', encoding='utf-8') as file:
                lecteur = csv.reader(file, delimiter=';')
                next(lecteur)  # Ignorer l'en-tête
                for row in lecteur:
                    if len(row) >= 4:
                        commandes.append({
                            'index': len(commandes),  # index pour modification
                            'num_commande': row[1],
                            'motif': row[2],
                            'date_validation': row[3]
                        })
            return commandes
        except Exception:
            return []
    
    def update_commande(self, index, num_commande, motif):
        """Modifie une commande à l'index donné."""
        if not os.path.isfile(self.output_file):
            return False, "Le fichier CSV n'existe pas."
        
        try:
            with open(self.output_file, mode='r', encoding='utf-8') as file:
                lignes = list(csv.reader(file, delimiter=';'))
            
            # Vérifier que l'index est valide
            if index + 1 >= len(lignes):  # +1 car première ligne est en-tête
                return False, "Index invalide."
            
            # Modifier la ligne (index + 1 pour tenir compte de l'en-tête)
            lignes[index + 1][1] = num_commande
            lignes[index + 1][2] = motif
            
            # Écrire le fichier modifié
            with open(self.output_file, mode='w', newline='', encoding='utf-8') as file:
                writer = csv.writer(file, delimiter=';')
                writer.writerows(lignes)
            
            return True, "La commande a été modifiée avec succès."
        except Exception as e:
            return False, f"Erreur lors de la modification : {e}"
    
    def delete_commande(self, index):
        """Supprime une commande à l'index donné."""
        if not os.path.isfile(self.output_file):
            return False, "Le fichier CSV n'existe pas."
        
        try:
            with open(self.output_file, mode='r', encoding='utf-8') as file:
                lignes = list(csv.reader(file, delimiter=';'))
            
            # Vérifier que l'index est valide
            if index + 1 >= len(lignes):  # +1 car première ligne est en-tête
                return False, "Index invalide."
            
            # Supprimer la ligne (index + 1 pour tenir compte de l'en-tête)
            del lignes[index + 1]
            
            # Écrire le fichier modifié
            with open(self.output_file, mode='w', newline='', encoding='utf-8') as file:
                writer = csv.writer(file, delimiter=';')
                writer.writerows(lignes)
            
            return True, "La commande a été supprimée avec succès."
        except Exception as e:
            return False, f"Erreur lors de la suppression : {e}"

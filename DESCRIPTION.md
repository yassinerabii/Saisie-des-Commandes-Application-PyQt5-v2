# 📋 Description du Projet - Saisie des Commandes PyQt5

## 🎯 Objectif
Application desktop permettant de saisir et enregistrer des commandes avec des motifs d'escalade dans un fichier CSV, développée avec **Python + PyQt5** selon l'architecture **MVC (Model-View-Controller)**.

---

## 🏗️ Architecture MVC

### 📦 **Model** (`models/__init__.py`)
- Gère la logique métier et l'accès aux données
- Classe `CommandeModel` qui :
  - Charge les motifs d'escalade depuis un fichier texte
  - Enregistre les commandes dans un fichier CSV
  - Récupère la dernière commande enregistrée
  - Récupère toutes les commandes enregistrées
  - Modifie une commande existante
  - Supprime une commande existante
  - Maintient le compte des commandes validées

### 🖼️ **Views** (`views/__init__.py`)
- Interfaces graphiques PyQt5
- `ConfigView` : Fenêtre de configuration initiale
  - Sélection du fichier de sortie CSV
  - Import des motifs d'escalade
  - Personnalisation du titre et des couleurs
- `OrderEntryView` : Fenêtre de saisie des commandes
  - Formulaire de saisie
  - Affichage du compteur
  - Liste déroulante des motifs
  - Bouton d'affichage des commandes enregistrées
- `CommandesView` : Fenêtre de gestion des commandes (NOUVEAU)
  - Tableau complet des commandes
  - Boutons de modification et suppression
  - Rafraîchissement dynamique

### 🎮 **Controllers** (`controllers/__init__.py`)
- Liaison entre les vues et le modèle
- `ConfigController` : Gère les interactions de configuration
- `OrderEntryController` : Gère les interactions de saisie des commandes
- `CommandesController` : Gère les interactions de modification/suppression (NOUVEAU)
- Traite les événements utilisateur et met à jour le modèle

### 🚀 **Entry Point** (`main.py`)
- Point d'entrée de l'application
- Crée les composants MVC
- Lance l'application avec QApplication

---

## 🔄 Flux d'Utilisation

### **Phase 1 : Configuration**
1. Utilisateur lance l'application
2. La fenêtre `ConfigView` apparaît
3. Étapes de configuration :
   - ✅ Choisir un dossier de sortie (CSV)
   - ✅ Sélectionner le fichier des motifs d'escalade
   - ✅ Personnaliser le titre de la fenêtre
   - ✅ Choisir la couleur de fond (9 options)
4. Clic sur "Démarrer" pour passer à la phase 2

### **Phase 2 : Saisie des Commandes**
1. La fenêtre `OrderEntryView` s'ouvre
2. Pour chaque commande :
   - 📝 Entrer un numéro de commande
   - 🎯 Sélectionner un motif d'escalade
   - ✔️ Cliquer "Enregistrer la commande" pour enregistrer
3. Affichage en temps réel :
   - Compteur de commandes saisies
   - Dernière commande enregistrée
4. Les données sont sauvegardées dans le fichier CSV

### **Phase 3 : Gestion des Commandes** (NOUVEAU)
1. Cliquer sur le bouton "📋 Afficher les commandes"
2. La fenêtre `CommandesView` s'ouvre avec un tableau
3. Actions disponibles :
   - ✏️ **Éditer** : Modifier un numéro ou motif de commande
   - 🗑️ **Supprimer** : Supprimer une commande du fichier CSV
4. Les modifications sont sauvegardées automatiquement

---

## 📊 Fichiers de Données

### Format CSV de Sortie
```
Numero_Commande,Motif_Escalade,Date_Heure
CMD001,Urgence Client,2024-01-15 10:30:45
CMD002,Défaut Produit,2024-01-15 10:35:12
```

### Format Fichier de Motifs (texte)
```
Urgence Client
Défaut Produit
Délai Dépassé
Insatisfaction Client
Problème Logistique
```

---

## 🎨 Personnalisation

### Couleurs Disponibles
- 🔴 Rouge
- 🔵 Bleu
- 🟢 Vert
- 🟡 Jaune
- 🟣 Violet
- 🟠 Orange
- 🤎 Marron
- ⚫ Noir
- ⚪ Blanc

### Titre Personnalisé
Le titre de la fenêtre de saisie peut être modifié dans la configuration.

---

## 📋 Structure des Fichiers

```
Saisie-des-Commandes-Application-PyQt5/
├── main.py                    # Point d'entrée
├── models/
│   └── __init__.py            # Logique métier (CommandeModel)
├── views/
│   └── __init__.py            # Interfaces PyQt5 (ConfigView, OrderEntryView, CommandesView)
├── controllers/
│   └── __init__.py            # Contrôleurs (ConfigController, OrderEntryController, CommandesController)
├── ico/                       # Dossier des icônes
├── README.md                  # Guide rapide
├── DESCRIPTION.md             # Cette documentation
├── STRUCTURE_MVC.md           # Guide de l'architecture MVC
├── motif.txt                  # Exemple de motifs
└── test01.csv                 # Exemple de fichier de sortie
```

---

## 🛠️ Installation & Exécution

### Prérequis
- Python 3.8 ou supérieur
- pip (gestionnaire de paquets Python)

### Installation des Dépendances
```bash
pip install PyQt5
```

### Lancement de l'Application
```bash
python main.py
```

---

## 🎓 Concepts Clés

### Pattern MVC
- **Séparation des responsabilités** : chaque composant a un rôle bien défini
- **Réutilisabilité** : le modèle peut être utilisé sans l'interface graphique
- **Testabilité** : facilite les tests unitaires

### Widgets PyQt5 Utilisés
- `QApplication` : Gestionnaire de l'application
- `QWidget` : Composant de base pour les fenêtres
- `QDialog` : Fenêtres dialogues modales
- `QVBoxLayout`, `QHBoxLayout` : Mise en page
- `QLineEdit` : Champs de saisie texte
- `QComboBox` : Liste déroulante pour motifs
- `QPushButton` : Boutons d'action
- `QLabel` : Affichage de texte
- `QTableWidget`, `QTableWidgetItem` : Tableau interactif (NOUVEAU)
- `QHeaderView` : En-têtes de tableau (NOUVEAU)
- `QFileDialog` : Dialogue de sélection de fichiers
- `QMessageBox` : Boîtes de message (confirmations, erreurs)
- `QColorDialog` : Dialogue de sélection de couleurs

### Gestion des Fichiers CSV
- Utilise le module `csv` de Python
- Lecture et écriture avec ajout de lignes (mode append)
- En-têtes personnalisés

---

## 📝 Fonctionnalités Principales

✅ **Interface intuitive** en trois phases (configuration, saisie, gestion)  
✅ **Sauvegarde automatique** des données en CSV  
✅ **Compteur en temps réel** des commandes  
✅ **Affichage de la dernière commande** enregistrée  
✅ **Personnalisation graphique** (titre, couleurs)  
✅ **Gestion des motifs d'escalade** via fichier texte  
✅ **Affichage des commandes** dans un tableau interactif (NOUVEAU)  
✅ **Modification des commandes** directement depuis l'interface (NOUVEAU)  
✅ **Suppression des commandes** avec confirmation (NOUVEAU)  
✅ **Compatible avec PyInstaller** pour créer un exécutable  

---

## 🔧 Maintenance & Extensions

### Amélioration Possibles
- [x] ~~Permettre l'édition/suppression des commandes~~ (COMPLÉTÉ)
- [ ] Ajouter une barre de recherche dans le tableau des commandes
- [ ] Ajouter un graphique de statistiques
- [ ] Implémenter une base de données (SQLite) à la place du CSV
- [ ] Ajouter une validation des numéros de commande
- [ ] Ajouter des raccourcis clavier
- [ ] Exporter les données en PDF ou Excel
- [ ] Ajouter un système de filtrage des commandes

### Débogage
- Vérifier les permissions d'écriture du fichier CSV
- Vérifier le format du fichier de motifs
- Consulter les logs en mode console pour les erreurs

---

**Auteur** : [À compléter]  
**Date de Création** : 2024  
**Licence** : [À spécifier]

# 📁 Structure MVC du Projet

## 🏗️ Organisation des Dossiers

Votre projet est maintenant organisé selon le pattern **MVC (Model-View-Controller)** avec une structure claire et modularisée :

```
Saisie-des-Commandes-Application-PyQt5/
├── main.py                          # Point d'entrée de l'application
├── models/
│   └── __init__.py                  # Classe CommandeModel
├── views/
│   └── __init__.py                  # Classes ConfigView, OrderEntryView, CommandesView
├── controllers/
│   └── __init__.py                  # Classes ConfigController, OrderEntryController, CommandesController
├── ico/                             # Dossier des icônes
├── README.md                        # Guide rapide
├── DESCRIPTION.md                   # Documentation détaillée
├── motif.txt                        # Exemple de motifs
└── test01.csv                       # Exemple de fichier de sortie
```

---

## 📦 Contenu de Chaque Dossier

### **models/** 📊
**Fichier** : `__init__.py`

**Contient** : Classe `CommandeModel`
- `load_motifs()` - Charge les motifs depuis un fichier texte
- `save_commande()` - Enregistre une commande dans le CSV
- `get_nombre_commandes()` - Récupère le total de commandes
- `get_last_commande()` - Récupère la dernière commande
- `get_all_commandes()` - Récupère toutes les commandes
- `update_commande()` - Modifie une commande
- `delete_commande()` - Supprime une commande

**Responsabilités** :
- Gestion des données
- Accès aux fichiers CSV
- Logique métier

---

### **views/** 🎨
**Fichier** : `__init__.py`

**Contient** : 3 classes principales
1. **ConfigView** - Interface de configuration initiale
   - Saisie du fichier de sortie
   - Sélection des motifs
   - Choix du titre et de la couleur

2. **OrderEntryView** - Interface de saisie des commandes
   - Formulaire d'entrée
   - Compteur en temps réel
   - Bouton d'affichage des commandes

3. **CommandesView** - Interface de gestion des commandes
   - Tableau avec toutes les commandes
   - Boutons de modification et suppression
   - Rafraîchissement dynamique

**Responsabilités** :
- Affichage des interfaces graphiques
- Widgets PyQt5
- Récupération des données utilisateur

---

### **controllers/** 🎮
**Fichier** : `__init__.py`

**Contient** : 3 classes principales
1. **ConfigController** - Gère la configuration
   - Parcourir les fichiers
   - Valider la configuration
   - Passer à la saisie des commandes

2. **OrderEntryController** - Gère la saisie des commandes
   - Enregistrement des commandes
   - Affichage de la fenêtre de gestion
   - Mises à jour du compteur

3. **CommandesController** - Gère les modifications/suppressions
   - Édition des commandes
   - Suppression des commandes
   - Rafraîchissement des données

**Responsabilités** :
- Liaison entre vues et modèle
- Gestion des événements
- Logique de navigation

---

## 🔄 Flux de Communication

```
main.py
   ↓
ConfigView ←→ ConfigController ←→ CommandeModel
   ↓                                    ↑
OrderEntryView ←→ OrderEntryController  │
   ↓                                    ↑
CommandesView ←→ CommandesController ←→ CommandeModel
```

---

## 💡 Avantages de cette Structure

✅ **Séparation des responsabilités** - Chaque couche a un rôle bien défini  
✅ **Maintenabilité** - Modifications faciles sans affecter d'autres modules  
✅ **Testabilité** - Tests unitaires simplifiés par module  
✅ **Réutilisabilité** - Code modulaire et réutilisable  
✅ **Scalabilité** - Facile d'ajouter de nouvelles fonctionnalités  

---

## 📝 Comment Ajouter de Nouvelles Fonctionnalités

### Exemple : Ajouter une nouvelle action

1. **Ajouter la logique dans le modèle** (`models/__init__.py`)
   ```python
   def new_function(self):
       # Logique métier
       pass
   ```

2. **Créer la vue correspondante** (`views/__init__.py`)
   ```python
   class NewView(QWidget):
       def __init__(self):
           # Interface
           pass
   ```

3. **Créer le contrôleur** (`controllers/__init__.py`)
   ```python
   class NewController:
       def __init__(self, view, model):
           # Liaison vue-modèle
           pass
   ```

4. **Intégrer dans le flux principal** (`main.py` ou controllers existants)

---

## 🚀 Démarrage de l'Application

```bash
python main.py
```

L'application démarrera en passant par le flux MVC complet ! 🎉

---

## 📚 Ressources

- [Documentation PyQt5](https://doc.qt.io/qtforpython/)
- [Pattern MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)
- [DESCRIPTION.md](DESCRIPTION.md) - Documentation détaillée du projet


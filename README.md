# 📦 Saisie des Commandes — Application PyQt5

Application desktop de saisie et d'enregistrement de commandes avec motifs d'escalade, construite avec **Python + PyQt5** selon le patron **MVC**.

---

## 🖥️ Fonctionnement

L'application se déroule en **trois étapes** :

### Étape 1 — Configuration
- Choisir le **fichier de sortie** (CSV où les commandes seront sauvegardées)
- Sélectionner le **fichier de motifs** d'escalade (fichier texte)
- Personnaliser le **titre** de la fenêtre de saisie
- Choisir la **couleur de fond** parmi 9 couleurs disponibles

### Étape 2 — Saisie des commandes
- Saisir un **numéro de commande**
- Choisir un **motif d'escalade** dans la liste déroulante
- Voir en temps réel le **compteur** de commandes validées
- Voir la **dernière commande enregistrée**
- Cliquer sur "📋 Afficher les commandes" pour gérer les commandes

### Étape 3 — Gestion des commandes (NOUVEAU)
- Visualiser **toutes les commandes** enregistrées dans un tableau
- **Éditer** une commande (modifier numéro ou motif)
- **Supprimer** une commande avec confirmation
- Les modifications sont sauvegardées automatiquement

---

## 📁 Structure du projet

```
├── main.py                    # Point d'entrée de l'application
├── models/
│   └── __init__.py            # Logique métier (CommandeModel)
├── views/
│   └── __init__.py            # Interfaces PyQt5 (ConfigView, OrderEntryView, CommandesView)
├── controllers/
│   └── __init__.py            # Contrôleurs MVC
├── ico/                       # Dossier des icônes
├── README.md                  # Ce fichier
├── DESCRIPTION.md             # Documentation détaillée
├── STRUCTURE_MVC.md           # Guide de l'architecture MVC
├── motif.txt                  # Exemple de fichier de motifs
└── test01.csv                 # Exemple de fichier de sortie
```

---

## ⚙️ Installation

### Prérequis
- Python 3.8+
- PyQt5

### Installer les dépendances

```bash
pip install PyQt5
```

### Lancer l'application

```bash
python main.py
```

---

## 📄 Format du fichier CSV de motifs

Le fichier CSV de motifs doit contenir **une colonne** avec un motif par ligne :

```
Valide
Retard de livraison
Produit endommagé
Commande incomplète
Erreur de référence
```

---

## 📄 Format du fichier CSV de sortie

Les commandes enregistrées sont sauvegardées dans un CSV avec le format suivant :

```
nombre_commande;num_commande;motif;date_validation
1;CMD-1024;Retard de livraison;2026-04-24 10:30:00
2;CMD-1025;Produit endommagé;2026-04-24 10:45:00
```

---

## 🎨 Couleurs disponibles

| Nom        | Code hex  |
|------------|-----------|
| Lavande    | `#a2d2ff` |
| Bleu ciel  | `#bde0fe` |
| Lilas      | `#cdb4db` |
| Vert sauge | `#e9edc9` |
| Sable      | `#d4a373` |
| Gris rosé  | `#d6ccc2` |
| Vert menthe| `#b0c4b1` |
| Olive      | `#bfc56b` |
| Terracotta | `#c44536` |

---

## 🏗️ Architecture MVC

| Fichier/Dossier              | Rôle                                          |
|------------------------------|-----------------------------------------------|
| `models/__init__.py`         | Lecture/écriture CSV, logique métier          |
| `views/__init__.py`          | Interfaces graphiques PyQt5                   |
| `controllers/__init__.py`    | Liaison entre vues et modèle                  |
| `main.py`                    | Point d'entrée, initialisation de l'app       |

Pour une documentation détaillée de l'architecture MVC, consultez [STRUCTURE_MVC.md](STRUCTURE_MVC.md).

---

## 📚 Documentation Complète

- **[DESCRIPTION.md](DESCRIPTION.md)** - Documentation détaillée du projet
- **[STRUCTURE_MVC.md](STRUCTURE_MVC.md)** - Guide de l'architecture MVC

---

## 📝 Licence

Projet libre d'utilisation.
# saisie-des-commandes-V2-PyQt5
# Saisie-des-Commandes-Application-PyQt5-v2
# Saisie-des-Commandes-Application-PyQt5-v2

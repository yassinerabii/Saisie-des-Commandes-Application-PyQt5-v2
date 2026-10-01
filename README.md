# 📦 Saisie des Commandes — Application Web (Migrée depuis PyQt5)

Application web moderne de saisie et d'enregistrement de commandes avec motifs d'escalade, fidèle à l'architecture **MVC** d'origine de l'application **Python + PyQt5**.

---

## 🖥️ Fonctionnement

L'application reproduit fidèlement les **trois étapes** d'origine :

### Étape 1 — Configuration de l'environnement
- Choisir ou saisir le **fichier de sortie CSV** (ex: `resultats.csv`, `test01.csv`, `test02.csv`)
- Sélectionner ou charger le **fichier de motifs** d'escalade (format texte ou CSV, avec motifs par défaut inclus)
- Personnaliser le **titre** de la fenêtre de saisie
- Choisir la **couleur de fond** parmi les 9 teintes d'origine avec aperçu en temps réel :
  - *Lavande (`#a2d2ff`), Bleu ciel (`#bde0fe`), Lilas (`#cdb4db`), Vert sauge (`#e9edc9`), Sable (`#d4a373`), Gris rosé (`#d6ccc2`), Vert menthe (`#b0c4b1`), Olive (`#bfc56b`), Terracotta (`#c44536`)*

### Étape 2 — Saisie des commandes
- Saisir un **numéro de commande** (ex: `CMD-1024`, validation `Entrée`)
- Choisir un **motif d'escalade** dans la liste déroulante
- Suivi dynamique du **compteur** de commandes validées (`Commandes validées : N`)
- Affichage de la **dernière commande validée** (`last cmd : ...`)
- Bouton "📋 Afficher les commandes" pour gérer et auditer l'ensemble des commandes
- Bouton d'export direct pour **télécharger le fichier CSV** généré (compatible Excel avec encodage UTF-8 et séparateur `;`)

### Étape 3 — Gestion des commandes
- Visualisation de **toutes les commandes** enregistrées dans un tableau interactif
- **Recherche / filtrage** rapide par n° de commande, motif ou date
- **Édition** complète d'une commande (modification du numéro ou du motif avec boîte de dialogue dédiée)
- **Suppression** d'une commande avec confirmation modale sécurisée
- Ré-indexation automatique et synchronisation immédiate

---

## 📄 Format CSV pris en charge

Les fichiers CSV utilisent le séparateur point-virgule (`;`) :

```csv
nombre_commande;num_commande;motif;date_validation
1;CMD-1024;Retard de livraison;2026-04-24 10:30:00
2;CMD-1025;Produit endommagé;2026-04-24 10:45:00
```

---

## 🏗️ Architecture MVC

- **Model (`src/models/CommandeModel.ts`)** : Gestion des commandes, persistance locale, parsing et export CSV standard.
- **Views (`src/components/`)** : Interfaces graphiques reproduisant l'apparence et les interactions PyQt5 (`ConfigView`, `OrderEntryView`, `CommandesView`, `EditOrderModal`, `ConfirmDeleteModal`).
- **Controller / App (`src/App.tsx`)** : Orchestration des flux, validation et notifications.


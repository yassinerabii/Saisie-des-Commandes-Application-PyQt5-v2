# views/__init__.py
import os
import sys
from PyQt5.QtWidgets import (QApplication, QWidget, QVBoxLayout, QHBoxLayout,
                             QLabel, QLineEdit, QPushButton, QFileDialog,
                             QMessageBox, QComboBox, QTableWidget, QTableWidgetItem,
                             QDialog, QHeaderView)
from PyQt5.QtGui import QColor, QIcon
from PyQt5.QtCore import Qt


def resource_path(relative_path):
    """Retourne le chemin absolu vers une ressource, compatible PyInstaller."""
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(os.path.abspath('.'), relative_path)

COULEURS = {
    "Lavande"      : "#a2d2ff",
    "Bleu ciel"    : "#bde0fe",
    "Lilas"        : "#cdb4db",
    "Vert sauge"   : "#e9edc9",
    "Sable"        : "#d4a373",
    "Gris rosé"    : "#d6ccc2",
    "Vert menthe"  : "#b0c4b1",
    "Olive"        : "#bfc56b",
    "Terracotta"   : "#c44536",
}

class ConfigView(QWidget):
    """Vue pour la configuration de l'environnement."""
    
    def __init__(self):
        super().__init__()
        self.txt_input_path = ""
        self.init_ui()
    
    def init_ui(self):
        self.setWindowTitle("Configuration de l'environnement")
        self.setWindowIcon(QIcon(resource_path(os.path.join('ico', 'file.ico'))))
        self.resize(500, 300)
        
        layout = QVBoxLayout()
        
        # Nom du fichier de sortie
        layout.addWidget(QLabel("Nom du fichier de sortie (ex: resultats.csv) :"))
        self.output_input = QLineEdit()
        layout.addWidget(self.output_input)
        
        # Sélection du fichier texte
        layout.addWidget(QLabel("Fichier texte contenant les motifs d'escalade :"))
        
        csv_layout = QHBoxLayout()
        self.txt_label = QLabel("Aucun fichier sélectionné")
        self.txt_label.setStyleSheet("color: gray; font-style: italic;")
        
        self.btn_browse = QPushButton("Parcourir...")
        csv_layout.addWidget(self.txt_label)
        csv_layout.addWidget(self.btn_browse)
        layout.addLayout(csv_layout)
        
        # Titre de la fenêtre
        layout.addWidget(QLabel("Nom de la fenêtre de saisie (Optionnel) :"))
        self.window_title_input = QLineEdit()
        self.window_title_input.setPlaceholderText("Ex: Saisie des commandes clients")
        layout.addWidget(self.window_title_input)

        # Couleur de fond
        layout.addWidget(QLabel("Couleur de fond de la fenêtre de saisie :"))
        color_layout = QHBoxLayout()
        self.color_combo = QComboBox()
        for nom in COULEURS:
            self.color_combo.addItem(nom)
        self.color_combo.currentIndexChanged.connect(self._update_color_preview)
        color_layout.addWidget(self.color_combo)

        # Aperçu de la couleur
        self.color_preview = QLabel()
        self.color_preview.setFixedSize(32, 24)
        self.color_preview.setStyleSheet(
            f"background-color: {list(COULEURS.values())[0]}; border: 1px solid #888; border-radius: 4px;"
        )
        color_layout.addWidget(self.color_preview)
        color_layout.addStretch()
        layout.addLayout(color_layout)
        
        # Bouton de validation
        self.btn_validate = QPushButton("Valider et Continuer")
        self.btn_validate.setStyleSheet("font-weight: bold; padding: 10px;")
        layout.addWidget(self.btn_validate)
        
        self.setLayout(layout)

    def _update_color_preview(self):
        """Met à jour le carré d'aperçu quand la sélection change."""
        hex_color = self.get_selected_color()
        self.color_preview.setStyleSheet(
            f"background-color: {hex_color}; border: 1px solid #888; border-radius: 4px;"
        )
    
    def get_output_filename(self):
        return self.output_input.text().strip()
    
    def get_txt_path(self):
        return self.txt_input_path
    
    def get_window_title(self):
        title = self.window_title_input.text().strip()
        return title if title else "Saisie des Commandes"

    def get_selected_color(self):
        """Retourne le code hex de la couleur sélectionnée."""
        nom = self.color_combo.currentText()
        return COULEURS.get(nom, "#E6F2FF")
    
    def set_txt_label(self, filename):
        self.txt_label.setText(filename)
        self.txt_label.setStyleSheet("color: black; font-style: normal;")
    
    def show_error(self, title, message):
        QMessageBox.critical(self, title, message)
    
    def show_success(self, title, message):
        QMessageBox.information(self, title, message)


class OrderEntryView(QWidget):
    """Vue pour la saisie des commandes."""
    
    def __init__(self, motifs, window_title, bg_color="#E6F2FF"):
        super().__init__()
        self.motifs = motifs
        self.window_title = window_title
        self.bg_color = bg_color
        self.init_ui()
    
    def init_ui(self):
        self.setWindowTitle(self.window_title)
        self.setWindowIcon(QIcon(resource_path(os.path.join('ico', 's.ico'))))
        self.setFixedSize(500, 350)
        self.setStyleSheet(f"background-color: {self.bg_color};")
        
        layout = QVBoxLayout()
        
        # Compteur de commandes
        self.counter_label = QLabel("Commandes validées : 0")
        self.counter_label.setStyleSheet("font-weight: bold; color: #2196F3; font-size: 12pt;")
        layout.addWidget(self.counter_label)

        # Dernière commande validée
        self.last_commande_label = QLabel("Dernière commande : ---")
        self.last_commande_label.setStyleSheet(
            "color: #1a140f; font-size: 9pt; font-style: italic;"
        )
        layout.addWidget(self.last_commande_label)
        
        # Numéro de commande
        layout.addWidget(QLabel("Numéro de commande :"))
        self.order_input = QLineEdit()
        self.order_input.setStyleSheet("background-color: white;")
        self.order_input.setPlaceholderText("Ex: CMD-1024")
        layout.addWidget(self.order_input)
        
        # Motif
        layout.addWidget(QLabel("Motif d'escalade :"))
        self.motif_combo = QComboBox()
        self.motif_combo.setStyleSheet("background-color: white;")
        self.motif_combo.addItems(self.motifs)
        layout.addWidget(self.motif_combo)
        
        # Buttons layout
        buttons_layout = QHBoxLayout()
        
        # Bouton Enregistrer
        self.btn_save = QPushButton("Enregistrer la commande")
        self.btn_save.setStyleSheet("background-color: #1f7a8c; color: white; font-weight: bold; padding: 5px;")
        buttons_layout.addWidget(self.btn_save)
        
        # Bouton Afficher les commandes
        self.btn_view_commands = QPushButton("📋 Afficher les commandes")
        self.btn_view_commands.setStyleSheet("background-color: #2196F3; color: white; font-weight: bold; padding: 5px;")
        buttons_layout.addWidget(self.btn_view_commands)
        
        layout.addLayout(buttons_layout)
        
        self.setLayout(layout)
    
    def get_commande_data(self):
        return {
            'num_commande': self.order_input.text().strip(),
            'motif': self.motif_combo.currentText()
        }
    
    def clear_form(self):
        self.order_input.clear()
        self.motif_combo.setCurrentIndex(0)
        self.order_input.setFocus()
    
    def update_counter(self, count):
        """Met à jour le compteur de commandes validées."""
        self.counter_label.setText(f"Commandes validées : {count}")

    def update_last_commande(self, num_commande, motif):
        """Met à jour le label de la dernière commande validée."""
        self.last_commande_label.setText(f"last cmd  : {num_commande} — {motif}")
    
    def show_success(self, message):
        QMessageBox.information(self, "Succès", message)
    
    def show_error(self, message):
        QMessageBox.critical(self, "Erreur", message)


class CommandesView(QDialog):
    """Vue pour afficher, modifier et supprimer les commandes enregistrées."""
    
    def __init__(self, commandes, motifs, parent=None):
        super().__init__(parent)
        self.commandes = commandes
        self.motifs = motifs
        self.init_ui()
    
    def init_ui(self):
        self.setWindowTitle("Gestion des Commandes")
        self.setWindowIcon(QIcon(resource_path(os.path.join('ico', 's.ico'))))
        self.setGeometry(100, 100, 800, 500)
        
        layout = QVBoxLayout()
        
        # Titre
        title_label = QLabel("📋 Commandes Enregistrées")
        title_label.setStyleSheet("font-weight: bold; font-size: 14pt; color: #1f7a8c;")
        layout.addWidget(title_label)
        
        # Tableau des commandes
        self.table = QTableWidget()
        self.table.setColumnCount(5)
        self.table.setHorizontalHeaderLabels(["N° Commande", "Motif", "Date/Heure", "Modifier", "Supprimer"])
        self.table.horizontalHeader().setSectionResizeMode(0, QHeaderView.Stretch)
        self.table.horizontalHeader().setSectionResizeMode(1, QHeaderView.Stretch)
        self.table.horizontalHeader().setSectionResizeMode(2, QHeaderView.Stretch)
        self.table.setRowCount(len(self.commandes))
        
        # Remplir le tableau
        for i, commande in enumerate(self.commandes):
            # Numéro de commande
            self.table.setItem(i, 0, QTableWidgetItem(commande['num_commande']))
            
            # Motif
            self.table.setItem(i, 1, QTableWidgetItem(commande['motif']))
            
            # Date/Heure
            self.table.setItem(i, 2, QTableWidgetItem(commande['date_validation']))
            
            # Bouton Modifier
            btn_edit = QPushButton("✏️ Éditer")
            btn_edit.setStyleSheet("background-color: #FFA500; color: white; padding: 5px;")
            btn_edit.clicked.connect(lambda checked, index=i: self.edit_commande(index))
            self.table.setCellWidget(i, 3, btn_edit)
            
            # Bouton Supprimer
            btn_delete = QPushButton("🗑️ Supprimer")
            btn_delete.setStyleSheet("background-color: #f44336; color: white; padding: 5px;")
            btn_delete.clicked.connect(lambda checked, index=i: self.delete_commande(index))
            self.table.setCellWidget(i, 4, btn_delete)
        
        layout.addWidget(self.table)
        
        # Bouton Fermer
        btn_close = QPushButton("Fermer")
        btn_close.setStyleSheet("background-color: #666; color: white; padding: 8px; font-weight: bold;")
        btn_close.clicked.connect(self.close)
        layout.addWidget(btn_close)
        
        self.setLayout(layout)
    
    def edit_commande(self, index):
        """Ouvre un dialogue pour éditer une commande."""
        commande = self.commandes[index]
        
        dialog = QDialog(self)
        dialog.setWindowTitle("Modifier une commande")
        dialog.setGeometry(200, 200, 400, 200)
        
        layout = QVBoxLayout()
        
        # Champ numéro de commande
        layout.addWidget(QLabel("Numéro de commande :"))
        input_num = QLineEdit(commande['num_commande'])
        layout.addWidget(input_num)
        
        # Combo motif
        layout.addWidget(QLabel("Motif d'escalade :"))
        combo_motif = QComboBox()
        combo_motif.addItems(self.motifs)
        combo_motif.setCurrentText(commande['motif'])
        layout.addWidget(combo_motif)
        
        # Boutons OK et Annuler
        btn_layout = QHBoxLayout()
        btn_ok = QPushButton("OK")
        btn_cancel = QPushButton("Annuler")
        btn_layout.addWidget(btn_ok)
        btn_layout.addWidget(btn_cancel)
        layout.addLayout(btn_layout)
        
        dialog.setLayout(layout)
        
        def save_edit():
            new_num = input_num.text().strip()
            new_motif = combo_motif.currentText()
            if new_num:
                self.on_commande_edited(index, new_num, new_motif)
                dialog.close()
            else:
                QMessageBox.warning(dialog, "Erreur", "Le numéro de commande ne peut pas être vide.")
        
        btn_ok.clicked.connect(save_edit)
        btn_cancel.clicked.connect(dialog.close)
        
        dialog.exec_()
    
    def delete_commande(self, index):
        """Affiche un dialogue de confirmation avant suppression."""
        reply = QMessageBox.question(
            self,
            "Confirmation",
            f"Voulez-vous vraiment supprimer la commande {self.commandes[index]['num_commande']} ?",
            QMessageBox.Yes | QMessageBox.No
        )
        
        if reply == QMessageBox.Yes:
            self.on_commande_deleted(index)
    
    def on_commande_edited(self, index, new_num, new_motif):
        """Signal émis quand une commande est éditée (doit être connecté au contrôleur)."""
        pass
    
    def on_commande_deleted(self, index):
        """Signal émis quand une commande est supprimée (doit être connecté au contrôleur)."""
        pass
    
    def refresh_table(self, commandes):
        """Rafraîchit le tableau avec les nouvelles commandes."""
        self.commandes = commandes
        self.table.setRowCount(len(self.commandes))
        
        for i, commande in enumerate(self.commandes):
            self.table.setItem(i, 0, QTableWidgetItem(commande['num_commande']))
            self.table.setItem(i, 1, QTableWidgetItem(commande['motif']))
            self.table.setItem(i, 2, QTableWidgetItem(commande['date_validation']))
            
            btn_edit = QPushButton("✏️ Éditer")
            btn_edit.setStyleSheet("background-color: #FFA500; color: white; padding: 5px;")
            btn_edit.clicked.connect(lambda checked, index=i: self.edit_commande(index))
            self.table.setCellWidget(i, 3, btn_edit)
            
            btn_delete = QPushButton("🗑️ Supprimer")
            btn_delete.setStyleSheet("background-color: #f44336; color: white; padding: 5px;")
            btn_delete.clicked.connect(lambda checked, index=i: self.delete_commande(index))
            self.table.setCellWidget(i, 4, btn_delete)

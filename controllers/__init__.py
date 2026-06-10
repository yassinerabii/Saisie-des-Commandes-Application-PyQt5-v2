# controllers/__init__.py
import os
from PyQt5.QtWidgets import QFileDialog, QMessageBox
from views import OrderEntryView, CommandesView

class ConfigController:
    """Contrôleur pour la configuration."""
    
    def __init__(self, view, model):
        self.view = view
        self.model = model
        
        # Connexion des signaux
        self.view.btn_browse.clicked.connect(self.browse_csv)
        self.view.btn_validate.clicked.connect(self.validate_config)
    
    def browse_csv(self):
        file_name, _ = QFileDialog.getOpenFileName(
            self.view, "Sélectionner le fichier texte", "", "Fichiers texte (*.txt)"
        )
        if file_name:
            self.view.txt_input_path = file_name
            self.view.set_txt_label(os.path.basename(file_name))
    
    def validate_config(self):
        output_file = self.view.get_output_filename()
        txt_path = self.view.get_txt_path()
        window_title = self.view.get_window_title()
        bg_color = self.view.get_selected_color()

        # Validation
        if not output_file:
            self.view.show_error("Erreur", "Le nom du fichier de sortie est obligatoire.")
            return
        
        if not txt_path:
            self.view.show_error("Erreur", "Veuillez sélectionner le fichier texte des motifs.")
            return
        
        # Configuration du modèle
        self.model.set_output_file(output_file)
        motifs, error = self.model.load_motifs(txt_path)
        
        if error:
            self.view.show_error("Erreur de lecture", f"Impossible de lire le fichier texte :\n{error}")
            return
        
        if not motifs:
            self.view.show_error("Erreur", "Le fichier texte sélectionné semble être vide.")
            return
        
        # Lancement de la deuxième interface avec la couleur choisie
        self.order_view = OrderEntryView(motifs, window_title, bg_color)
        self.order_controller = OrderEntryController(self.order_view, self.model, motifs)
        self.order_view.update_counter(self.model.get_nombre_commandes())

        # Charger la dernière commande si elle existe
        last = self.model.get_last_commande()
        if last:
            self.order_view.update_last_commande(last[0], last[1])

        self.order_view.show()
        self.view.close()


class OrderEntryController:
    """Contrôleur pour la saisie des commandes."""
    
    def __init__(self, view, model, motifs):
        self.view = view
        self.model = model
        self.motifs = motifs
        
        # Connexion des signaux
        self.view.btn_save.clicked.connect(self.save_commande)
        self.view.btn_view_commands.clicked.connect(self.show_commandes)
    
    def save_commande(self):
        data = self.view.get_commande_data()
        
        success, message = self.model.save_commande(data['num_commande'], data['motif'])
        
        if success:
            self.view.show_success(message)
            self.view.clear_form()
            # Mettre à jour le compteur
            count = self.model.get_nombre_commandes()
            self.view.update_counter(count)
            # Mettre à jour la dernière commande validée
            self.view.update_last_commande(data['num_commande'], data['motif'])
        else:
            self.view.show_error(message)
    
    def show_commandes(self):
        """Affiche la fenêtre de gestion des commandes."""
        commandes = self.model.get_all_commandes()
        
        if not commandes:
            QMessageBox.information(self.view, "Info", "Aucune commande enregistrée pour le moment.")
            return
        
        self.commandes_view = CommandesView(commandes, self.motifs, self.view)
        self.commandes_controller = CommandesController(self.commandes_view, self.model, self)
        self.commandes_view.exec_()


class CommandesController:
    """Contrôleur pour la gestion des commandes (affichage, modification, suppression)."""
    
    def __init__(self, view, model, parent_controller):
        self.view = view
        self.model = model
        self.parent_controller = parent_controller
        
        # Connecter les signaux
        self.view.on_commande_edited = self.handle_edit_commande
        self.view.on_commande_deleted = self.handle_delete_commande
    
    def handle_edit_commande(self, index, new_num, new_motif):
        """Gère la modification d'une commande."""
        success, message = self.model.update_commande(index, new_num, new_motif)
        
        if success:
            QMessageBox.information(self.view, "Succès", message)
            # Rafraîchir le tableau
            commandes = self.model.get_all_commandes()
            self.view.refresh_table(commandes)
        else:
            QMessageBox.critical(self.view, "Erreur", message)
    
    def handle_delete_commande(self, index):
        """Gère la suppression d'une commande."""
        success, message = self.model.delete_commande(index)
        
        if success:
            QMessageBox.information(self.view, "Succès", message)
            # Rafraîchir le tableau
            commandes = self.model.get_all_commandes()
            self.view.refresh_table(commandes)
            # Mettre à jour le compteur dans la fenêtre principale
            count = self.model.get_nombre_commandes()
            self.parent_controller.view.update_counter(count)
        else:
            QMessageBox.critical(self.view, "Erreur", message)

# main.py
import sys
from PyQt5.QtWidgets import QApplication
from models import CommandeModel
from views import ConfigView
from controllers import ConfigController

if __name__ == "__main__":
    app = QApplication(sys.argv)
    app.setStyle("Fusion")
    
    # Créer les composants MVC
    model = CommandeModel()
    view = ConfigView()
    
    controller = ConfigController(view, model)
    
    view.show()
    sys.exit(app.exec_())
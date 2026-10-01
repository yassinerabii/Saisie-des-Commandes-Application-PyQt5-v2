import React, { useState, useMemo, useEffect } from 'react';
import { CommandeModel } from './models/CommandeModel';
import { ConfigView } from './components/ConfigView';
import { OrderEntryView } from './components/OrderEntryView';
import { CommandesView } from './components/CommandesView';
import { ToastContainer, ToastMessage } from './components/Toast';
import { AppConfig, COULEURS, DEFAULT_MOTIFS, CommandeItem } from './types';

export const App: React.FC = () => {
  // Step state: 'config' | 'order_entry'
  const [currentStep, setCurrentStep] = useState<'config' | 'order_entry'>('config');

  // App Configuration
  const [config, setConfig] = useState<AppConfig>({
    outputFileName: 'resultats.csv',
    motifs: [...DEFAULT_MOTIFS],
    motifsFileName: 'motif.txt',
    windowTitle: 'Saisie des Commandes',
    bgColor: COULEURS['Lavande'],
    bgName: 'Lavande'
  });

  // Commande Model instance
  const model = useMemo(() => {
    return new CommandeModel(config.outputFileName, config.motifs);
  }, [config.outputFileName]);

  // Commandes list in state to drive UI updates
  const [commandes, setCommandes] = useState<CommandeItem[]>([]);
  const [isCommandesListOpen, setIsCommandesListOpen] = useState(false);

  // Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string, title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message, title }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync state with model
  const refreshCommandes = () => {
    setCommandes(model.getAllCommandes());
  };

  useEffect(() => {
    refreshCommandes();
  }, [model]);

  // Handlers for Config validation
  const handleValidateConfig = (newConfig: AppConfig, importedCsvContent?: string) => {
    setConfig(newConfig);
    model.setOutputFile(newConfig.outputFileName);
    model.setMotifs(newConfig.motifs);

    if (importedCsvContent) {
      const result = model.importCsv(importedCsvContent);
      if (result.success) {
        addToast('success', `${result.count} commandes importées depuis le fichier CSV.`, 'Import réussi');
      } else if (result.error) {
        addToast('error', result.error, 'Erreur import');
      }
    }

    refreshCommandes();
    setCurrentStep('order_entry');
  };

  // Handlers for Order entry
  const handleSaveCommande = (num_commande: string, motif: string) => {
    const result = model.saveCommande(num_commande, motif);
    if (result.success) {
      addToast('success', result.message, 'Succès');
      refreshCommandes();
    } else {
      addToast('error', result.message, 'Erreur');
    }
  };

  // Handlers for Commandes List operations
  const handleEditCommande = (index: number, newNum: string, newMotif: string) => {
    const result = model.updateCommande(index, newNum, newMotif);
    if (result.success) {
      addToast('success', result.message, 'Succès');
      refreshCommandes();
    } else {
      addToast('error', result.message, 'Erreur');
    }
  };

  const handleDeleteCommande = (index: number) => {
    const result = model.deleteCommande(index);
    if (result.success) {
      addToast('success', result.message, 'Succès');
      refreshCommandes();
    } else {
      addToast('error', result.message, 'Erreur');
    }
  };

  const handleDownloadCsv = () => {
    model.downloadCsv();
    addToast('info', `Fichier ${config.outputFileName} téléchargé.`, 'Téléchargement');
  };

  const lastCmd = model.getLastCommande();

  return (
    <div className="relative min-h-screen">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {currentStep === 'config' ? (
        <ConfigView
          initialConfig={config}
          onValidate={handleValidateConfig}
          showError={(title, msg) => addToast('error', msg, title)}
        />
      ) : (
        <OrderEntryView
          config={config}
          commandesCount={commandes.length}
          lastCommande={lastCmd}
          commandes={commandes}
          onSaveCommande={handleSaveCommande}
          onOpenCommandesList={() => {
            if (commandes.length === 0) {
              addToast('info', 'Aucune commande enregistrée pour le moment.', 'Info');
            } else {
              setIsCommandesListOpen(true);
            }
          }}
          onBackToConfig={() => setCurrentStep('config')}
          onDownloadCsv={handleDownloadCsv}
        />
      )}

      {/* Modal dialog for Gestion des Commandes */}
      <CommandesView
        isOpen={isCommandesListOpen}
        commandes={commandes}
        motifs={config.motifs}
        outputFileName={config.outputFileName}
        onClose={() => setIsCommandesListOpen(false)}
        onEditCommande={handleEditCommande}
        onDeleteCommande={handleDeleteCommande}
        onDownloadCsv={handleDownloadCsv}
        showError={(title, msg) => addToast('error', msg, title)}
      />
    </div>
  );
};

export default App;

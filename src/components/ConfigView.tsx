import React, { useState, useRef } from 'react';
import { COULEURS, DEFAULT_MOTIFS, AppConfig } from '../types';
import { FolderOpen, FileText, CheckCircle2, Upload, FileSpreadsheet } from 'lucide-react';

interface ConfigViewProps {
  initialConfig: AppConfig;
  onValidate: (config: AppConfig, importedCsvContent?: string) => void;
  showError: (title: string, message: string) => void;
}

export const ConfigView: React.FC<ConfigViewProps> = ({
  initialConfig,
  onValidate,
  showError
}) => {
  const [outputFileName, setOutputFileName] = useState(initialConfig.outputFileName);
  const [txtInputPath, setTxtInputPath] = useState(initialConfig.motifsFileName || 'motif.txt');
  const [motifs, setMotifs] = useState<string[]>(initialConfig.motifs);
  const [windowTitle, setWindowTitle] = useState(initialConfig.windowTitle);
  const [selectedColorName, setSelectedColorName] = useState(initialConfig.bgName);
  const [importedCsvContent, setImportedCsvContent] = useState<string | undefined>();
  const [isCsvUploaded, setIsCsvUploaded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const selectedHexColor = COULEURS[selectedColorName] || '#a2d2ff';

  const handleBrowseTxt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) {
        showError('Erreur', 'Le fichier sélectionné est vide.');
        return;
      }
      const lines = content.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) {
        showError('Erreur', 'Le fichier texte sélectionné semble être vide.');
        return;
      }
      setMotifs(lines);
      setTxtInputPath(file.name);
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleBrowseCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOutputFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportedCsvContent(content);
        setIsCsvUploaded(true);
      }
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleUseDefaultMotifs = () => {
    setMotifs([...DEFAULT_MOTIFS]);
    setTxtInputPath('motif.txt');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let cleanOutput = outputFileName.trim();
    if (!cleanOutput) {
      showError('Erreur', 'Le nom du fichier de sortie est obligatoire.');
      return;
    }

    if (!cleanOutput.toLowerCase().endsWith('.csv')) {
      cleanOutput += '.csv';
    }

    if (!txtInputPath || motifs.length === 0) {
      showError('Erreur', 'Veuillez sélectionner le fichier texte des motifs.');
      return;
    }

    const finalTitle = windowTitle.trim() || 'Saisie des Commandes';

    onValidate({
      outputFileName: cleanOutput,
      motifs,
      motifsFileName: txtInputPath,
      windowTitle: finalTitle,
      bgColor: selectedHexColor,
      bgName: selectedColorName
    }, importedCsvContent);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-gray-200/80 overflow-hidden">
        {/* Header bar matching PyQt5 window look */}
        <div className="bg-slate-800 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-blue-500/20 border border-blue-400 flex items-center justify-center text-xs font-bold text-blue-300">
              📁
            </div>
            <h1 className="font-semibold text-sm tracking-wide">
              Configuration de l'environnement
            </h1>
          </div>
          <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono">
            PyQt5 v2 Web
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-gray-800 text-sm">
          
          {/* Nom du fichier de sortie */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Nom du fichier de sortie (ex: resultats.csv) :
            </label>
            <div className="relative">
              <input
                type="text"
                value={outputFileName}
                onChange={(e) => {
                  setOutputFileName(e.target.value);
                  setIsCsvUploaded(false);
                }}
                placeholder="resultats.csv"
                className="w-full px-3.5 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm bg-white"
              />
              <button
                type="button"
                onClick={() => csvInputRef.current?.click()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded border border-gray-200 flex items-center gap-1"
                title="Importer un fichier CSV existant"
              >
                <Upload className="w-3 h-3" />
                <span>Importer CSV</span>
              </button>
              <input
                type="file"
                ref={csvInputRef}
                onChange={handleBrowseCsv}
                accept=".csv"
                className="hidden"
              />
            </div>
            
            {/* Quick choices / suggestions */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
              <span>Exemples :</span>
              <button
                type="button"
                onClick={() => { setOutputFileName('resultats.csv'); setIsCsvUploaded(false); }}
                className={`px-2 py-0.5 rounded border transition-colors ${outputFileName === 'resultats.csv' ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
              >
                resultats.csv (Nouveau)
              </button>
              <button
                type="button"
                onClick={() => { setOutputFileName('test01.csv'); setIsCsvUploaded(false); }}
                className={`px-2 py-0.5 rounded border transition-colors ${outputFileName === 'test01.csv' ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
              >
                test01.csv (1 commande)
              </button>
              <button
                type="button"
                onClick={() => { setOutputFileName('test02.csv'); setIsCsvUploaded(false); }}
                className={`px-2 py-0.5 rounded border transition-colors ${outputFileName === 'test02.csv' ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
              >
                test02.csv (21 commandes)
              </button>
            </div>
          </div>

          {/* Sélection du fichier texte */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Fichier texte contenant les motifs d'escalade :
            </label>
            
            <div className="flex items-center gap-3">
              <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-xs truncate">
                {txtInputPath ? (
                  <span className="text-gray-900 font-medium flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    {txtInputPath} ({motifs.length} motifs chargés)
                  </span>
                ) : (
                  <span className="text-gray-400 italic">Aucun fichier sélectionné</span>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs rounded-md border border-gray-300 transition-colors flex items-center gap-1.5 flex-shrink-0"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                Parcourir...
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleBrowseTxt}
                accept=".txt,.csv"
                className="hidden"
              />
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <button
                type="button"
                onClick={handleUseDefaultMotifs}
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3 text-blue-500" />
                Utiliser motif.txt (par défaut)
              </button>
              <span className="truncate max-w-[200px]" title={motifs.join(', ')}>
                Ex: {motifs.slice(0, 3).join(', ')}...
              </span>
            </div>
          </div>

          {/* Titre de la fenêtre */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Nom de la fenêtre de saisie (Optionnel) :
            </label>
            <input
              type="text"
              value={windowTitle}
              onChange={(e) => setWindowTitle(e.target.value)}
              placeholder="Ex: Saisie des commandes clients"
              className="w-full px-3.5 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
            />
          </div>

          {/* Couleur de fond */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Couleur de fond de la fenêtre de saisie :
            </label>
            <div className="flex items-center gap-3">
              <select
                value={selectedColorName}
                onChange={(e) => setSelectedColorName(e.target.value)}
                className="flex-1 px-3.5 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
              >
                {Object.keys(COULEURS).map((nom) => (
                  <option key={nom} value={nom}>
                    {nom} ({COULEURS[nom]})
                  </option>
                ))}
              </select>

              {/* Aperçu de la couleur matching PyQt5 (32x24 px, border, rounded-4px) */}
              <div
                className="w-10 h-8 rounded-md border border-gray-400 shadow-2xs flex-shrink-0 transition-colors"
                style={{ backgroundColor: selectedHexColor }}
                title={`Code couleur: ${selectedHexColor}`}
              />
            </div>
          </div>

          {/* Bouton de validation */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-lg shadow-sm transition-colors text-center text-sm"
            >
              Valider et Continuer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

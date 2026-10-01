import React, { useState, useRef, useEffect } from 'react';
import { AppConfig, CommandeItem } from '../types';
import { Settings, Download, ListOrdered, CheckCircle2 } from 'lucide-react';
import { StatsWidget } from './StatsWidget';

interface OrderEntryViewProps {
  config: AppConfig;
  commandesCount: number;
  lastCommande: { num_commande: string; motif: string } | null;
  commandes: CommandeItem[];
  onSaveCommande: (num_commande: string, motif: string) => void;
  onOpenCommandesList: () => void;
  onBackToConfig: () => void;
  onDownloadCsv: () => void;
}

export const OrderEntryView: React.FC<OrderEntryViewProps> = ({
  config,
  commandesCount,
  lastCommande,
  commandes,
  onSaveCommande,
  onOpenCommandesList,
  onBackToConfig,
  onDownloadCsv
}) => {
  const [orderInput, setOrderInput] = useState('');
  const [selectedMotif, setSelectedMotif] = useState(config.motifs[0] || 'Valide');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the order input field on load
    inputRef.current?.focus();
  }, []);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanNum = orderInput.trim();
    if (!cleanNum) {
      inputRef.current?.focus();
      return;
    }
    onSaveCommande(cleanNum, selectedMotif);
    setOrderInput('');
    setSelectedMotif(config.motifs[0] || 'Valide');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-200/70">
      {/* Outer container resembling a desktop application window */}
      <div
        className="w-full max-w-[540px] rounded-xl shadow-2xl border border-black/15 overflow-hidden transition-all duration-300"
        style={{ backgroundColor: config.bgColor }}
      >
        {/* Desktop window Titlebar */}
        <div className="bg-slate-900/90 text-white px-4 py-2.5 flex items-center justify-between border-b border-black/10 select-none">
          <div className="flex items-center gap-2">
            <span className="text-base">📦</span>
            <span className="font-semibold text-sm tracking-tight truncate max-w-[280px]">
              {config.windowTitle}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onDownloadCsv}
              className="text-xs px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 transition-colors"
              title="Exporter / Télécharger le fichier CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
            <button
              onClick={onBackToConfig}
              className="text-xs px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 transition-colors"
              title="Modifier la configuration"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Config</span>
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="p-7 space-y-4">
          
          {/* Header Stats & Last Command */}
          <div className="space-y-1 pb-1">
            <div
              className="text-lg font-bold tracking-tight"
              style={{ color: '#2196F3' }}
            >
              Commandes validées : {commandesCount}
            </div>

            <div
              className="text-xs italic font-medium truncate"
              style={{ color: '#1a140f' }}
            >
              {lastCommande
                ? `last cmd  : ${lastCommande.num_commande} — ${lastCommande.motif}`
                : 'Dernière commande : ---'}
            </div>
          </div>

          {/* Widget Statistiques (Aujourd'hui & Activité) */}
          <StatsWidget commandes={commandes} />

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4 pt-1">
            
            {/* Numéro de commande */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Numéro de commande :
              </label>
              <input
                ref={inputRef}
                type="text"
                value={orderInput}
                onChange={(e) => setOrderInput(e.target.value)}
                placeholder="Ex: CMD-1024"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-md text-gray-900 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
              />
            </div>

            {/* Motif d'escalade */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Motif d'escalade :
              </label>
              <select
                value={selectedMotif}
                onChange={(e) => setSelectedMotif(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-md text-gray-900 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
              >
                {config.motifs.map((motif) => (
                  <option key={motif} value={motif}>
                    {motif}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons Layout matching PyQt5 */}
            <div className="pt-3 grid grid-cols-2 gap-3">
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-white font-bold text-sm rounded-md shadow-sm transition-opacity hover:opacity-95 active:opacity-90 flex items-center justify-center gap-1.5"
                style={{ backgroundColor: '#1f7a8c' }}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Enregistrer la commande</span>
              </button>

              <button
                type="button"
                onClick={onOpenCommandesList}
                className="w-full py-2.5 px-4 text-white font-bold text-sm rounded-md shadow-sm transition-opacity hover:opacity-95 active:opacity-90 flex items-center justify-center gap-1.5"
                style={{ backgroundColor: '#2196F3' }}
              >
                <span>📋 Afficher les commandes</span>
              </button>
            </div>
          </form>

          {/* Current file badge */}
          <div className="pt-2 flex items-center justify-between text-[11px] text-gray-700/80 border-t border-black/10">
            <span>Fichier actif : <strong className="font-mono">{config.outputFileName}</strong></span>
            <span>Thème : {config.bgName}</span>
          </div>

        </div>
      </div>
    </div>
  );
};

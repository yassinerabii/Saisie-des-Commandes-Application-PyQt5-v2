import React, { useState, useEffect } from 'react';
import { CommandeItem } from '../types';
import { X } from 'lucide-react';

interface EditOrderModalProps {
  isOpen: boolean;
  commande: CommandeItem | null;
  motifs: string[];
  onClose: () => void;
  onSave: (newNum: string, newMotif: string) => void;
  showError: (title: string, message: string) => void;
}

export const EditOrderModal: React.FC<EditOrderModalProps> = ({
  isOpen,
  commande,
  motifs,
  onClose,
  onSave,
  showError
}) => {
  const [numCommande, setNumCommande] = useState('');
  const [motif, setMotif] = useState('');

  useEffect(() => {
    if (commande) {
      setNumCommande(commande.num_commande);
      setMotif(commande.motif);
    }
  }, [commande]);

  if (!isOpen || !commande) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = numCommande.trim();
    if (!cleanNum) {
      showError('Erreur', 'Le numéro de commande ne peut pas être vide.');
      return;
    }
    onSave(cleanNum, motif || motifs[0] || 'Valide');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-800 text-base">Modifier une commande</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-md p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Numéro de commande :
            </label>
            <input
              type="text"
              value={numCommande}
              onChange={(e) => setNumCommande(e.target.value)}
              placeholder="Ex: CMD-1024"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Motif d'escalade :
            </label>
            <select
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {motifs.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors shadow-xs"
            >
              OK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React from 'react';
import { CommandeItem } from '../types';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  commande: CommandeItem | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  commande,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !commande) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="p-5">
          <div className="flex items-center gap-3 mb-3 text-amber-600">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <h3 className="font-semibold text-gray-900 text-base">Confirmation</h3>
          </div>
          <p className="text-sm text-gray-600 mb-5 leading-relaxed">
            Voulez-vous vraiment supprimer la commande <span className="font-semibold text-gray-900">{commande.num_commande}</span> ?
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Non
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors shadow-xs"
            >
              Oui
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

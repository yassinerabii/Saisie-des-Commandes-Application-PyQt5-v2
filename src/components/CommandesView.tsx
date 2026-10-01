import React, { useState } from 'react';
import { CommandeItem } from '../types';
import { Download, Search, FileSpreadsheet, X, Edit3, Trash2 } from 'lucide-react';
import { EditOrderModal } from './EditOrderModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface CommandesViewProps {
  isOpen: boolean;
  commandes: CommandeItem[];
  motifs: string[];
  outputFileName: string;
  onClose: () => void;
  onEditCommande: (index: number, newNum: string, newMotif: string) => void;
  onDeleteCommande: (index: number) => void;
  onDownloadCsv: () => void;
  showError: (title: string, message: string) => void;
}

export const CommandesView: React.FC<CommandesViewProps> = ({
  isOpen,
  commandes,
  motifs,
  outputFileName,
  onClose,
  onEditCommande,
  onDeleteCommande,
  onDownloadCsv,
  showError
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const filtered = commandes.map((c, originalIndex) => ({ ...c, originalIndex }))
    .filter(c =>
      c.num_commande.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.motif.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.date_validation.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const currentEditingItem = editingIndex !== null ? commandes[editingIndex] : null;
  const currentDeletingItem = deletingIndex !== null ? commandes[deletingIndex] : null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: '#1f7a8c' }}>
              📋 Commandes Enregistrées
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Fichier : <span className="font-mono font-medium text-gray-700">{outputFileName}</span> &bull; Total : <span className="font-semibold text-gray-800">{commandes.length}</span> commande{commandes.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onDownloadCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-md transition-colors"
              title="Exporter vers Excel / CSV"
            >
              <Download className="w-3.5 h-3.5" />
              Exporter CSV
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg transition-colors"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar with Search */}
        <div className="px-6 py-3 bg-white border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par n°, motif, date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
            />
          </div>
          {searchTerm && (
            <span className="text-xs text-gray-500">
              {filtered.length} résultat{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Table container */}
        <div className="flex-1 overflow-y-auto min-h-[300px] p-6 pt-2">
          {commandes.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400">
              <FileSpreadsheet className="w-12 h-12 stroke-[1.2] mb-2 text-gray-300" />
              <p className="text-sm font-medium">Aucune commande enregistrée pour le moment.</p>
              <p className="text-xs text-gray-400 mt-1">Saisissez votre première commande dans la fenêtre de saisie.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-gray-400">
              <p className="text-sm">Aucune commande ne correspond à votre recherche "{searchTerm}".</p>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">N° Commande</th>
                    <th className="py-3 px-4">Motif</th>
                    <th className="py-3 px-4">Date/Heure</th>
                    <th className="py-3 px-3 text-center w-28">Modifier</th>
                    <th className="py-3 px-3 text-center w-28">Supprimer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filtered.map((cmd) => (
                    <tr key={cmd.originalIndex} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-2.5 px-4 text-xs font-mono text-gray-400 text-center">
                        {cmd.nombre_commande}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-medium text-slate-800">
                        {cmd.num_commande}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          cmd.motif === 'Valide'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {cmd.motif}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-xs font-mono text-gray-600">
                        {cmd.date_validation}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => setEditingIndex(cmd.originalIndex)}
                          className="inline-flex items-center justify-center gap-1 w-full px-2.5 py-1 text-xs font-medium text-white rounded transition-colors shadow-2xs"
                          style={{ backgroundColor: '#FFA500' }}
                          title="Modifier"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>✏️ Éditer</span>
                        </button>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => setDeletingIndex(cmd.originalIndex)}
                          className="inline-flex items-center justify-center gap-1 w-full px-2.5 py-1 text-xs font-medium text-white rounded transition-colors shadow-2xs"
                          style={{ backgroundColor: '#f44336' }}
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>🗑️ Supprimer</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Export automatique vers format CSV standard (<code className="font-mono">;</code> délimiteur)
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-white font-bold text-sm rounded-md transition-colors shadow-xs"
            style={{ backgroundColor: '#666' }}
          >
            Fermer
          </button>
        </div>
      </div>

      {/* Sub-modals for Edit and Delete */}
      <EditOrderModal
        isOpen={editingIndex !== null}
        commande={currentEditingItem}
        motifs={motifs}
        onClose={() => setEditingIndex(null)}
        onSave={(newNum, newMotif) => {
          if (editingIndex !== null) {
            onEditCommande(editingIndex, newNum, newMotif);
            setEditingIndex(null);
          }
        }}
        showError={showError}
      />

      <ConfirmDeleteModal
        isOpen={deletingIndex !== null}
        commande={currentDeletingItem}
        onClose={() => setDeletingIndex(null)}
        onConfirm={() => {
          if (deletingIndex !== null) {
            onDeleteCommande(deletingIndex);
            setDeletingIndex(null);
          }
        }}
      />
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { CommandeItem } from '../types';
import { Calendar, CheckCircle, AlertTriangle, ChevronDown, ChevronUp, Clock, BarChart3 } from 'lucide-react';

interface StatsWidgetProps {
  commandes: CommandeItem[];
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({ commandes }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get current date string formatted as YYYY-MM-DD
  const todayStr = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const formattedTodayDate = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  }, []);

  // Compute statistics
  const stats = useMemo(() => {
    const totalCount = commandes.length;
    const todayCommandes = commandes.filter(c => c.date_validation?.startsWith(todayStr));
    const todayCount = todayCommandes.length;

    // Conformes vs escalades (today & total)
    const todayValides = todayCommandes.filter(c => c.motif === 'Valide').length;
    const todayEscalades = todayCount - todayValides;

    const totalValides = commandes.filter(c => c.motif === 'Valide').length;
    const totalEscalades = totalCount - totalValides;

    // Motifs breakdown today
    const motifsTodayMap: Record<string, number> = {};
    todayCommandes.forEach(c => {
      motifsTodayMap[c.motif] = (motifsTodayMap[c.motif] || 0) + 1;
    });

    const motifsBreakdown = Object.entries(motifsTodayMap)
      .sort((a, b) => b[1] - a[1]);

    // Last order time today
    const lastTodayCmd = todayCommandes.length > 0 ? todayCommandes[todayCommandes.length - 1] : null;
    const lastTimeToday = lastTodayCmd?.date_validation
      ? lastTodayCmd.date_validation.split(' ')[1]?.slice(0, 5)
      : null;

    const todayRate = todayCount > 0 ? Math.round((todayValides / todayCount) * 100) : 100;

    return {
      totalCount,
      todayCount,
      todayValides,
      todayEscalades,
      totalValides,
      totalEscalades,
      motifsBreakdown,
      lastTimeToday,
      todayRate
    };
  }, [commandes, todayStr]);

  return (
    <div className="bg-white/90 backdrop-blur-xs rounded-lg border border-black/10 shadow-xs p-3 transition-all duration-200 text-slate-800">
      
      {/* Widget Header */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-black/5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
          <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
          <span>Statistiques d'activité</span>
          <span className="text-[11px] font-normal text-slate-500 capitalize">
            ({formattedTodayDate})
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-0.5 px-1 py-0.5 rounded hover:bg-blue-50 transition-colors"
          title={isExpanded ? "Réduire les détails" : "Afficher plus de détails"}
        >
          <span>{isExpanded ? "Moins" : "Détails"}</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-3 gap-2 pt-2.5 text-center">
        {/* Stat 1: Commandes aujourd'hui (Featured primary metric) */}
        <div className="p-2 rounded-md bg-blue-50/70 border border-blue-100 flex flex-col justify-center">
          <div className="text-[11px] font-medium text-blue-900 leading-tight flex items-center justify-center gap-1">
            <Calendar className="w-3 h-3 text-blue-600" />
            <span>Aujourd'hui</span>
          </div>
          <div className="text-xl font-bold font-mono text-blue-700 tabular-nums mt-0.5">
            {stats.todayCount}
          </div>
          <div className="text-[10px] text-blue-600/80 leading-none mt-0.5 truncate">
            {stats.lastTimeToday ? `Dernière à ${stats.lastTimeToday}` : "Aucune saisie"}
          </div>
        </div>

        {/* Stat 2: Valides aujourd'hui */}
        <div className="p-2 rounded-md bg-emerald-50/70 border border-emerald-100 flex flex-col justify-center">
          <div className="text-[11px] font-medium text-emerald-900 leading-tight flex items-center justify-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span>Valides</span>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-700 tabular-nums mt-0.5">
            {stats.todayValides}
          </div>
          <div className="text-[10px] text-emerald-600/80 leading-none mt-0.5">
            {stats.todayCount > 0 ? `${stats.todayRate}% du jour` : "100%"}
          </div>
        </div>

        {/* Stat 3: Escalades aujourd'hui */}
        <div className="p-2 rounded-md bg-amber-50/70 border border-amber-100 flex flex-col justify-center">
          <div className="text-[11px] font-medium text-amber-900 leading-tight flex items-center justify-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Escalades</span>
          </div>
          <div className="text-xl font-bold font-mono text-amber-700 tabular-nums mt-0.5">
            {stats.todayEscalades}
          </div>
          <div className="text-[10px] text-amber-600/80 leading-none mt-0.5">
            {stats.totalEscalades > 0 ? `${stats.totalEscalades} au total` : "0 au total"}
          </div>
        </div>
      </div>

      {/* Expanded Details Panel */}
      {isExpanded && (
        <div className="mt-2.5 pt-2 border-t border-black/5 text-xs space-y-2 animate-in fade-in duration-150">
          {/* Summary Row */}
          <div className="flex items-center justify-between text-[11px] text-slate-600 px-1">
            <span>Cumul global du fichier :</span>
            <span className="font-semibold text-slate-800 font-mono">
              {stats.totalCount} commande{stats.totalCount > 1 ? 's' : ''} ({stats.totalValides} valides, {stats.totalEscalades} escalades)
            </span>
          </div>

          {/* Motifs breakdown today */}
          {stats.todayCount > 0 && stats.motifsBreakdown.length > 0 && (
            <div className="bg-slate-50/80 rounded p-2 border border-slate-200/60">
              <div className="text-[11px] font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Répartition des motifs aujourd'hui :</span>
                <span className="text-[10px] text-slate-500 font-normal">{stats.todayCount} total</span>
              </div>
              <div className="space-y-1">
                {stats.motifsBreakdown.map(([motif, count]) => {
                  const percentage = Math.round((count / stats.todayCount) * 100);
                  const isValide = motif === 'Valide';
                  return (
                    <div key={motif} className="flex items-center justify-between text-[11px] gap-2">
                      <span className="truncate flex-1 text-slate-700">
                        {motif}
                      </span>
                      <div className="flex items-center gap-1.5 text-right font-mono text-[10px] text-slate-600">
                        <span className={`font-semibold ${isValide ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {count}
                        </span>
                        <span className="text-slate-400">({percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {stats.todayCount === 0 && (
            <div className="text-center py-1.5 text-[11px] text-slate-500 italic">
              Aucune commande enregistrée aujourd'hui pour l'instant. Les statistiques se mettront à jour automatiquement dès la première saisie.
            </div>
          )}
        </div>
      )}

    </div>
  );
};

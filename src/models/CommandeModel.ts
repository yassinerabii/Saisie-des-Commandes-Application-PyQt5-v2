import { CommandeItem, DEFAULT_MOTIFS } from '../types';

export class CommandeModel {
  private outputFileName: string = 'resultats.csv';
  private motifs: string[] = [...DEFAULT_MOTIFS];
  private storageKeyPrefix: string = 'saisie_commandes_csv_';

  constructor(outputFileName: string = 'resultats.csv', motifs?: string[]) {
    this.setOutputFile(outputFileName);
    if (motifs && motifs.length > 0) {
      this.motifs = motifs;
    }
    this.initPreloadedData();
  }

  private initPreloadedData() {
    // Pre-populate test01.csv and test02.csv if not already in localStorage
    const key01 = this.storageKeyPrefix + 'test01.csv';
    if (!localStorage.getItem(key01)) {
      const test01Data: CommandeItem[] = [
        { nombre_commande: 1, num_commande: 'sss', motif: 'Valide', date_validation: '2026-05-04 22:15:45' }
      ];
      localStorage.setItem(key01, JSON.stringify(test01Data));
    }

    const key02 = this.storageKeyPrefix + 'test02.csv';
    if (!localStorage.getItem(key02)) {
      const test02Data: CommandeItem[] = [
        { nombre_commande: 1, num_commande: "GCT08532", motif: "Valide", date_validation: "2026-06-09 09:22:59" },
        { nombre_commande: 2, num_commande: "PH700334", motif: "Valide", date_validation: "2026-06-09 10:10:49" },
        { nombre_commande: 3, num_commande: "1218B", motif: "Valide", date_validation: "2026-06-09 10:45:20" },
        { nombre_commande: 4, num_commande: "9066290", motif: "Valide", date_validation: "2026-06-09 10:51:01" },
        { nombre_commande: 5, num_commande: "7070480-2005995", motif: "Valide", date_validation: "2026-06-09 11:01:43" },
        { nombre_commande: 6, num_commande: "36115", motif: "Valide", date_validation: "2026-06-09 11:28:46" },
        { nombre_commande: 7, num_commande: "7080026-2017832", motif: "Valide", date_validation: "2026-06-09 11:34:26" },
        { nombre_commande: 8, num_commande: "7103722-2008127", motif: "Valide", date_validation: "2026-06-09 12:37:49" },
        { nombre_commande: 9, num_commande: "AXI2606-115760", motif: "Valide", date_validation: "2026-06-09 13:19:32" },
        { nombre_commande: 10, num_commande: "7028185-2007650", motif: "Valide", date_validation: "2026-06-09 13:31:37" },
        { nombre_commande: 11, num_commande: "7116038-2004772", motif: "Valide", date_validation: "2026-06-09 14:11:19" },
        { nombre_commande: 12, num_commande: "31/05/2026", motif: "Divers", date_validation: "2026-06-09 14:13:02" },
        { nombre_commande: 13, num_commande: "PROT150407", motif: "Divers", date_validation: "2026-06-09 14:14:01" },
        { nombre_commande: 14, num_commande: "8229513", motif: "Doute sur a Facturer - a Renouveler", date_validation: "2026-06-09 14:30:15" },
        { nombre_commande: 15, num_commande: "7125478-2006159", motif: "Valide", date_validation: "2026-06-09 15:50:11" },
        { nombre_commande: 16, num_commande: "47204PUD", motif: "Doute sur a Facturer - a Renouveler", date_validation: "2026-06-09 16:31:23" },
        { nombre_commande: 17, num_commande: "7125488-2006169", motif: "Valide", date_validation: "2026-06-09 16:32:22" },
        { nombre_commande: 18, num_commande: "7174451-2030862", motif: "Client inconnu", date_validation: "2026-06-09 16:33:37" },
        { nombre_commande: 19, num_commande: "DM770488", motif: "Divers", date_validation: "2026-06-09 16:34:23" },
        { nombre_commande: 20, num_commande: "PH215504", motif: "Valide", date_validation: "2026-06-09 16:37:28" },
        { nombre_commande: 21, num_commande: "5555", motif: "Produit inconnu", date_validation: "2026-06-11 11:27:16" }
      ];
      localStorage.setItem(key02, JSON.stringify(test02Data));
    }
  }

  public setOutputFile(filename: string): void {
    let clean = filename.trim();
    if (!clean.toLowerCase().endsWith('.csv')) {
      clean += '.csv';
    }
    this.outputFileName = clean;
  }

  public getOutputFileName(): string {
    return this.outputFileName;
  }

  public setMotifs(motifs: string[]): void {
    this.motifs = motifs;
  }

  public getMotifs(): string[] {
    return this.motifs;
  }

  public parseMotifsText(textContent: string): { motifs: string[]; error?: string } {
    try {
      const lines = textContent.split(/\r?\n/);
      const motifs: string[] = [];
      for (const rawLine of lines) {
        const trimmed = rawLine.trim();
        if (trimmed) {
          motifs.push(trimmed);
        }
      }
      if (motifs.length === 0) {
        return { motifs: [], error: 'Le fichier texte sélectionné semble être vide.' };
      }
      this.motifs = motifs;
      return { motifs };
    } catch (e: any) {
      return { motifs: [], error: e.message || 'Erreur de lecture du fichier.' };
    }
  }

  private getStorageKey(): string {
    return this.storageKeyPrefix + this.outputFileName;
  }

  public getAllCommandes(): CommandeItem[] {
    const raw = localStorage.getItem(this.getStorageKey());
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  private saveAllCommandes(commandes: CommandeItem[]): void {
    localStorage.setItem(this.getStorageKey(), JSON.stringify(commandes));
  }

  public saveCommande(num_commande: string, motif: string): { success: boolean; message: string } {
    const trimmedNum = num_commande.trim();
    if (!trimmedNum) {
      return { success: false, message: 'Le numéro de commande ne peut pas être vide.' };
    }

    const currentList = this.getAllCommandes();
    const nextCount = currentList.length + 1;
    
    // Format date as YYYY-MM-DD HH:mm:ss
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const date_val = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const newItem: CommandeItem = {
      nombre_commande: nextCount,
      num_commande: trimmedNum,
      motif: motif || (this.motifs[0] || 'Valide'),
      date_validation: date_val
    };

    currentList.push(newItem);
    this.saveAllCommandes(currentList);

    return {
      success: true,
      message: `La commande ${trimmedNum} a été enregistrée.`
    };
  }

  public getNombreCommandes(): number {
    return this.getAllCommandes().length;
  }

  public getLastCommande(): { num_commande: string; motif: string } | null {
    const list = this.getAllCommandes();
    if (list.length === 0) return null;
    const last = list[list.length - 1];
    return {
      num_commande: last.num_commande,
      motif: last.motif
    };
  }

  public updateCommande(index: number, num_commande: string, motif: string): { success: boolean; message: string } {
    const trimmedNum = num_commande.trim();
    if (!trimmedNum) {
      return { success: false, message: 'Le numéro de commande ne peut pas être vide.' };
    }

    const list = this.getAllCommandes();
    if (index < 0 || index >= list.length) {
      return { success: false, message: 'Index invalide.' };
    }

    list[index].num_commande = trimmedNum;
    list[index].motif = motif;
    this.saveAllCommandes(list);

    return { success: true, message: 'La commande a été modifiée avec succès.' };
  }

  public deleteCommande(index: number): { success: boolean; message: string } {
    const list = this.getAllCommandes();
    if (index < 0 || index >= list.length) {
      return { success: false, message: 'Index invalide.' };
    }

    list.splice(index, 1);
    // Re-index nombre_commande sequentially matching standard CSV behaviour
    list.forEach((item, idx) => {
      item.nombre_commande = idx + 1;
    });

    this.saveAllCommandes(list);
    return { success: true, message: 'La commande a été supprimée avec succès.' };
  }

  public exportCsvContent(): string {
    const list = this.getAllCommandes();
    const rows = ['nombre_commande;num_commande;motif;date_validation'];
    for (const item of list) {
      rows.push(`${item.nombre_commande};${item.num_commande};${item.motif};${item.date_validation}`);
    }
    return rows.join('\r\n') + '\r\n';
  }

  public downloadCsv(): void {
    const content = this.exportCsvContent();
    // Add BOM for Microsoft Excel compatibility with UTF-8 accented characters
    const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', this.outputFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  public importCsv(content: string): { success: boolean; count: number; error?: string } {
    try {
      const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
      if (lines.length === 0) {
        return { success: false, count: 0, error: 'Fichier CSV vide' };
      }

      // Check header
      const startIndex = lines[0].toLowerCase().includes('num_commande') ? 1 : 0;
      const imported: CommandeItem[] = [];

      for (let i = startIndex; i < lines.length; i++) {
        const cols = lines[i].split(';');
        if (cols.length >= 3) {
          // Could be [num, motif, date] or [nombre, num, motif, date]
          let num = '';
          let motif = '';
          let date = '';
          if (cols.length >= 4) {
            num = cols[1].trim();
            motif = cols[2].trim();
            date = cols[3].trim();
          } else {
            num = cols[0].trim();
            motif = cols[1].trim();
            date = cols[2].trim();
          }

          if (num) {
            imported.push({
              nombre_commande: imported.length + 1,
              num_commande: num,
              motif: motif || 'Valide',
              date_validation: date || new Date().toISOString().replace('T', ' ').substring(0, 19)
            });
          }
        }
      }

      if (imported.length > 0) {
        this.saveAllCommandes(imported);
        return { success: true, count: imported.length };
      } else {
        return { success: false, count: 0, error: 'Aucune commande valide trouvée dans le CSV.' };
      }
    } catch (err: any) {
      return { success: false, count: 0, error: err.message };
    }
  }
}

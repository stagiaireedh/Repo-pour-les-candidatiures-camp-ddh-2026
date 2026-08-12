import React from 'react';
import { MapPin, Mail, Phone, Building2, Inbox, Lock } from 'lucide-react';

interface FooterProps {
  onNavigateAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateAdmin }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t-4 border-[#D9232A] pt-10 pb-8 mt-16 relative overflow-hidden">
      {/* Decorative Cyan Accent line under top border */}
      <div className="h-1 bg-[#0084B4] w-full absolute top-0 left-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-800">
          
          {/* Organization & Mission */}
          <div className="md:col-span-6 space-y-4">
            <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
              ONG Changement Social Bénin
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
              Nous œuvrons pour un Bénin où les conditions sont créées en vue de satisfaire à tous les droits humains sans distinction aucune.
            </p>
          </div>

          {/* Addresses & Contacts */}
          <div className="md:col-span-6 space-y-3">
            <h4 className="text-xs font-black text-[#0084B4] uppercase tracking-wider pb-1 border-b border-slate-800">
              ADRESSE
            </h4>
            
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D9232A] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Siège national :</strong> Sis au lot V-3174a, YENADJRO (Womey/Abomey-Calavi)
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-[#0084B4] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Bureau Régional :</strong> Amawignon/Parakou (Goudron YAYI BONI)
                </span>
              </li>

              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#0084B4] shrink-0" />
                <a 
                  href="mailto:secretariat@csbenin.org" 
                  className="text-slate-300 hover:text-white hover:underline transition-colors"
                >
                  secretariat@csbenin.org
                </a>
              </li>

              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#0084B4] shrink-0" />
                <a 
                  href="tel:+2290167544079" 
                  className="text-slate-300 hover:text-white hover:underline transition-colors"
                >
                  00 (229) 01 67 54 40 79
                </a>
              </li>

              <li className="flex items-center gap-2.5">
                <Inbox className="w-4 h-4 text-[#0084B4] shrink-0" />
                <span>
                  <strong className="text-white">BP :</strong> 565 Womey/Abomey-Calavi
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & Discreet Admin Link */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} ONG Changement Social Bénin. Tous droits réservés.</p>
          
          {onNavigateAdmin ? (
            <button
              onClick={onNavigateAdmin}
              className="flex items-center gap-1.5 text-slate-500 hover:text-amber-400 text-xs transition-colors cursor-pointer py-1 px-2 rounded hover:bg-slate-900"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Accès Espace Administration</span>
            </button>
          ) : (
            <a
              href="/admin"
              className="flex items-center gap-1.5 text-slate-500 hover:text-amber-400 text-xs transition-colors py-1 px-2 rounded hover:bg-slate-900"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Accès Espace Administration</span>
            </a>
          )}
        </div>

      </div>
    </footer>
  );
};



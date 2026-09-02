import React from 'react';
import enteteImg from '../assets/entete.png';
import { 
  Sparkles, 
  Calendar, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  ShieldCheck, 
  Users, 
  Target, 
  Clock, 
  HelpCircle,
  FileCheck2
} from 'lucide-react';

interface PublicCallPageProps {
  onStartApplication: () => void;
  onOpenAdmin?: () => void;
}

export const PublicCallPage: React.FC<PublicCallPageProps> = ({
  onStartApplication
}) => {
  return (
    <div className="space-y-12 pb-12">
      
      {/* Hero Poster Banner Section */}
      <section className="relative bg-gradient-to-b from-[#0084B4]/10 via-white to-slate-50 border border-slate-300 rounded-3xl p-5 sm:p-10 shadow-md space-y-6 sm:space-y-8">
        
        {/* Entête officielle CSB */}
        <div className="w-full">
          <img src={enteteImg} alt="Entête officielle CSB — Appel à Mini-Activités 2026" className="w-full h-auto rounded-xl" />
        </div>

        {/* Main Poster Visual Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Visual Badge: CAMP 2026 DDH Badge (Matching Poster Visuals) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center space-y-4">
            
            <div className="relative p-6 sm:p-7 bg-white rounded-3xl border-2 border-[#D9232A]/40 shadow-xl w-full max-w-sm">
              
              {/* Red "CAMP" block */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl sm:text-5xl font-black tracking-wider text-[#D9232A] uppercase">
                  CAMP
                </span>
                
                {/* Cyan Blue "2026" Inset Pill */}
                <span className="inline-block px-3 py-1 bg-[#0084B4] text-white font-black text-lg sm:text-xl rounded-xl shadow-sm border-2 border-white">
                  2026
                </span>
              </div>

              {/* Bold High-Contrast "DDH" Badge */}
              <div className="my-3 py-3 bg-gradient-to-r from-[#D9232A] to-[#7A0C10] text-white rounded-2xl shadow-md">
                <span className="text-5xl sm:text-6xl font-black tracking-widest block">
                  DDH
                </span>
                <span className="text-xs sm:text-sm text-amber-200 font-extrabold uppercase tracking-wider block mt-1">
                  Défenseurs des Droits Humains
                </span>
              </div>

              {/* Cyan Solid Pill: 3ÈME ÉDITION */}
              <div className="inline-block bg-[#0084B4] text-white font-black text-xs sm:text-sm uppercase tracking-widest px-6 py-2 rounded-full shadow-sm border border-white">
                3ᵉ ÉDITION NATIONALE
              </div>

            </div>

            {/* Official Date Badge Card (Matching Poster 2) */}
            <div className="w-full max-w-sm bg-[#1F4E79] text-white p-3.5 rounded-2xl shadow-md flex items-center justify-between border-2 border-white/20">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wide text-blue-100">Période du Camp :</span>
              <span className="bg-white text-[#D9232A] font-black text-xs sm:text-sm px-3.5 py-1 rounded-xl shadow-xs">
                09 – 15 Août 2026
              </span>
            </div>

          </div>

          {/* Right Main Text & Callout (Matching Poster 1 & 3) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Pinned Tag Badge: APPEL À CANDIDATURES */}
            <div className="inline-flex flex-wrap items-center gap-2.5 bg-[#D9232A] text-white px-4 sm:px-5 py-2.5 rounded-2xl shadow-lg border-2 border-white/40 font-black text-xs sm:text-base tracking-wide uppercase">
              <span className="w-2.5 h-2.5 bg-amber-300 rounded-full shrink-0"></span>
              <span>APPEL À CANDIDATURES</span>
              <span className="bg-white text-[#D9232A] text-xs sm:text-sm font-black px-3 py-0.5 rounded-lg shadow-xs">
                SDR · SENSIBILISATION · PLAIDOYER DESC
              </span>
            </div>

            {/* Main Title Card matching Poster Visual Charter */}
            <div className="bg-[#1F4E79] text-white p-6 sm:p-7 rounded-2xl shadow-xl space-y-3 border-2 border-cyan-400/50">
              <div className="inline-block bg-[#D9232A] text-white text-xs sm:text-sm font-black uppercase px-3 py-1 rounded-md tracking-wider border border-white/30">
                THÈME OFFICIEL DU CAMP 2026
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white uppercase leading-snug">
                LES DESC EN ARRIMAGE AVEC LA VISION BÉNIN 2060 : <br className="hidden sm:inline" />
                <span className="text-amber-300">THÉORIE, PRATIQUE ET ENSEIGNEMENTS</span>
              </h1>
            </div>

            {/* Info Badges Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-extrabold text-slate-900">
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-100 border border-slate-300">
                <Calendar className="w-5 h-5 text-[#0084B4] shrink-0" />
                <span><strong>Durée :</strong> 05 Jours Intensifs (09 au 15 Août 2026)</span>
              </div>

              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-100 border border-slate-300">
                <Users className="w-5 h-5 text-[#D9232A] shrink-0" />
                <span><strong>Cible :</strong> 24 Jeunes des 12 Départements (Parité H/F)</span>
              </div>
            </div>

            {/* Call to action button */}
            <div className="pt-2 flex items-center">
              <button
                type="button"
                onClick={onStartApplication}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#D9232A] hover:bg-[#b51b21] text-white font-black text-sm sm:text-base transition-all shadow-lg flex items-center justify-center gap-2 group cursor-pointer border-2 border-amber-300/60"
              >
                <span>DÉPOSER MA CANDIDATURE (MINI-ACTIVITÉ)</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

        </div>

        {/* Official Slogan Calligraphy Bar at Bottom of Banner */}
        <div className="pt-4 border-t border-slate-300 text-center">
          <p className="font-serif italic text-base sm:text-lg text-[#D9232A] font-extrabold tracking-wide">
            « Agir avec une saine conviction pour un changement social »
          </p>
        </div>

      </section>

      {/* 1. Contexte et Objectifs */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-300 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#EBF3FB] text-[#1F4E79] flex items-center justify-center font-bold border border-blue-200">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">1. Contexte & Justification de l'Initiative</h2>
          </div>
        </div>

        {/* Quote & Historical Context */}
        <div className="bg-[#EBF3FB] border-l-4 border-[#1F4E79] p-4 sm:p-5 rounded-r-xl space-y-2 text-xs sm:text-sm">
          <p className="italic text-[#1F4E79] font-bold text-sm sm:text-base">
            « L'éducation est l'arme la plus puissante que vous puissiez utiliser pour changer le monde » — Nelson Mandela
          </p>
          <p className="text-slate-800 leading-relaxed font-medium">
            Le Rapport sur le Développement Humain 2025 du PNUD classe le Bénin au <strong>173ᵉ rang mondial sur 193 pays</strong> (faible développement humain), révélant des déficits majeurs en matière de Droits Économiques, Sociaux et Culturels (DESC). Par ailleurs, le 4 juillet 2025, l'Assemblée nationale a adopté la <strong>Loi n°2025-16 portant Vision nationale de développement à l'horizon 2060 (« Bénin 2060 Alafia »)</strong>. La promotion de l'État de droit et de la gouvernance éthique (5ᵉ axe) exige une jeunesse formée et consciente de ses droits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#EBF3FB] p-5 rounded-xl border border-blue-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#1F4E79] text-amber-300 flex items-center justify-center font-black text-xs">
              SDR
            </div>
            <h3 className="font-extrabold text-[#1F4E79] text-sm sm:text-base">Surveillance - Documentation - Rapportage</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              Documenter et rapporter rigoureusement les cas d'atteintes aux DESC et alimenter les mécanismes de redevabilité.
            </p>
          </div>

          <div className="bg-[#EBF3FB] p-5 rounded-xl border border-blue-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#1F4E79] text-amber-300 flex items-center justify-center font-black text-xs">
              SEN
            </div>
            <h3 className="font-extrabold text-[#1F4E79] text-sm sm:text-base">Sensibilisation aux DESC</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              Informer et autonomiser les communautés de base (femmes, jeunes, artisans) sur le cadre normatif DESC et les recours légaux.
            </p>
          </div>

          <div className="bg-[#EBF3FB] p-5 rounded-xl border border-blue-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#1F4E79] text-amber-300 flex items-center justify-center font-black text-xs">
              DESC
            </div>
            <h3 className="font-extrabold text-[#1F4E79] text-sm sm:text-base">Plaidoyer</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              Plaider en s'appuyant sur les critères du Comité DESC de l'ONU (Disponibilité, Accessibilité, Acceptabilité, Qualité) et les axes de la Vision 2060.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Critères d'Éligibilité & Ce que gagnent les lauréats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Critères */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-300 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold border border-emerald-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Critères d'Éligibilité</h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">Pour soumettre votre dossier de mini-activité</p>
            </div>
          </div>

          <ul className="space-y-3 text-xs sm:text-sm text-slate-800 font-medium">
            <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center shrink-0 text-xs border border-emerald-300">1</span>
              <span><strong>Qualité de participant-e :</strong> Être sélectionné-e et participer effectivement au 3ᵉ Camp National des Jeunes (9–16 août 2026).</span>
            </li>
            <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center shrink-0 text-xs border border-emerald-300">2</span>
              <span><strong>Thématique ciblée :</strong> S'inscrire dans l'un des trois domaines : SDR, Sensibilisation Droits Humains, ou Plaidoyer DESC.</span>
            </li>
            <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center shrink-0 text-xs border border-emerald-300">3</span>
              <span><strong>Pertinence locale DESC & Vision 2060 :</strong> Répondre à un besoin réel de sa localité, en lien avec les DESC et ayant un alignement clair avec la Vision Bénin 2060.</span>
            </li>
            <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center shrink-0 text-xs border border-emerald-300">4</span>
              <span><strong>Faisabilité budgétaire :</strong> Présenter un budget réaliste et transparent</span>
            </li>
          </ul>
        </section>

        {/* Gain des lauréats */}
        <section className="bg-gradient-to-br from-[#7A0C10] to-[#54070a] text-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 border-2 border-red-900">
          <div className="flex items-center gap-3 border-b border-white/20 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">Ce que gagnent les 03 Lauréat-e-s</h2>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-amber-50">
            <div className="p-3.5 rounded-xl bg-white/10 border border-white/20 space-y-1">
              <h4 className="font-extrabold text-amber-300 text-sm sm:text-base flex items-center gap-2">
                <span>1. Coaching & Mentorat Technique</span>
              </h4>
              <p className="font-medium text-blue-50">Un suivi personnalisé par des expert-e-s de CSB pour la mise en oeuvre de la mini-activité</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/10 border border-white/20 space-y-1">
              <h4 className="font-extrabold text-amber-300 text-sm sm:text-base flex items-center gap-2">
                <span>2. Appui Logistique</span>
              </h4>
              <p className="font-medium text-blue-50">CSB apporte un soutien logistique concret pour la mise en oeuvre de la mini activité</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/10 border border-white/20 space-y-1">
              <h4 className="font-extrabold text-amber-300 text-sm sm:text-base flex items-center gap-2">
                <span>3. Visibilité Institutionnelle</span>
              </h4>
              <p className="font-medium text-blue-50">Mise en valeur du projet sur les plateformes officielles de CSB</p>
            </div>
          </div>
        </section>

      </div>

      {/* 3. Calendrier Officiel du Projet */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-300">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold border border-amber-300">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Calendrier Officiel du Projet (Camp & Mini-Activités)</h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">Chronogramme officiel des étapes de sélection et de mise en œuvre</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <div className="p-4 sm:p-5 rounded-xl bg-[#EBF3FB] border border-blue-200 space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#1F4E79] bg-white px-2.5 py-1 rounded border border-blue-300 inline-block">
              Activité 1 · Camp DDH
            </span>
            <p className="text-sm sm:text-base font-black text-[#1F4E79]">9 au 16 Août 2026</p>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">Déroulement du 3ᵉ Camp National des Jeunes sur les Droits Humains à l'attention des 24 jeunes retenu-e-s.</p>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#7A0C10] bg-white px-2.5 py-1 rounded border border-rose-300 inline-block">
              Soumission Mini-Activités
            </span>
            <p className="text-sm sm:text-base font-black text-[#7A0C10]">14 au 28 Août 2026</p>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">Période de 2 semaines post-camp pour la rédaction et le dépôt des propositions de mini-activités sur la plateforme.</p>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-white px-2.5 py-1 rounded border border-amber-300 inline-block">
              Présélection Top 10
            </span>
            <p className="text-sm sm:text-base font-black text-amber-950">1ᵉʳ au 14 Septembre 2026</p>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">Analyse rigoureuse par le Comité Scientifique de CSB et présélection des 10 meilleures propositions.</p>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-purple-50 border border-purple-200 space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-purple-900 bg-white px-2.5 py-1 rounded border border-purple-300 inline-block">
              Grand Oral en Ligne
            </span>
            <p className="text-sm sm:text-base font-black text-purple-950">15 au 19 Septembre 2026</p>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">Séance en ligne de présentation orale des 10 projets devant le jury du Comité Scientifique.</p>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-900 bg-white px-2.5 py-1 rounded border border-emerald-300 inline-block">
              Sélection des 3 Lauréat-e-s
            </span>
            <p className="text-sm sm:text-base font-black text-emerald-950">22 au 24 Septembre 2026</p>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">Délibération finale, annonce officielle et attribution d'un cadre mentor CSB à chaque porteur-se.</p>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-blue-950 bg-white px-2.5 py-1 rounded border border-blue-300 inline-block">
              Déploiement Terrain
            </span>
            <p className="text-sm sm:text-base font-black text-blue-950">2 Octobre au 30 Décembre 2026</p>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">Mise en œuvre des 3 mini-activités sur le terrain avec l'accompagnement technique et logistique de CSB.</p>
          </div>

        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="bg-gradient-to-r from-[#1F4E79] to-[#7A0C10] text-white p-6 sm:p-10 rounded-2xl text-center space-y-4 shadow-lg border-2 border-white/20">
        <h3 className="text-xl sm:text-2xl font-black">Prêt-e à faire passer vos apprentissages à l'action ?</h3>
        <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mx-auto font-medium">
          Préparez votre dossier étape par étape. Votre travail est automatiquement sauvegardé à chaque étape en cours de rédaction !
        </p>
        <button
          type="button"
          onClick={onStartApplication}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-400 text-slate-950 font-black text-xs sm:text-sm hover:bg-amber-300 transition-all shadow-md cursor-pointer border border-amber-200"
        >
          <FileCheck2 className="w-5 h-5 text-slate-900" />
          <span>Commencer ma candidature maintenant</span>
        </button>
      </section>

    </div>
  );
};

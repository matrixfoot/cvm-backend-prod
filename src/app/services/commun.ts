import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommunService {

    statuscollab:string[]=['traité']
    statusadmin:string[]=['en cours de supervision','supervisé','en cours de validation','validé','en cours de clôture','clôturé','à rectifié']
    nature: any[]=["Personne Physique","Personne Morale"];
    regimeimpot: any[]=["Réel","Forfait D'assiette","Non soumis"];
    natureactivite: any[]=["Profession Libérale","associations et syndics","Commerçant","Artisan","Salarié ou Pensionnaire"];
    activites: any[]=["Médecin","Avocat","Consultant","Expert","Infirmier","Masseur","Physiothérapeute","Ergothérapeute","Psychomotricien",
    "Diététicien","Orthophoniste","Orthoptiste","Sage-femmes","Architectes","Dessinateurs","Géomètres","Notaire","Huissiers notaire (de justice)", "Interprètes",
    "Ingénieurs-conseil","Topographes","Syndic des copropriétaires","Autre"];
    sousactivites: any[]=["Avocat","Avocat à la cour d'appel","Avocat à la cour de cassation","Médecin","Médecin spécialiste","Médecin dentiste","Médecin vétérinaire"];
    specialites: any[]=["Chirurgie générale",
    "Chirurgie pédiatrique",
    "Chirurgie carcinologique",
    "Chirurgie cardio-vasculaire",
    "Chirurgie vasculaire périphérique",
    "Chirurgie neurologique",
    "Chirurgie orthopédique et traumatologique",
    "Chirurgie plastique, réparatrice et esthétique",
    "Chirurgie urologique",
    "Gynéco-obstétrique",
    "ORL",
    "Stomatologie et chirurgie maxillo-faciale",
    "Ophtalmologie",
    "Chirurgie thoracique",
    "Anesthésie réanimation",
    "Psychiatrie",
    "Pédo-psychiatrie",
    "Imagerie médicale",
    "Anatomie",
    "Anatomie et cytologie pathologiques",
    "Carcinologie médicale",
    "Cardiologie",
    "Dermatologie",
    "Endocrinologie",
    "Gastro-entérologie",
    "Hématologie clinique",
    "Maladies infectieuses",
    "Médecine d’urgence",
    "Médecine de travail",
    "Médecine interne",
    "Médecine légale",
    "Médecine physique, rééducation et réadaptation fonctionnelle",
    "Médecine préventive et communautaire",
    "Néphrologie",
    "Neurologie",
    "Nutrition et maladies nutritionnelles",
    "Pédiatrie",
    "Pneumologie",
    "Radiothérapie carcinologique",
    "Réanimation médicale",
    "Rhumatologie",
    "Biophysique et médecine nucléaire",
    "Génétique",
    "Biologie médicale option biochimie",
    "Biologie médicale option hématologie",
    "Biologie médicale option parasitologie",
    "Biologie médicale option microbiologie",
    "Biologie médicale option immunologie",
    "Histo-embryologie",
    "Pharmacologie",
    "Physiologie et explorations fonctionnelles"];
    sousspecialites: any[]=[];
    sousactivitesavocat: string[]=["Avocat","Avocat à la cour d'appel","Avocat à la cour de cassation"];
    sousactivitesmedecin: string[]=["Médecin","Médecin spécialiste","Médecin dentiste","Médecin vétérinaire"];
    specialitesmedecinspecialiste: string[]=["Chirurgie générale",
    "Chirurgie pédiatrique",
    "Chirurgie carcinologique",
    "Chirurgie cardio-vasculaire",
    "Chirurgie vasculaire périphérique",
    "Chirurgie neurologique",
    "Chirurgie orthopédique et traumatologique",
    "Chirurgie plastique, réparatrice et esthétique",
    "Chirurgie urologique",
    "Gynéco-obstétrique",
    "ORL",
    "Stomatologie et chirurgie maxillo-faciale",
    "Ophtalmologie",
    "Chirurgie thoracique",
    "Anesthésie réanimation",
    "Psychiatrie",
    "Pédo-psychiatrie",
    "Imagerie médicale",
    "Anatomie",
    "Anatomie et cytologie pathologiques",
    "Carcinologie médicale",
    "Cardiologie",
    "Dermatologie",
    "Endocrinologie",
    "Gastro-entérologie",
    "Hématologie clinique",
    "Maladies infectieuses",
    "Médecine d’urgence",
    "Médecine de travail",
    "Médecine interne",
    "Médecine légale",
    "Médecine physique, rééducation et réadaptation fonctionnelle",
    "Médecine préventive et communautaire",
    "Néphrologie",
    "Neurologie",
    "Nutrition et maladies nutritionnelles",
    "Pédiatrie",
    "Pneumologie",
    "Radiothérapie carcinologique",
    "Réanimation médicale",
    "Rhumatologie",
    "Biophysique et médecine nucléaire",
    "Génétique",
    "Biologie médicale option biochimie",
    "Biologie médicale option hématologie",
    "Biologie médicale option parasitologie",
    "Biologie médicale option microbiologie",
    "Biologie médicale option immunologie",
    "Histo-embryologie",
    "Pharmacologie",
    "Physiologie et explorations fonctionnelles"];
    activitesassociation: string[];
    activitesassociations: any[]=["Syndic des copropriétaires"];
    activitesliberales: string[]=["Médecin","Avocat","Consultant","Expert","Infirmier","Masseur","Physiothérapeute","Ergothérapeute","Psychomotricien",
    "Diététicien","Orthophoniste","Orthoptiste","Sage-femmes","Architectes","Dessinateurs","Géomètres","Notaire","Huissiers notaire (de justice)", "Interprètes",
    "Ingénieurs-conseil","Topographes","Autre"];
  constructor() {

  }
}
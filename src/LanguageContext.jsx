import React, { createContext, useState, useContext } from 'react';

const translations = {
  EN: {
    heroTitle: "Make your foreign degree work in Italy",
    heroSub: "We guide immigrants through Italy's degree recognition process and connect them to free training and jobs.",
    getGuide: "Get free guide",
    emailPlaceholder: "Enter your email",
    socialProof: "Join 1,000+ professionals who validated their skills.",
    featuresTitle: "Overcome the barriers",
    featuresSub: "The path to professional success in Italy shouldn't be blocked by red tape. We bridge the gap.",
    prob1: "Degree not recognised?",
    sol1: "We navigate the bureaucracy to get your qualifications validated in Italy.",
    prob2: "Training gap?",
    sol2: "Access curated, free upskilling courses tailored to the Italian job market.",
    prob3: "Can't find right job?",
    sol3: "Connect directly with inclusive employers looking for your exact skills.",
    targetTitle: "Who is this for?",
    targetSub: "If you hold a foreign degree and want to resume your professional career in Italy, we are here to help. We specifically support:",
    engineers: "Engineers",
    nurses: "Nurses",
    teachers: "Teachers",
    accountants: "Accountants",
    andMore: "+ and many more",
    partnersTitle: "Trusted by institutional partners",
    loginBtn: "Login",
    getGuideBtn: "Get your guide",
    quote: "\"Italy does not lack opportunity, it lacks structure.\"",
    emailTitle: "Email address",
    welcomeBack: "Welcome back",
    createAccount: "Create an account",
    authDesc: "Enter your email to receive a secure magic link. No passwords needed.",
    sendLink: "Send Magic Link",
    sending: "Sending...",
    checkEmail: "Check your email",
    magicLinkSent: "We sent a magic link to",
    clickIt: "Click it to",
    logInTo: "log in to",
    switchToSign: "Don't have an account? Sign up",
    switchToLog: "Already have an account? Log in"
  },
  IT: {
    heroTitle: "Fai valere la tua laurea straniera in Italia",
    heroSub: "Guidiamo gli immigrati nel processo di riconoscimento della laurea in Italia e li colleghiamo a formazione e lavori gratuiti.",
    getGuide: "Ottieni la guida gratuita",
    emailPlaceholder: "Inserisci la tua email",
    socialProof: "Unisciti a oltre 1.000 professionisti che hanno convalidato le proprie competenze.",
    featuresTitle: "Superare le barriere",
    featuresSub: "Il percorso verso il successo in Italia non dovrebbe essere bloccato dalla burocrazia. Noi colmiamo il divario.",
    prob1: "Titolo di studio non riconosciuto?",
    sol1: "Ci occupiamo della burocrazia per far convalidare le tue qualifiche in Italia.",
    prob2: "Lacune formative?",
    sol2: "Accedi a corsi di aggiornamento gratuiti, pensati per il mercato del lavoro italiano.",
    prob3: "Non trovi il lavoro giusto?",
    sol3: "Entra in contatto direttamente con datori di lavoro in cerca delle tue competenze.",
    targetTitle: "Per chi è questo?",
    targetSub: "Se possiedi una laurea straniera e vuoi riprendere la tua carriera in Italia, siamo qui per aiutarti. Supportiamo in particolare:",
    engineers: "Ingegneri",
    nurses: "Infermieri",
    teachers: "Insegnanti",
    accountants: "Contabili",
    andMore: "+ e molti altri",
    partnersTitle: "Scelti dai partner istituzionali",
    loginBtn: "Accedi",
    getGuideBtn: "Ottieni la guida",
    quote: "\"All'Italia non mancano le opportunità, manca la struttura.\"",
    emailTitle: "Indirizzo Email",
    welcomeBack: "Bentornato",
    createAccount: "Crea un account",
    authDesc: "Inserisci la tua email per ricevere un link magico sicuro. Nessuna password richiesta.",
    sendLink: "Invia Link Magico",
    sending: "Invio in corso...",
    checkEmail: "Controlla la tua email",
    magicLinkSent: "Abbiamo inviato un magic link a",
    clickIt: "Cliccalo per",
    logInTo: "accedere al",
    switchToSign: "Non hai un account? Registrati",
    switchToLog: "Hai già un account? Accedi"
  },
  FR: {
    heroTitle: "Faites valoir votre diplôme étranger en Italie",
    heroSub: "Nous guidons les immigrants dans le processus de reconnaissance des diplômes et les connectons à des formations et emplois.",
    getGuide: "Obtenez le guide gratuit",
    emailPlaceholder: "Entrez votre e-mail",
    socialProof: "Rejoignez plus de 1 000 professionnels qui ont validé leurs compétences.",
    featuresTitle: "Surmonter les barrières",
    featuresSub: "Le chemin vers la réussite en Italie ne devrait pas être bloqué par la bureaucratie.",
    prob1: "Diplôme non reconnu ?",
    sol1: "Nous naviguons dans la bureaucratie pour faire valider vos qualifications en Italie.",
    prob2: "Déficit de formation ?",
    sol2: "Accédez à des cours de perfectionnement gratuits et adaptés au marché du travail italien.",
    prob3: "Pas le bon emploi ?",
    sol3: "Connectez-vous avec des employeurs inclusifs à la recherche de vos compétences.",
    targetTitle: "Pour qui est-ce ?",
    targetSub: "Si vous possédez un diplôme étranger et souhaitez reprendre votre carrière en Italie, nous sommes là pour vous aider :",
    engineers: "Ingénieurs",
    nurses: "Infirmières",
    teachers: "Enseignants",
    accountants: "Comptables",
    andMore: "+ et bien d'autres",
    partnersTitle: "Approuvé par des partenaires institutionnels",
    loginBtn: "Connexion",
    getGuideBtn: "Obtenez votre guide",
    quote: "\"L'Italie ne manque pas d'opportunités, elle manque de structure.\"",
    emailTitle: "Adresse e-mail",
    welcomeBack: "Bon retour",
    createAccount: "Créer un compte",
    authDesc: "Entrez votre email pour recevoir un lien magique sécurisé. Aucun mot de passe requis.",
    sendLink: "Envoyer le lien magique",
    sending: "Envoi en cours...",
    checkEmail: "Vérifiez vos e-mails",
    magicLinkSent: "Nous avons envoyé un lien magique à",
    clickIt: "Cliquez dessus pour",
    logInTo: "vous connecter à",
    switchToSign: "Vous n'avez pas de compte ? S'inscrire",
    switchToLog: "Déjà un compte ? Connexion"
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('EN');

  const t = (key) => {
    // Fallback to EN if translation is missing in the selected language
    return translations[language]?.[key] || translations['EN'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

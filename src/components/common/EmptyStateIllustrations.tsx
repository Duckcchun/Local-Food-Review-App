/**
 * Lightweight SVG illustrations for empty states.
 * Designed to match the app's warm green/beige color palette.
 */

export function NoApplicationsIllustration({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="56" fill="#f0f9f4" />
      <rect x="35" y="30" width="50" height="60" rx="8" fill="white" stroke="#6b8e6f" strokeWidth="2" />
      <line x1="45" y1="45" x2="75" y2="45" stroke="#d4c5a0" strokeWidth="2" strokeLinecap="round" />
      <line x1="45" y1="55" x2="70" y2="55" stroke="#d4c5a0" strokeWidth="2" strokeLinecap="round" />
      <line x1="45" y1="65" x2="65" y2="65" stroke="#d4c5a0" strokeWidth="2" strokeLinecap="round" />
      <circle cx="80" cy="80" r="16" fill="#fff4e0" stroke="#f5a145" strokeWidth="2" />
      <path d="M74 80h12M80 74v12" stroke="#f5a145" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function NoFavoritesIllustration({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="56" fill="#f0f9f4" />
      <path d="M60 85L38 65C32 59 32 49 38 43C44 37 54 37 60 43C66 37 76 37 82 43C88 49 88 59 82 65L60 85Z" 
            fill="#fff4e0" stroke="#f5a145" strokeWidth="2" strokeLinejoin="round" />
      <path d="M50 55L55 60L70 48" stroke="#6b8e6f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
    </svg>
  );
}

export function NoNotificationsIllustration({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="56" fill="#f0f9f4" />
      <path d="M60 35C48 35 40 43 40 53V68L35 78H85L80 68V53C80 43 72 35 60 35Z" 
            fill="white" stroke="#6b8e6f" strokeWidth="2" strokeLinejoin="round" />
      <path d="M52 78C52 83 55 87 60 87C65 87 68 83 68 78" stroke="#6b8e6f" strokeWidth="2" strokeLinecap="round" />
      <circle cx="60" cy="55" r="3" fill="#d4c5a0" />
      <path d="M60 62V67" stroke="#d4c5a0" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function NoReviewsIllustration({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="56" fill="#f0f9f4" />
      <rect x="30" y="35" width="60" height="50" rx="12" fill="white" stroke="#6b8e6f" strokeWidth="2" />
      <path d="M45 50L55 60L75 45" stroke="#6b8e6f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="45" y1="70" x2="75" y2="70" stroke="#d4c5a0" strokeWidth="2" strokeLinecap="round" />
      <circle cx="82" cy="40" r="12" fill="#fff4e0" stroke="#f5a145" strokeWidth="1.5" />
      <text x="82" y="45" textAnchor="middle" fontSize="14" fill="#f5a145">✍</text>
    </svg>
  );
}

export function NoProductsIllustration({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="56" fill="#f0f9f4" />
      <rect x="30" y="40" width="60" height="45" rx="10" fill="white" stroke="#6b8e6f" strokeWidth="2" />
      <path d="M30 55H90" stroke="#d4c5a0" strokeWidth="1.5" />
      <circle cx="45" cy="48" r="3" fill="#f5a145" />
      <circle cx="55" cy="48" r="3" fill="#6b8e6f" />
      <circle cx="65" cy="48" r="3" fill="#d4c5a0" />
      <rect x="40" y="62" width="40" height="15" rx="4" fill="#f5f0dc" stroke="#d4c5a0" strokeWidth="1" />
      <line x1="50" y1="69" x2="70" y2="69" stroke="#9ca89d" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

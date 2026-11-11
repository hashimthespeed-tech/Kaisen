export default function SeedLogo() {
  return <svg className="seed-logo" viewBox="0 0 72 92" role="img" aria-label="Brand mark">
    <defs><linearGradient id="seed-shell" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#076348"/><stop offset="1" stopColor="#073B2E"/></linearGradient><linearGradient id="seed-core" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#6cf7ad"/><stop offset="1" stopColor="#08C98A"/></linearGradient></defs>
    <path d="M36 2C15 12 4 32 4 48c0 21 14 37 32 42V2Z" fill="url(#seed-shell)"/>
    <path d="M36 2c21 10 32 30 32 46 0 21-14 37-32 42V2Z" fill="#03432f"/>
    <path d="M36 1 24 46l12 45 12-45L36 1Z" fill="white"/>
    <path d="M36 16 29 46l7 29 7-29-7-30Z" fill="url(#seed-core)"/>
  </svg>;
}

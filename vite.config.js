import { defineConfig, loadEnv } from 'vite'

// Réglages lus dans .env (local) ou .env.production (déploiement).
const REQUIS = ['VITE_SITE_URL', 'VITE_WOURA_URL', 'VITE_WHATSAPP_NUMBER', 'VITE_PHONE_DISPLAY']

// Message pré-rempli de chaque bouton WhatsApp, selon l'endroit où l'on clique.
// Dans index.html : %WA_INFO%, %WA_STOCK%… ; %TEL% donne le lien d'appel.
const MESSAGES = {
  WA_INFO: "Bonjour Koya Express, je voudrais en savoir plus sur vos services pour e-commerçants.",
  WA_STOCK: "Bonjour Koya Express, je suis e-commerçant et je veux vous confier mon stock.",
  WA_WOURA: "Bonjour Koya Express, je veux mon mois de Woura Pro offert en vous confiant mon stock.",
  WA_EXPORT: "Bonjour Koya Express, je vends depuis l'étranger et je veux tester le marché béninois.",
  WA_TARIF: "Bonjour Koya Express, je voudrais un tarif précis pour mes livraisons.",
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const manquants = REQUIS.filter((cle) => !env[cle])
  if (manquants.length) {
    throw new Error(`Réglages manquants (voir .env.example) : ${manquants.join(', ')}`)
  }

  const numero = env.VITE_WHATSAPP_NUMBER.replace(/\D/g, '')
  const liens = { TEL: `tel:+${numero}` }
  for (const [cle, texte] of Object.entries(MESSAGES)) {
    liens[cle] = `https://wa.me/${numero}?text=${encodeURIComponent(texte)}`
  }

  return {
    plugins: [{
      name: 'liens-contact',
      transformIndexHtml: (html) => html.replace(/%(WA_[A-Z]+|TEL)%/g, (_, cle) => {
        if (!liens[cle]) throw new Error(`Lien inconnu dans index.html : %${cle}%`)
        return liens[cle]
      }),
    }],
    build: { assetsInlineLimit: 2048 },
  }
})

# Déployer la landing Koya Express

Site statique (HTML + CSS, aucun JavaScript), construit par Vite et servi par
nginx. Même chaîne que le cockpit : même serveur, même réseau Docker
`codetrine`, même Caddy pour le HTTPS.

| Branche poussée | Adresse | Conteneur |
|---|---|---|
| `main` | https://koya.codetrine.com | `koya-landing` |

Un push sur `main` lance le workflow *Déploiement* : écriture de
`.env.production` depuis le secret `ENV_FILE`, construction de l'image,
publication sur `ghcr.io/sylvere36/koya-landing`, puis `docker run` sur le
serveur. Le déploiement échoue si la page ne répond pas dans les 10 secondes.

## Une seule fois

### 1. Le domaine
`koya.codetrine.com` → IP du serveur, comme `koyaexpress.codetrine.com`.

### 2. Le serveur
La ligne `"koya.codetrine.com": "koya-landing:80"` est dans `DOMAINES` de
`CodeTrine/setup.py`. Relancer le script (Caddy redémarre : quelques secondes
de coupure sur tous les sites) :
```bash
scp ~/Documents/Project/CodeTrine/setup.py ubuntu@IP:~
ssh ubuntu@IP
sudo python3 setup.py
```

### 3. GitHub
Créer un dépôt pour ce dossier (`landing/`), puis :

- *Settings → Secrets and variables → Actions* : `SSH_HOST`, `SSH_USER`,
  `SSH_KEY` — les **mêmes** que dans le dépôt du cockpit.
- *Settings → Environments* : créer `production`, avec le secret `ENV_FILE`
  (modèle : `.env.example`, pas de guillemets autour des valeurs) :
  - `VITE_WOURA_URL` : votre lien affilié Woura ;
  - `VITE_SITE_URL`, `VITE_WHATSAPP_NUMBER`, `VITE_PHONE_DISPLAY`.

### 4. Premier déploiement
Pousser sur `main`, suivre l'onglet *Actions*.

## Au quotidien

- **Changer le lien Woura ou le numéro** : modifier `ENV_FILE` dans GitHub,
  puis *Actions → Déploiement → Run workflow*. Les réglages sont inscrits dans
  la page au build : sans nouveau déploiement, rien ne change.
- **Modifier un message WhatsApp pré-rempli** : `MESSAGES` dans `vite.config.js`.
- **Travailler en local** :
  ```bash
  cp .env.example .env   # puis remplir
  npm install
  npm run dev            # http://localhost:5180
  ```
  `npm run build` refuse de construire si un réglage manque.
- **Remplacer une photo** : les originaux sont dans `../landing_koya_assets`.
  Les versions web (WebP 640 et 1080 px de large) sont dans `src/img`.
- **Journaux** : `docker logs --tail 50 koya-landing`.

# Liste de courses — famille

Une liste de courses partagée en temps réel : toi, tes frères/sœurs et ta mère
voyez tous la même liste, sur vos téléphones, mise à jour instantanément.

Techno : HTML/CSS/JS pur (pas de build), synchronisé via **Firebase Realtime
Database** (gratuit), hébergé sur **GitHub Pages**.

## 1. Créer le projet Firebase (5 min)

1. Va sur https://console.firebase.google.com → **Ajouter un projet**.
2. Une fois créé, dans le menu de gauche : **Build → Realtime Database →
   Créer une base de données**. Choisis une région proche (europe-west1
   convient pour la Tunisie), et démarre **en mode test**.
3. Dans **Règles**, remplace par ceci puis publie (accès ouvert en
   lecture/écriture — suffisant pour un usage familial, personne d'autre
   ne connaîtra l'URL) :
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
4. Retourne dans **Paramètres du projet** (roue dentée) → onglet **Général**
   → section **Vos applications** → clique l'icône `</>` pour ajouter une
   app web. Donne-lui un nom, pas besoin de Hosting.
5. Copie l'objet `firebaseConfig` qui s'affiche.

## 2. Configurer le projet en local

1. Renomme `firebase-config.example.js` en `firebase-config.js`.
2. Colle les valeurs copiées à l'étape 1.5 dedans.

## 3. Mettre sur GitHub

```bash
git init
git add .
git commit -m "Liste de courses"
git branch -M main
git remote add origin https://github.com/TON-USER/liste-courses.git
git push -u origin main
```

`firebase-config.js` est dans `.gitignore` — il ne sera pas poussé. C'est
volontaire, mais comme la base est en mode test/ouvert de toute façon, tu
peux aussi choisir de le committer si tu veux que tes frères/sœurs puissent
cloner et déployer eux-mêmes sans refaire la config.

## 4. Activer GitHub Pages

Repo → **Settings → Pages** → Source : **Deploy from branch**, branche
`main`, dossier `/ (root)`. L'URL sera du type :
`https://ton-user.github.io/liste-courses/`

Partage ce lien avec ta mère et tes frères/sœurs, ajoute-le en raccourci
sur leur écran d'accueil, et c'est prêt.

## Utilisation

- Chacun tape son prénom une fois (mémorisé sur son téléphone) et ajoute
  des articles.
- Ta mère coche au fur et à mesure qu'elle achète, en magasin.
- Les articles cochés descendent en bas de la liste ; le bouton ✕
  supprime un article.

## Pour aller plus loin (optionnel)

- Vider automatiquement les articles cochés après X jours.
- Notification push quand un article est ajouté (nécessiterait Firebase
  Cloud Messaging, plus de config).

# Les Humeurs à la Funes

Nouvelle interface Nuxt reconstruite depuis zéro.

## Démarrage

npm install
npm run dev

Le frontend est volontairement indépendant du backend pour le moment. Les pages de suivi et de profil seront reconnectées aux API lorsque le backend pourra être récupéré.


## Authentification

La connexion et l'inscription utilisent MongoDB pour les comptes et des sessions sécurisées côté serveur.

Variables d'environnement Vercel à prévoir :
- `NUXT_MONGODB_URI` : chaîne de connexion MongoDB
- `NUXT_SESSION_PASSWORD` : secret aléatoire d'au moins 32 caractères

La session est gérée par `nuxt-auth-utils` avec un cookie sécurisé. Le mot de passe utilisateur n'est jamais stocké en clair : il est dérivé avec scrypt avant d'être enregistré dans la collection `users`.

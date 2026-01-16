ASAP – Plateforme de réservation pour artisans

Inspirée de Doctolib pour plombiers, serruriers, électriciens etc.

Projet visant à permettre aux particuliers de réserver un artisan en quelques clics, avec profil vérifié, disponibilités en temps réel et agent IA pour prise de rendez-vous automatique.
Fonctionnalités Actuelles
Fonction	État
Auth artisan	✔ Login/Register
Profil artisan	✔ Infos + services
Recherche client	✔ Filtre + carte
Créneaux de dispo	✔ CRUD dispo
Réservation	✔ Workflow complet
Prisma DB + migrations	✔ Fonctionnel
API Node Express	✔ Organisée et modulaire
Front React + Tailwind	✔ UI fonctionnelle
Objectif court-terme

Améliorer UX du booking

Ajouter paiement sécurisé (Stripe)

Déployer prod

Intégration IA vocal / WhatsApp pour prise de RDV

Stack Technique
Côté	Technos
Front	React + Vite + TS + Tailwind
Back	Node.js + Express
DB	PostgreSQL + Prisma
Auth	JWT
Build	Monorepo simple (client/server)
🛠 Installation locale
git clone https://github.com/IsmaelHB/asap-projet.git
cd asap-projet

Backend
cd server
npm install
npx prisma migrate dev
npm run dev


Créer un fichier .env basé sur .env.example.

Frontend
cd client
npm install
npm run dev

API endpoints (résumé)
POST /auth/login
POST /auth/register
GET  /artisans
GET  /services?artisanId=
GET  /availability?artisanId=&from=&to=
POST /bookings

TODO / Axes d’amélioration pour Claude

(tu peux envoyer ce bloc avec ton repo)

Contrib souhaitée

Vérifier architecture + optimisations

Proposer amélioration du code/typage

Aider à structurer intégration IA Voice/WhatsApp

Améliorer logique répartition dispo → booking

Questions ouvertes

Comment optimiser Prisma + requêtes search ?

Comment gérer Webhooks pour appel IA + confirmation RDV ?

Architecture micro-fonctionnelle pour scaler ?

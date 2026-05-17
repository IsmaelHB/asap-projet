# ASAP – Plateforme de réservation pour artisans

> Inspirée de Doctolib, ASAP permet aux particuliers de réserver un artisan qualifié en quelques clics.

## Fonctionnalités

| Fonction | État |
|---|---|
| Auth artisan (Login/Register) | ✅ |
| Profil artisan (infos + services) | ✅ |
| Recherche client (filtres + carte) | ✅ |
| Créneaux de disponibilité (CRUD) | ✅ |
| Réservation (workflow complet) | ✅ |
| Base de données Prisma + migrations | ✅ |
| API Node/Express modulaire | ✅ |
| Front React + Tailwind | ✅ |

## Stack technique

| Côté | Technologies |
|---|---|
| Front | React + Vite + TypeScript + Tailwind |
| Back | Node.js + Express |
| Base de données | PostgreSQL + Prisma |
| Auth | JWT |
| Build | Monorepo simple (client/server) |

## Installation locale

```bash
git clone https://github.com/IsmaelHB/asap-projet.git
cd asap-projet
```

**Backend**
```bash
cd server
npm install
npx prisma migrate dev
npm run dev
```

> Créez un fichier `.env` basé sur `.env.example`

**Frontend**
```bash
cd client
npm install
npm run dev
```

## API – Endpoints principaux

POST   /auth/login
POST   /auth/register
GET    /artisans
GET    /services?artisanId=
GET    /availability?artisanId=&from=&to=
POST   /bookings

## Roadmap

- [ ] Paiement sécurisé (Stripe)
- [ ] Déploiement en production
- [ ] Intégration IA vocal / WhatsApp pour prise de RDV automatique

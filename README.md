# CINEPHORIA APP/ADMIN

Cette partie de l'application Cinephoria concerne l'administration et la gestion des ressources nécessaires au fonctionnement de l'application client.

## Introduction

Pour des raisons d'architecture, la partie administrateur est distincte de la partie client. Ainsi, nous avons deux applications:

- une plateforme d'administration et de gestion des données permettant d'alimenter la base données
- une application client consommant les données contenues dans la base de données

Toutes les opérations CRUD sont accessibles sur la plateforme d'administration.

## Déploiement en local

Afin de déployer en local le projet, il est nécessaire de suivre les étapes suivantes:

- Créer une base de données PostgreSQL;
- Renseigner les variables d'environnement dans un fichier .env sur la base du template (.env-template) à la racine du projet;
- Enfin, exécuter les commandes suivantes:

```bash
pnpm install
pnpm run dev
```

Pour synchroniser les schémas Prisma avec ceux de la base de données, exécuter la commande suivante afin d'effectuer la migration Prisma :

```bash
prisma migrate dev --name init
```

Pour en savoir plus, cliquer [ici](https://www.prisma.io/docs/orm/prisma-migrate/getting-started)

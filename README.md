# 📸 PhotoCloud — Frontend Angular

Frontend du projet **PhotoCloud EPSI**, une application de gestion d’images inspirée de Google Photos, basée sur une architecture serverless sur Google Cloud Platform.

---

## 🚀 Objectif du projet

Ce frontend permet :

* 📤 d’uploader des images vers Google Cloud Storage
* 🔍 de rechercher des images par tags
* 🖼️ d’afficher une galerie dynamique

Le tout connecté à des **Cloud Functions** (backend) et une base **Cloud SQL**.

---

## 🧠 Architecture

Le projet Angular est structuré en 3 couches :

```
src/app/
├── core/
│   ├── services/   → appels API (upload, consultation)
│   └── models/     → typage des données
│
├── pages/
│   ├── upload/     → page dépôt d’image
│   └── gallery/    → page galerie / recherche
│
└── shared/
    └── components/ → composants réutilisables (navbar…)
```

---

## ⚙️ Technologies utilisées

* Angular 19 (standalone components)
* TypeScript
* SCSS
* HTTP Client Angular
* Google Cloud Functions (API backend)

---

## 🔗 Connexion au backend

Le frontend communique avec deux Cloud Functions :

* `upload` → upload d’image
* `consultation` → recherche par tags

---

## 🧩 Fonctionnalités

### 📤 Upload

* Drag & drop ou sélection de fichier
* Preview de l’image
* Validation (JPEG/JPG/PNG uniquement)
* Envoi vers Cloud Function
* Feedback utilisateur + progression

### 🖼️ Galerie

* Recherche par mot-clé (tags)
* Appel API via `fetch` / HttpClient
* Affichage en grille responsive
* Tags visibles sur chaque image
* Gestion des états (loading, vide, erreur)

---

## 🔒 Sécurité

* Aucun secret stocké dans le code
* Utilisation de variables d’environnement
* Connexion sécurisée via API GCP

---

## 📁 Structure du projet

```
photocloud/
│
├── src/
│   ├── app/
│   ├── environments/
│   ├── index.ts
│   ├── index.html
│   └── styles.scss
│
├── angular.json
├── package.json
└── README.md
```

---

## 👨‍💻 Auteur

Projet réalisé dans le cadre du module Cloud — EPSI.

[Ayoub FATHALLAH](https://github.com/Formidabledu59)
&
[Matthéo COPPIN](https://github.com/Zagoki)

---

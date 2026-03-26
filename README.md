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
├── shared/
│   └── components/ → composants réutilisables (navbar…)
```

---

## ⚙️ Technologies utilisées

* Angular 17+ (standalone components)
* TypeScript
* SCSS
* HTTP Client Angular
* Google Cloud Functions (API backend)

---

## 🔗 Connexion au backend

Le frontend communique avec deux Cloud Functions :

* `enregistrement` → upload d’image
* `consultation` → recherche par tags

Les URLs sont configurées dans :

```
src/environments/environment.ts
```

### ✏️ À configurer :

```ts
export const environment = {
  production: false,
  uploadFunctionUrl: 'https://YOUR_UPLOAD_URL',
  consultationFunctionUrl: 'https://YOUR_CONSULTATION_URL',
};
```

---

## 📦 Installation

```bash
npm install
```

---

## ▶️ Lancer le projet

```bash
ng serve
```

Puis ouvrir :

```
http://localhost:4200
```

---

## 🧩 Fonctionnalités

### 📤 Upload

* Drag & drop ou sélection de fichier
* Preview de l’image
* Validation (JPEG uniquement)
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

## 🧪 Dépendances principales

* @angular/core
* @angular/common
* @angular/router
* @angular/forms
* @angular/common/http

---

## 📌 Notes

* Projet en mode **standalone Angular (sans NgModule)**
* Compatible mobile et desktop
* Design inspiré de Google Photos
* Peut être déployé sur un bucket GCP ou Firebase Hosting

---

## 👨‍💻 Auteur

Projet réalisé dans le cadre du module Cloud — EPSI.

---

## ✅ À faire / améliorations possibles

* Authentification utilisateur (Firebase Auth)
* Upload via URL signée
* Pagination des résultats
* Suppression d’images
* UI encore plus avancée

---

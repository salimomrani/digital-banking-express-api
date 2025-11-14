# 🚀 Backend – Fonctionnalités pour l'application de gestion de comptes

## 1. Comptes bancaires
- CRUD (création, mise à jour, suppression)
- Types de comptes (courant, épargne, joint)
- Solde en temps réel
- Verrouillage pessimiste/optimiste des écritures

## 2. Transactions
- Dépôt
- Retrait
- Transfert entre comptes
- Références uniques (id transaction)
- Catégorisation des transactions
- Horodatage précis
- Gestion des doublons (idempotence)

## 3. Historique et filtres
- Historique complet paginé
- Filtre par date, type, montant, catégorie
- Tri montant/date

## 4. Sécurité & Auth
- Auth JWT (accès + refresh)
- Rôles (Admin / User)
- Hashage des mots de passe (bcrypt)
- Rate limiting (protection brute-force)
- Audit log (toutes les actions)

## 5. Statistiques
- Dépenses mensuelles
- Revenus mensuels
- Graphiques (API)
- Classement par catégorie

## 6. Automatisation
- Virements planifiés (cron)
- Prélèvements récurrents
- Notifications solde bas

## 7. Export
- Export PDF (relevé bancaire)
- Export CSV / Excel des transactions

## 8. Gestion avancée
- OTP pour les transferts
- Gestion des bénéficiaires
- Multi-devises + conversion API
- Système d'approbation (entreprises)
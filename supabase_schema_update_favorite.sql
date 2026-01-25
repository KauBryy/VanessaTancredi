-- Ajout colonne is_favorite
alter table public.properties 
add column if not exists is_favorite boolean default false;

-- Politique de sécurité (Même que pour les autres colonnes)
-- Pas besoin de nouvelle politique spécifique si on utilise "select *" et que les update policies couvrent toute la table.
-- Juste s'assurer que le champ est bien accessible (ce qui est le cas par défaut sur 'public').

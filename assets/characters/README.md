# Personnages runtime

`figures/` contient uniquement les exports optimisés utilisés par l’application. Les sources de
production lourdes ne sont pas nécessaires au build et ne doivent pas être réintroduites dans ce
dépôt applicatif.

Si une nouvelle pose est créée :

1. conserver la source de travail dans l’archive design privée ;
2. exporter un PNG transparent optimisé et cohérent avec Toto/Bobo ;
3. ajouter seulement cet export dans `figures/` ;
4. vérifier le rendu normal et reduced-motion ;
5. documenter la licence/provenance et l’usage.

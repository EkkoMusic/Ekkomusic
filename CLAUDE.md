# Instructions pour Claude Code

## Déploiement

Après chaque commit sur la branche `claude/create-ekkomusic-main-branch-KeEl6`, merger automatiquement sur `main` sans attendre de demande explicite.

Commande de merge :
```
curl --noproxy github.com -s -w "HTTP:%{http_code}" -X POST \
  "https://api.github.com/repos/EkkoMusic/Ekkomusic/merges" \
  -H "Authorization: token $(grep -o 'EkkoMusic:[^@]*' ~/.git-credentials | cut -d: -f2)@github.com" \
  ...
```

En pratique : push + merge dans la même commande à chaque fois.

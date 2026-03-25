# RestoSocial

**Genere des posts reseaux sociaux pour ton restaurant grace a l'IA.**

## Ce que fait cette app

1. Un restaurateur s'inscrit et decrit son restaurant
2. Il remplit un formulaire (type de cuisine, plateforme, ton souhaite...)
3. L'IA (Claude) genere un post optimise pret a publier
4. Le post est sauvegarde dans l'historique

## Stack technique

- **Next.js 14** - Framework React (App Router)
- **Supabase** - Auth + Base de donnees PostgreSQL
- **Stripe** - Paiements et abonnements
- **Claude API** - Generation de contenu IA
- **Tailwind CSS** - Design
- **Vercel** - Hebergement

---

## Guide de deploiement (etape par etape)

### 1. Cree un compte Supabase

1. Va sur supabase.com et cree un compte
2. Cree un nouveau projet (choisis un nom et un mot de passe)
3. Attends que le projet soit pret (ca prend ~2 minutes)
4. Va dans **SQL Editor** (menu de gauche)
5. Clique sur **New Query**
6. Copie-colle TOUT le contenu du fichier `supabase-schema.sql` qui est dans ce projet
7. Clique sur **Run** (le bouton vert)
8. Va dans **Settings > API** et note :
   - `Project URL` = ton `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` = ton `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` = ton `SUPABASE_SERVICE_ROLE_KEY`
9. Va dans **Authentication > URL Configuration** et ajoute dans "Redirect URLs" :
   - `http://localhost:3000/auth/callback`
   - `https://ton-domaine.vercel.app/auth/callback` (tu ajouteras ca apres le deploiement)

### 2. Cree un compte Anthropic (Claude API)

1. Va sur console.anthropic.com
2. Cree un compte et ajoute un moyen de paiement
3. Va dans **API Keys** et cree une nouvelle cle
4. Note la cle = ton `ANTHROPIC_API_KEY`

### 3. Configure Stripe

1. Va sur dashboard.stripe.com et cree un compte
2. Active le **mode Test** (toggle en haut a droite)
3. Va dans **Developers > API Keys** et note :
   - `Publishable key` = ton `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `Secret key` = ton `STRIPE_SECRET_KEY`
4. Va dans **Products** et cree 2 produits :
   - **Starter** : 49 euros/mois (recurrent), note le `Price ID` = `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID`
   - **Pro** : 99 euros/mois (recurrent), note le `Price ID` = `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
5. Va dans **Developers > Webhooks** :
   - Clique sur "Add endpoint"
   - URL : `https://ton-domaine.vercel.app/api/stripe/webhook`
   - Evenements a ecouter : `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Note le `Signing secret` = ton `STRIPE_WEBHOOK_SECRET`
6. Va dans **Settings > Customer portal** et active le portail client

### 4. Deploie sur Vercel

1. Cree un compte sur vercel.com
2. Pousse ce code sur un repo GitHub (ou GitLab)
3. Sur Vercel, clique sur **New Project** puis importe ton repo
4. Dans **Environment Variables**, ajoute TOUTES les variables du fichier `.env.example` avec tes vraies valeurs
5. Pour `NEXT_PUBLIC_APP_URL`, mets `https://ton-projet.vercel.app` (tu auras l'URL exacte apres le premier deploiement)
6. Clique sur **Deploy**

### 5. Apres le deploiement

1. Retourne dans **Supabase > Authentication > URL Configuration** et ajoute `https://ton-domaine.vercel.app/auth/callback`
2. Retourne dans **Stripe > Webhooks** et mets a jour l'URL du webhook avec ton vrai domaine Vercel
3. Mets a jour `NEXT_PUBLIC_APP_URL` dans Vercel avec ton vrai domaine

### 6. Teste tout

1. Va sur ton site
2. Cree un compte
3. Confirme ton email
4. Connecte-toi
5. Essaie de generer un post
6. Teste le paiement avec la carte de test Stripe : `4242 4242 4242 4242`

---

## Developpement local

```bash
# Installe les dependances
npm install

# Copie le fichier d'environnement et remplis tes cles
cp .env.example .env.local

# Lance le serveur de developpement
npm run dev
```

Ouvre http://localhost:3000 dans ton navigateur.

---

## Structure du projet

```
src/
  app/
    page.tsx                    # Landing page
    layout.tsx                  # Layout global (navbar + footer)
    globals.css                 # Styles globaux
    auth/
      login/page.tsx            # Page de connexion
      signup/page.tsx           # Page d'inscription
      callback/route.ts        # Callback auth Supabase
    dashboard/page.tsx          # Dashboard + historique
    generate/page.tsx           # Formulaire de generation
    subscription/page.tsx       # Gestion abonnement
    api/
      generate/route.ts         # API generation (Claude)
      stripe/
        create-checkout/        # Cree une session Stripe
        portal/                 # Portail client Stripe
        webhook/                # Webhook Stripe
  components/
    Navbar.tsx                  # Barre de navigation
    Footer.tsx                  # Pied de page
  lib/
    supabase-browser.ts         # Client Supabase (navigateur)
    supabase-server.ts          # Client Supabase (serveur)
    supabase-middleware.ts      # Client Supabase (middleware)
    stripe.ts                   # Config Stripe + plans
    claude.ts                   # Config Claude + generation
  middleware.ts                 # Protection des routes
```

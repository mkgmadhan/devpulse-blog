# Deploy to Azure — Manual Steps

## 1. Create GitHub repo and push

```powershell
# In PowerShell (as admin or normal)
"C:\Program Files\GitHub CLI\gh.exe" auth login

# Create private or public repo
"C:\Program Files\GitHub CLI\gh.exe" repo create devpulse-blog --public --source=. --remote=origin --push
```

Or via git remote manually:
```bash
# Go to github.com, create repo "devpulse-blog"
git remote add origin https://github.com/YOUR_USERNAME/devpulse-blog.git
git branch -M main
git push -u origin main
```

## 2. Create Azure Static Web App (already have resource group)

```bash
az staticwebapp create \
  --name devpulse-blog \
  --resource-group devpulse-blog-rg \
  --location eastus2 \
  --sku Free \
  --source https://github.com/YOUR_USERNAME/devpulse-blog \
  --branch main \
  --app-location "/" \
  --output-location ".next" \
  --login-with-github
```

This will:
- Open browser for GitHub OAuth
- Create the Azure resource
- Generate and add the GitHub Actions deployment token automatically

## 3. Add secrets to GitHub

In GitHub repo → Settings → Secrets and variables → Actions:

| Secret name | Value |
|------------|-------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | (auto-added by az CLI step above) |
| `RESEND_API_KEY` | Your Resend API key |
| `NEXT_PUBLIC_ADSENSE_ID` | `ca-pub-XXXXXXXXXXXXXXXX` |

In GitHub repo → Settings → Variables → Actions:

| Variable name | Value |
|--------------|-------|
| `NEXT_PUBLIC_SITE_URL` | `https://your-app.azurestaticapps.net` |

## 4. Add App Settings in Azure Portal

Go to: Azure Portal → devpulse-blog (Static Web App) → Configuration

Add:
- `RESEND_API_KEY` = your key
- `RESEND_AUDIENCE_ID` = your audience ID
- `NEXT_PUBLIC_SITE_URL` = https://your-app.azurestaticapps.net

## 5. Custom Domain (optional, free)

Azure Portal → devpulse-blog → Custom domains → Add
- Add your domain
- Copy CNAME record to DNS provider
- SSL auto-provisioned

## 6. AdSense Setup

1. Sign up at https://adsense.google.com
2. Add your site URL
3. Copy Publisher ID (ca-pub-XXXXXXXX)
4. Add as `NEXT_PUBLIC_ADSENSE_ID` secret
5. Get Ad Unit IDs and replace placeholder slot IDs in:
   - src/app/blog/[slug]/page.tsx (slots: "1234567890", "0987654321", "1122334455")

## 7. Newsletter (Resend)

1. Sign up at https://resend.com (free: 3,000 emails/month)
2. Create API key
3. Create an Audience
4. Copy Audience ID → `RESEND_AUDIENCE_ID`
5. Copy API key → `RESEND_API_KEY`

## Verify Deployment

After push to main, check:
- GitHub Actions tab — build should complete in ~3 minutes
- https://your-app.azurestaticapps.net — site should be live
- /sitemap.xml — should return XML
- /feed.xml — should return RSS
- /api/search — should return JSON post list

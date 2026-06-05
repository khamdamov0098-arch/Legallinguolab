# LegalLinguoLab — Netlify va domen ulash

Domen: **legallinguolab.uz** (saytda shu manzil ko‘rsatilgan)

---

## 1-qadam: Saytni Netlify ga yuklash

### Variant A — Drag & Drop (eng oson, Git shart emas)

1. [https://app.netlify.com](https://app.netlify.com) ga kiring (akkaunt oching).
2. **Add new site** → **Deploy manually**.
3. `LegalLinguoLab` papkasidagi **barcha fayllarni** sudrab tashlang:
   - `index.html`, `shared.css`, `nav.js`, `icons.js`
   - barcha `.html` sahifalar
   - `logo.jpg`, `boshsahifa.jpg`
   - `netlify.toml`
4. Deploy tugagach sizga manzil beriladi: masalan `https://random-name-123.netlify.app`

### Variant B — GitHub orqali (keyin avtomatik yangilanadi)

1. GitHub da yangi repo oching.
2. `LegalLinguoLab` papkasini yuklang.
3. Netlify: **Add new site** → **Import from Git** → reponi tanlang.
4. Sozlamalar:
   - **Build command:** bo‘sh qoldiring
   - **Publish directory:** `.`
5. **Deploy site** bosing.

---

## 2-qadam: Domenni Netlify ga qo‘shish

1. Netlify da saytingizni oching.
2. **Domain management** → **Add a domain** → **Add a domain you already own**.
3. Kiriting: `legallinguolab.uz`
4. Keyin yana qo‘shing: `www.legallinguolab.uz` (ixtiyoriy, lekin tavsiya etiladi).
5. Netlify **HTTPS (SSL)** ni o‘zi yoqadi — 24 soatgacha kutish mumkin.

---

## 3-qadam: DNS (domen sotib olgan joyda)

Domen qayerda ro‘yxatdan o‘tgan bo‘lsa (masalan: UZINFOCOM, Reg.ru, Cloudflare), o‘sha panelda **DNS** bo‘limiga kiring.

### Tavsiya etilgan yozuvlar

| Tur | Host / Name | Qiymat (Value) |
|-----|-------------|----------------|
| **A** | `@` yoki bo‘sh | `75.2.60.5` |
| **CNAME** | `www` | `SIZNING-SAYT.netlify.app` |

`SIZNING-SAYT.netlify.app` — Netlify bergan manzil (masalan `legallinguolab.netlify.app`).  
Domain management sahifasida aniq ko‘rsatiladi.

**Muhim:**
- `@` uchun faqat **bitta** A yozuvi bo‘lsin (`75.2.60.5`).
- Eski A yozuvlarni o‘chiring, aks holda SSL ishlamasligi mumkin.

### Agar registrar ALIAS / ANAME qo‘llasa (yaxshiroq)

| Tur | Host | Qiymat |
|-----|------|--------|
| ALIAS yoki ANAME | `@` | `apex-loadbalancer.netlify.com` |
| CNAME | `www` | `sizning-sayt.netlify.app` |

---

## 4-qadam: Tekshirish

1. [https://dnschecker.org](https://dnschecker.org) — `legallinguolab.uz` uchun **A** → `75.2.60.5` ko‘rinishi kerak.
2. Netlify → Domain management — **Pending** o‘rniga **Active** bo‘lsin.
3. Brauzerda oching:
   - `https://legallinguolab.uz`
   - `https://www.legallinguolab.uz` (asosiy domenga yo‘naltiriladi)

DNS odatda **15 daqiqa — 48 soat** ichida ishga tushadi.

---

## 5-qadam: Google Apps Script (login / baholar)

Hozir `nav.js` da:

```js
const SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL_HERE';
```

Google Apps Script deploy qilingan URL ni shu yerga qo‘ying, keyin saytni Netlify ga **qayta deploy** qiling.  
Aks holda login va reyting to‘liq serverga ulanmaydi (mahalliy saqlash ishlaydi).

---

## Muammo bo‘lsa

| Muammo | Yechim |
|--------|--------|
| Sayt ochilmaydi | DNS 48 soat kuting; A yozuvni tekshiring |
| SSL xato | Faqat bitta A `75.2.60.5`; eski yozuvlarni o‘chiring |
| www ishlamaydi | CNAME `www` → `xxx.netlify.app` qo‘shing |
| Sahifa 404 | `netlify.toml` bilan birga qayta deploy qiling |

---

**Netlify yordam:** [Configure external DNS](https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/)

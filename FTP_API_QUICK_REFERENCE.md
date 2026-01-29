# 📚 FTP API Quick Reference

## ✅ What's Working

- ✅ **Auto-authentication** on app start
- ✅ **Proxy server** handles CORS (`/ftp-api/*` → `https://test.vcloudtech.net/api/*`)
- ✅ **Credentials** stored in `.env`

## 🔧 Configuration

**`.env` file:**
```env
VITE_FTP_API_BASE_URL=/ftp-api
VITE_FTP_API_EMAIL=urahim@vcloudchoice.com
VITE_FTP_API_PASSWORD=sh&^67swa
```

## 📖 Usage

### **Fetch Products:**
```javascript
import { ftpProductService } from './services/ftpProduct.service';

const products = await ftpProductService.getAllProducts({
  page: 1,
  per_page: 50,
  distributor: 'ingram'
});
```

### **Search Products:**
```javascript
const results = await ftpProductService.searchProducts('laptop');
```

### **Get by Distributor:**
```javascript
const products = await ftpProductService.getProductsByDistributor('ingram');
```

## 📁 Key Files

- `src/services/ftpProduct.service.js` - FTP API service
- `src/utils/ftpDataMapper.js` - Data mapper
- `server.js` - Proxy configuration

## 🔗 API Endpoints

- **Login**: `POST /ftp-api/auth/login`
- **Get Products**: `GET /ftp-api/ftp-products`
- **Get Product**: `GET /ftp-api/ftp-products/{id}`

---

**That's it!** Everything else is handled automatically. 🚀

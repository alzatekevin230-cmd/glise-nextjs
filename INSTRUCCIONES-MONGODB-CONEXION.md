# 🔌 Cómo Obtener el Connection String de MongoDB

## 📋 **Paso a Paso:**

### **1. En la pantalla que ves, click en:**
```
🔌 Conductores (Drivers)
```

### **2. Selecciona:**
- **Driver:** `Node.js`
- **Version:** `5.5 or later` (o la más reciente)

### **3. Copia el Connection String:**
Se verá así:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### **4. Reemplaza los placeholders:**
- `<username>` → Tu usuario de MongoDB
- `<password>` → Tu contraseña de MongoDB

**Ejemplo final:**
```
mongodb+srv://glise-admin:MiPassword123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

### **5. Agrega a `.env.local`:**
```env
MONGODB_URI=mongodb+srv://glise-admin:MiPassword123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=glise
```

---

## ✅ **Después de agregar:**

Ejecuta:
```bash
npm run test-mongodb
```

Deberías ver:
```
✅ Conectado a MongoDB!
✅ Base de datos: glise
```

---

**¿Ya copiaste el connection string? Avísame cuando lo tengas y seguimos.**

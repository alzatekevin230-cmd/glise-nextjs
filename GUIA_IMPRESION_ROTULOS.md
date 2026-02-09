# Guía: Impresión de Rótulos - Coordinadora

## 📋 Descripción

Este módulo permite imprimir rótulos de guías de envío existentes en Coordinadora. Útil para:
- Reimprimir rótulos de guías ya generadas
- Imprimir lotes de rótulos para múltiples guías
- Generar PDFs para etiquetado de paquetes

## 🔧 Configuración Requerida

Agrega estas variables de entorno en tu `.env.local`:

```env
# Coordinadora - Guías
COORDINADORA_GUIAS_ID_CLIENTE=tu_id_cliente
COORDINADORA_GUIAS_USUARIO=tu_usuario_ws
COORDINADORA_GUIAS_CLAVE=tu_clave_sin_encriptar
COORDINADORA_GUIAS_ID_ROTULO=55  # Formato de rótulo (55 es estándar)
```

## 🚀 Cómo Usar

### 1. Desde el Backend (Node.js)

```javascript
import { printCoordinadoraLabels } from '@/lib/soapClient';

// Imprimir rótulos de una o varias guías
const result = await printCoordinadoraLabels(['74295XXXXXX', '74295YYYYYY']);

if (result.success) {
  console.log(`✅ PDF generado: ${result.fileSize.toFixed(2)} KB`);
  console.log(`Guías procesadas: ${result.guideCount}`);
  
  // result.pdfBase64 contiene el PDF en base64
}
```

### 2. Desde el Frontend (React/JavaScript)

```javascript
async function descargarRotulos(trackingNumbers) {
  try {
    const response = await fetch('/api/shipping/print-labels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trackingNumbers: trackingNumbers, // ['74295XXXXXX', '74295YYYYYY']
        fileName: 'mis_rotulos.pdf' // Opcional
      })
    });

    const data = await response.json();

    if (!data.success) {
      alert('Error: ' + data.error);
      return;
    }

    // Convertir base64 a Blob y descargar
    const byteCharacters = atob(data.pdf);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // Descargar
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = data.fileName;
    link.click();

    console.log(`✅ Descargado: ${data.fileName} (${data.fileSize})`);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Uso en un componente
<button onClick={() => descargarRotulos(['74295XXXXXX'])}>
  Descargar Rótulo
</button>
```

### 3. En un Panel Admin (Ejemplo)

```jsx
import { useState } from 'react';

export default function ImprimirRotulosPanel() {
  const [selectedGuides, setSelectedGuides] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePrint = async () => {
    if (selectedGuides.length === 0) {
      alert('Selecciona al menos una guía');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/shipping/print-labels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingNumbers: selectedGuides,
          fileName: `rotulos_${Date.now()}.pdf`
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Descargar
        const blob = new Blob(
          [Uint8Array.from(atob(data.pdf), c => c.charCodeAt(0))],
          { type: 'application/pdf' }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.fileName;
        a.click();

        alert(`✅ ${data.guideCount} rótulo(s) descargado(s)`);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <h2>Imprimir Rótulos</h2>
      <textarea
        placeholder="74295XXXXXX&#10;74295YYYYYY&#10;74295ZZZZZZ"
        onChange={(e) => setSelectedGuides(e.target.value.split('\n').filter(x => x))}
      />
      <button 
        onClick={handlePrint} 
        disabled={loading}
      >
        {loading ? 'Imprimiendo...' : 'Descargar Rótulos'}
      </button>
    </div>
  );
}
```

## 📊 Estructura de Respuesta

```json
{
  "success": true,
  "pdf": "JVBERi0xLjQKJeLj...",  // Base64 del PDF
  "fileName": "rotulos_guias_2024-02-04.pdf",
  "guideCount": 2,
  "fileSize": "245.50 KB"
}
```

## ⚠️ Límites y Restricciones

- **Máximo de guías por solicitud**: 100
- **Formato de rótulo**: ID 55 (estándar)
- **Requisito**: Las guías deben existir en Coordinadora
- **Tiempo de respuesta**: 2-5 segundos típicamente

## 🔍 Solución de Problemas

### Error: "codigos_remisiones no encontrado"
```
✅ Solución: Verifica que los números de guía existan en Coordinadora
```

### Error: "Clave inválida"
```
✅ Solución: Valida que COORDINADORA_GUIAS_CLAVE sea la clave SIN encriptar
Nuestro sistema se encarga de encriptarla con SHA-256
```

### El PDF viene vacío
```
✅ Solución: Puede ser que id_rotulo no sea correcto. 
El valor por defecto es 55, pero Coordinadora puede tener otros IDs.
Contacta al ingeniero de Coordinadora para confirmar.
```

## 📝 Integración con Órdenes

Para imprimir rótulos después de generar una guía:

```javascript
// En tu flujo de pago aprobado
const guideResult = await generateCoordinadoraGuide(orderData, orderId, userId);

if (guideResult.success) {
  // Usar el trackingNumber para imprimir rótulos
  const printResult = await printCoordinadoraLabels([guideResult.trackingNumber]);
  
  // Guardar en Firestore si es necesario
  await db.collection('orders').doc(orderId).update({
    rotulosPdf: printResult.pdfBase64
  });
}
```

## 🧪 Prueba del Endpoint

```bash
curl -X POST http://localhost:3000/api/shipping/print-labels \
  -H "Content-Type: application/json" \
  -d '{
    "trackingNumbers": ["74295XXXXXX"],
    "fileName": "test_rotulo.pdf"
  }' | jq '.fileSize'
```

## 📚 Referencias

- Método SOAP: `Guias_imprimirRotulos`
- WSDL: `https://guias.coordinadora.com/ws/guias/1.6/server.php?wsdl`
- Parámetros SOAP:
  - `id_rotulo`: Formato de impresión
  - `codigos_remisiones`: Array de números de guía
  - `usuario`: Usuario WS
  - `clave`: Contraseña encriptada SHA-256

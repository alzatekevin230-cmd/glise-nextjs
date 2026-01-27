import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, '..', 'nuevo infantil 2026');

const renames = [
    { old: "1.webp", new: "almiprosindet1.webp" },
    { old: "2.webp", new: "almiprosindet2.webp" },
    { old: "3.webp", new: "almiprounguento500-1.webp" },
    { old: "4.webp", new: "almiprounguento500-2.webp" },
    { old: "5.webp", new: "almiprounguento125.webp" },
    { old: "6.webp", new: "kitalmiproreciennacidobásico.webp" },
    { old: "7.webp", new: "almiproemoliente400g.webp" },
    { old: "8.webp", new: "acidmantlebabycrema30g.webp" },
    { old: "9.webp", new: "acidmantlebabycrema100g.webp" },
    { old: "10.webp", new: "nistatina+oxidozinc60g.webp" },
    { old: "11.webp", new: "havvarepelentenaturalparabebesyniños120ml.webp" },
    { old: "12.webp", new: "vitalorniñosvitaminasyfresa400gicom.webp" },
    { old: "13.webp", new: "apetifortjarabe240mlfreshly.webp" },
    { old: "14.webp", new: "jabónalergibonbabykids150g.webp" },
    { old: "15.webp", new: "bloqueadorsolorkidstubo60g.webp" },
    { old: "16.webp", new: "eucerinbabybañoyshampoo250ml.webp" },
    { old: "17.webp", new: "coloniaarrurrurosada220ml.webp" },
    { old: "18.webp", new: "coloniaarrurruazul220ml.webp" },
    { old: "19.webp", new: "bloqueadorsundarkniñosspf60120ml1.webp" },
    { old: "20.webp", new: "bloqueadorsundarkniñosspf60120ml2.webp" },
    { old: "21.webp", new: "repelentestayoffsprayparabebe120ml.webp" },
    { old: "22.webp", new: "vitabiosavitaprokidstuttifrutti500ml.webp" },
    { old: "23.webp", new: "qlmmunefrutosrojosx15sobrespolvo.webp" }
];

if (!fs.existsSync(directoryPath)) {
    console.error(`Directory not found: ${directoryPath}`);
    process.exit(1);
}

console.log(`Renaming files in: ${directoryPath}`);

renames.forEach(file => {
    const oldPath = path.join(directoryPath, file.old);
    const newPath = path.join(directoryPath, file.new);

    if (fs.existsSync(oldPath)) {
        try {
            fs.renameSync(oldPath, newPath);
            console.log(`✅ Renamed: ${file.old} -> ${file.new}`);
        } catch (err) {
            console.error(`❌ Error renaming ${file.old}:`, err.message);
        }
    } else {
        console.warn(`⚠️ File not found (skipping): ${file.old}`);
    }
});

console.log('Renaming process complete.');
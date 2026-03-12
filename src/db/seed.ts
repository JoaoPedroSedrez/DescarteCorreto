import { db } from "./index";
import { collection_points } from "./schema";

const points = [
  {
    name: "Ecoponto Centro",
    description: "Aceita recicláveis em geral: papel, plástico, vidro e metal.",
    type: "recyclable",
    latitude: -26.3044,
    longitude: -48.8487,
    address: "Rua XV de Novembro, 1200",
    neighborhood: "Centro",
    city: "Joinville",
    state: "SC",
  },
  {
    name: "Ponto de Eletrônicos Joinville",
    description: "Descarte de computadores, celulares, pilhas e baterias.",
    type: "electronic",
    latitude: -26.2967,
    longitude: -48.8456,
    address: "Av. Beira Rio, 500",
    neighborhood: "Bucarein",
    city: "Joinville",
    state: "SC",
  },
  {
    name: "Coleta de Óleo de Cozinha",
    description: "Traga seu óleo usado em garrafas PET fechadas.",
    type: "oil",
    latitude: -26.3120,
    longitude: -48.8530,
    address: "Rua Ministro Calógeras, 300",
    neighborhood: "Anita Garibaldi",
    city: "Joinville",
    state: "SC",
  },
  {
    name: "Ecoponto Norte",
    description: "Recicláveis e entulho de pequenas reformas.",
    type: "recyclable",
    latitude: -26.2810,
    longitude: -48.8390,
    address: "Rua Albano Schmidt, 800",
    neighborhood: "Boa Vista",
    city: "Joinville",
    state: "SC",
  },
  {
    name: "Descarte de Pilhas — Supermercado Sul",
    description: "Caixa coletora de pilhas e baterias pequenas.",
    type: "battery",
    latitude: -26.3250,
    longitude: -48.8610,
    address: "Rua Paul Krüger, 150",
    neighborhood: "América",
    city: "Joinville",
    state: "SC",
  },
  {
    name: "Ponto Orgânico Compostagem",
    description: "Resíduos orgânicos para compostagem comunitária.",
    type: "organic",
    latitude: -26.3080,
    longitude: -48.8350,
    address: "Rua Visconde de Taunay, 420",
    neighborhood: "Glória",
    city: "Joinville",
    state: "SC",
  },
  {
    name: "Ecoponto Leste",
    description: "Recicláveis, móveis velhos e eletrodomésticos.",
    type: "recyclable",
    latitude: -26.3010,
    longitude: -48.8200,
    address: "Rua Abdon Batista, 900",
    neighborhood: "Jardim Paraíso",
    city: "Joinville",
    state: "SC",
  },
  {
    name: "Coleta de Medicamentos Vencidos",
    description: "Descarte seguro de remédios e embalagens farmacêuticas.",
    type: "medication",
    latitude: -26.2990,
    longitude: -48.8510,
    address: "Rua Blumenau, 700",
    neighborhood: "Saguaçu",
    city: "Joinville",
    state: "SC",
  },
];

async function seed() {
  console.log("Inserindo pontos de coleta...");

  // insert().values() aceita um array — insere todos de uma vez
  await db.insert(collection_points).values(points);

  console.log(`${points.length} pontos inseridos com sucesso!`);
  process.exit(0);
}

seed();

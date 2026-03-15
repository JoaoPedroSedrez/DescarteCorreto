import bcrypt from "bcrypt";
import { db } from "./index";
import { users, collection_points, collections, reports } from "./schema";

// ---------- Pontos de coleta ----------

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
    latitude: -26.312,
    longitude: -48.853,
    address: "Rua Ministro Calógeras, 300",
    neighborhood: "Anita Garibaldi",
    city: "Joinville",
    state: "SC",
  },
  {
    name: "Ecoponto Norte",
    description: "Recicláveis e entulho de pequenas reformas.",
    type: "recyclable",
    latitude: -26.281,
    longitude: -48.839,
    address: "Rua Albano Schmidt, 800",
    neighborhood: "Boa Vista",
    city: "Joinville",
    state: "SC",
  },
  {
    name: "Descarte de Pilhas — Supermercado Sul",
    description: "Caixa coletora de pilhas e baterias pequenas.",
    type: "battery",
    latitude: -26.325,
    longitude: -48.861,
    address: "Rua Paul Krüger, 150",
    neighborhood: "América",
    city: "Joinville",
    state: "SC",
  },
  {
    name: "Ponto Orgânico Compostagem",
    description: "Resíduos orgânicos para compostagem comunitária.",
    type: "organic",
    latitude: -26.308,
    longitude: -48.835,
    address: "Rua Visconde de Taunay, 420",
    neighborhood: "Glória",
    city: "Joinville",
    state: "SC",
  },
  {
    name: "Ecoponto Leste",
    description: "Recicláveis, móveis velhos e eletrodomésticos.",
    type: "recyclable",
    latitude: -26.301,
    longitude: -48.82,
    address: "Rua Abdon Batista, 900",
    neighborhood: "Jardim Paraíso",
    city: "Joinville",
    state: "SC",
  },
  {
    name: "Coleta de Medicamentos Vencidos",
    description: "Descarte seguro de remédios e embalagens farmacêuticas.",
    type: "medication",
    latitude: -26.299,
    longitude: -48.851,
    address: "Rua Blumenau, 700",
    neighborhood: "Saguaçu",
    city: "Joinville",
    state: "SC",
  },
];

// ---------- Seed principal ----------

async function seed() {
  console.log("Limpando tabelas...");
  await db.delete(reports);
  await db.delete(collections);
  await db.delete(users);
  await db.delete(collection_points);

  // ---------- Usuários ----------

  console.log("Inserindo usuários...");
  const hashedPassword = await bcrypt.hash("senha123", 10);

  const insertedUsers = await db
    .insert(users)
    .values([
      { name: "Ana Souza", email: "ana.souza@email.com", password: hashedPassword },
      { name: "Bruno Lima", email: "bruno.lima@email.com", password: hashedPassword },
      { name: "Carla Mendes", email: "carla.mendes@email.com", password: hashedPassword },
      { name: "Diego Ferreira", email: "diego.ferreira@email.com", password: hashedPassword },
      { name: "Eduarda Rocha", email: "eduarda.rocha@email.com", password: hashedPassword },
    ])
    .returning();

  console.log(`${insertedUsers.length} usuários inseridos.`);

  const [ana, bruno, carla, diego, eduarda] = insertedUsers;

  // ---------- Pontos de coleta ----------

  console.log("Inserindo pontos de coleta...");
  await db.insert(collection_points).values(points);
  console.log(`${points.length} pontos de coleta inseridos.`);

  // ---------- Solicitações de coleta ----------

  console.log("Inserindo solicitações de coleta...");

  const futureDate = (daysFromNow: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d;
  };

  await db.insert(collections).values([
    {
      user_id: ana.id,
      material_type: "plastic",
      description: "Garrafas PET e embalagens diversas.",
      image_path: "uploads/seed-placeholder.jpg",
      address: "Rua XV de Novembro, 450",
      neighborhood: "Centro",
      city: "Joinville",
      state: "SC",
      scheduled_date: futureDate(3),
      status: "pending",
    },
    {
      user_id: ana.id,
      material_type: "paper",
      description: "Caixas de papelão e jornais velhos.",
      image_path: "uploads/seed-placeholder.jpg",
      address: "Rua XV de Novembro, 450",
      neighborhood: "Centro",
      city: "Joinville",
      state: "SC",
      scheduled_date: futureDate(10),
      status: "completed",
    },
    {
      user_id: bruno.id,
      material_type: "glass",
      description: "Garrafas de vidro e potes.",
      image_path: "uploads/seed-placeholder.jpg",
      address: "Av. Beira Rio, 320",
      neighborhood: "Bucarein",
      city: "Joinville",
      state: "SC",
      scheduled_date: futureDate(5),
      status: "pending",
    },
    {
      user_id: carla.id,
      material_type: "metal",
      description: "Latas de alumínio e sucata metálica.",
      image_path: "uploads/seed-placeholder.jpg",
      address: "Rua Ministro Calógeras, 210",
      neighborhood: "Anita Garibaldi",
      city: "Joinville",
      state: "SC",
      scheduled_date: futureDate(7),
      status: "completed",
    },
    {
      user_id: carla.id,
      material_type: "plastic",
      description: "Embalagens de produtos de limpeza.",
      image_path: "uploads/seed-placeholder.jpg",
      address: "Rua Ministro Calógeras, 210",
      neighborhood: "Anita Garibaldi",
      city: "Joinville",
      state: "SC",
      scheduled_date: futureDate(4),
      status: "pending",
    },
    {
      user_id: diego.id,
      material_type: "paper",
      description: "Livros antigos e revistas.",
      image_path: "uploads/seed-placeholder.jpg",
      address: "Rua Albano Schmidt, 612",
      neighborhood: "Boa Vista",
      city: "Joinville",
      state: "SC",
      scheduled_date: futureDate(6),
      status: "pending",
    },
    {
      user_id: eduarda.id,
      material_type: "glass",
      description: "Frascos de perfume e vidros de conserva.",
      image_path: "uploads/seed-placeholder.jpg",
      address: "Rua Paul Krüger, 88",
      neighborhood: "América",
      city: "Joinville",
      state: "SC",
      scheduled_date: futureDate(8),
      status: "completed",
    },
    {
      user_id: eduarda.id,
      material_type: "metal",
      description: "Panelas velhas e tampas metálicas.",
      image_path: "uploads/seed-placeholder.jpg",
      address: "Rua Paul Krüger, 88",
      neighborhood: "América",
      city: "Joinville",
      state: "SC",
      scheduled_date: futureDate(12),
      status: "pending",
    },
  ]);

  console.log("8 solicitações de coleta inseridas.");

  // ---------- Denúncias ----------

  console.log("Inserindo denúncias...");

  await db.insert(reports).values([
    {
      user_id: ana.id,
      description: "Descarte irregular de lixo eletrônico na calçada.",
      image_path: "uploads/seed-placeholder.jpg",
      latitude: -26.305,
      longitude: -48.849,
      address: "Rua das Palmeiras, 130 — Centro, Joinville",
    },
    {
      user_id: bruno.id,
      description: "Sofá e colchão abandonados em frente ao terreno baldio.",
      image_path: "uploads/seed-placeholder.jpg",
      latitude: -26.293,
      longitude: -48.844,
      address: "Av. Santos Dumont, 780 — Bucarein, Joinville",
    },
    {
      user_id: bruno.id,
      description: "Pneus velhos jogados no acostamento da avenida.",
      image_path: "uploads/seed-placeholder.jpg",
      latitude: -26.315,
      longitude: -48.856,
      address: "Av. Marginal, 200 — Anita Garibaldi, Joinville",
    },
    {
      user_id: carla.id,
      description: "Entulho de obra descartado irregularmente na via pública.",
      image_path: "uploads/seed-placeholder.jpg",
      latitude: -26.279,
      longitude: -48.837,
      address: "Rua Arno Waldemar Döhler, 55 — Boa Vista, Joinville",
    },
    {
      user_id: diego.id,
      description: "Lixo doméstico acumulado próximo ao córrego.",
      image_path: "uploads/seed-placeholder.jpg",
      latitude: -26.327,
      longitude: -48.863,
      address: "Rua dos Ipês, 400 — América, Joinville",
    },
    {
      user_id: eduarda.id,
      description: "Resíduos químicos e embalagens de tinta jogados no lote.",
      image_path: "uploads/seed-placeholder.jpg",
      latitude: -26.302,
      longitude: -48.821,
      address: "Rua Abdon Batista, 1100 — Jardim Paraíso, Joinville",
    },
  ]);

  console.log("6 denúncias inseridas.");

  console.log("\nSeed concluído com sucesso!");
  console.log("Usuários criados (senha: senha123):");
  insertedUsers.forEach((u) => console.log(`  - ${u.name} <${u.email}>`));

  process.exit(0);
}

seed();

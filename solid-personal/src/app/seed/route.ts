import { db } from "@vercel/postgres";
import { aboutMe, projects, helpfulContent } from "../lib/data";

const client = await db.connect();

async function seedAboutMe() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp`;

  await client.sql`
  CREATE TABLE IF NOT EXISTS aboutMe {
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT,
  }
  `;

  client.sql`
  INSERT INTO aboutMe (id, content)
  VALUES(${aboutMe[0].id}, ${aboutMe[0].content})
  ON CONFLICT (id) DO NOTHING;
  `;
}

async function seedProjects() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp`;
  await client.sql`
  CREATE TABLE IF NOT EXISTS projects {
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    link TEXT NOT NULL,
  }
  `;
}

async function seedHelpfulContent() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp`;
  await client.sql`
  CREATE TABLE IF NOT EXISTS helpfulContent {
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(500),
    author VARCHAR(255),
    link TEXT,
  }
  `;
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedAboutMe();
    await seedProjects();
    await seedHelpfulContent();
    await client.sql`COMMIT`;

    return Response.json({ message: "DB successfully seeded" });
  } catch (e) {
    await client.sql`ROLLBACK`;
    return Response.json({ e }, { status: 500 });
  }
}

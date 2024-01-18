import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // コース情報
  const courses = await prisma.courses.createMany({
    data: [
      { name: "IT" },
      { name: "Web" },
      { name: "経営情報" },
      { name: "国際エンジニア" },
    ],
  });
  // ジャンル
  const genres = await prisma.genres.createMany({
    data: [
      { name: "Web・アプリデザイン" },
      { name: "Webシステム" },
      { name: "モバイルアプリ" },
      { name: "AI" },
      { name: "IoT" },
      { name: "ネットワーク・インフラ" },
      { name: "その他（システム）" },
    ],
  });
  // 技術
  const technologies = await prisma.technologies.createMany({
    data: [
      { name: "C / C++" },
      { name: "C#" },
      { name: "Java" },
      { name: "Kotlin" },
      { name: "Swift" },
      { name: "Dart" },
      { name: "Python" },
      { name: "PHP" },
      { name: "Go" },
      { name: "Rust" },
      { name: "HTML" },
      { name: "CSS" },
      { name: "Javascript" },
      { name: "TypeScript" },
      { name: "Flutter" },
      { name: "React Native" },
      { name: "SwiftUI" },
      { name: "Electron" },
      { name: "Angular" },
      { name: "React.js" },
      { name: "Vue.js" },
      { name: "Nest.js" },
      { name: "Nuxt.js" },
      { name: "Next.js" },
      { name: "Node.js" },
      { name: "jQuery" },
      { name: "Bootstrap" },
      { name: "TailwindCSS" },
      { name: "SASS (SCSS)" },
      { name: "Pug" },
      { name: "OpenCV" },
      { name: "Unity" },
      { name: "Arduino" },
      { name: "ESP32" },
      { name: "M5" },
      { name: "Rasberry Pi" },
      { name: "MySQL" },
      { name: "PostgreSQL" },
      { name: "MongoDB" },
      { name: "SQLite" },
      { name: "GraphQL" },
      { name: "Apache" },
      { name: "Tomcat" },
      { name: "Nginx" },
      { name: "Express.js" },
      { name: "Django" },
      { name: "Laravel" },
      { name: "Rails" },
      { name: "Ruby on Rails" },
      { name: "Spring" },
      { name: "Xamarin" },
      { name: "Flask" },
      { name: "FastAPI" },
      { name: "Docker" },
      { name: "Kubernetes" },
      { name: "Argo CD" },
      { name: "Ansible" },
      { name: "Jenkins" },
      { name: "Terraform" },
      { name: "AWS" },
      { name: "Azure" },
      { name: "GCP" },
      { name: "Firebase" },
      { name: "GAS" },
      { name: "Github Actions" },
      { name: "TensorFlow" },
      { name: "PyTorch" },
      { name: "LlamaIndex" },
    ],
  });

  // 使用ツール
  const tools = await prisma.tools.createMany({
    data: [
      { name: "After Effects" },
      { name: "Android studio" },
      { name: "AutoCAD LT" },
      { name: "Backlog" },
      { name: "CATIA" },
      { name: "Canva" },
      { name: "ChatGPT" },
      { name: "Creality Print" },
      { name: "CodeMagic" },
      { name: "Discord" },
      { name: "Eagle" },
      { name: "Excel" },
      { name: "Figma" },
      { name: "Fusion 360" },
      { name: "Git" },
      { name: "GitHub" },
      { name: "IJCAD" },
      { name: "IbisPaint" },
      { name: "Illustrator" },
      { name: "Inventor" },
      { name: "KiCad" },
      { name: "Notion" },
      { name: "Photoshop" },
      { name: "Premiere" },
      { name: "Quadcept" },
      { name: "SOLIDWORKS" },
      { name: "Slack" },
      { name: "Teams" },
      { name: "VisualStudio" },
      { name: "VS Code" },
      { name: "Vectorworks" },
      { name: "XD" },
      { name: "Xcode" },
    ],
  });

  // 権限
  const roles = await prisma.roles.createMany({
    data: [
      { name: "admin" }, // 管理者
      { name: "exhibitor" }, // 出展者
      { name: "visitor" }, // 来場者
    ],
  });
  // 希望職種
  const jobs = await prisma.jobs.createMany({
    data: [
      { name: "UI/UXデザイナー" },
      { name: "Webデザイナー" },
      { name: "フロントエンドエンジニア" },
      { name: "バックエンドエンジニア" },
      { name: "スマホアプリエンジニア" },
      { name: "インフラエンジニア" },
      { name: "ネットワークエンジニア" },
      { name: "セキュリティエンジニア" },
      { name: "クラウドエンジニア" },
      { name: "IoTエンジニア" },
      { name: "AIエンジニア" },
      { name: "システムエンジニア" },
      { name: "データサイエンティスト" },
      { name: "機械・電気系エンジニア" },
      { name: "プロダクトマネージャー" },
      { name: "システム/ITコンサルタント" },
      { name: "戦略/経営コンサルタント" },
      { name: "営業" },
      { name: "その他" },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

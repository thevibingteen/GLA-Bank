import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://ketansingh00001412_db_user:ikGUWyNAyVKnqRze@cluster0.d9uhq9b.mongodb.net/glabank?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret (generate a strong random string in production)
JWT_SECRET=glabank-super-secret-jwt-key-2024-change-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173
`;

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file with MongoDB Atlas credentials');
} else {
  console.log('ℹ️  .env file already exists');
  // Update MONGODB_URI if it exists
  const existing = fs.readFileSync(envPath, 'utf8');
  if (!existing.includes('cluster0.d9uhq9b.mongodb.net')) {
    const updated = existing.replace(
      /MONGODB_URI=.*/,
      'MONGODB_URI=mongodb+srv://ketansingh00001412_db_user:ikGUWyNAyVKnqRze@cluster0.d9uhq9b.mongodb.net/glabank?retryWrites=true&w=majority&appName=Cluster0'
    );
    fs.writeFileSync(envPath, updated);
    console.log('✅ Updated .env file with MongoDB Atlas credentials');
  } else {
    console.log('✅ .env file already has MongoDB Atlas credentials');
  }
}


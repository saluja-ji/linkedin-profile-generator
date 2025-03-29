import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection URI from environment variable
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/linkedin-website-generator';

async function testConnection() {
  const client = new MongoClient(uri);
  
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('✅ Connected to MongoDB successfully!');
    
    // Get list of databases
    const adminDb = client.db('admin');
    const dbs = await adminDb.admin().listDatabases();
    
    console.log('Available databases:');
    dbs.databases.forEach(db => {
      console.log(`- ${db.name}`);
    });
    
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
  } finally {
    // Close the connection
    await client.close();
    console.log('Connection closed');
  }
}

testConnection();
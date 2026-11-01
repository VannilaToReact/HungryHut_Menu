require('dotenv').config({ path: __dirname + '/../.env' });
require('dotenv').config({ path: __dirname + '/../../.env' });

const mongoose = require('mongoose');
const connectToDatabase = require('../lib/mongodb');
const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');
const Setting = require('../models/Setting');
const Admin = require('../models/Admin');
const { DEFAULT_MENU_DATA, DEFAULT_CATEGORIES, DEFAULT_THEME_DATA, DEFAULT_FOOTER_DATA } = require('../seed/seedData');

async function runMigration() {
  console.log('🚀 Starting HungryHut Data Migration to MongoDB Atlas...');

  try {
    const conn = await connectToDatabase();
    console.log(`✅ Connected to database: "${conn.connection.name}"`);

    // 1. Inspect existing menu items
    const existingCount = await MenuItem.countDocuments();
    console.log(`🔍 Current MenuItem count in MongoDB: ${existingCount}`);

    let insertedCount = 0;
    let skippedCount = 0;

    for (const item of DEFAULT_MENU_DATA) {
      const exists = await MenuItem.findOne({ id: item.id });
      if (!exists) {
        await MenuItem.create(item);
        insertedCount++;
      } else {
        skippedCount++;
      }
    }
    console.log(`✅ Menu Migration: ${insertedCount} inserted, ${skippedCount} already existed (duplicates prevented).`);

    // 2. Inspect categories
    for (const cat of DEFAULT_CATEGORIES) {
      await Category.findOneAndUpdate(
        { name: cat.name },
        { $setOnInsert: cat },
        { upsert: true }
      );
    }
    console.log('✅ Categories verified & preserved.');

    // 3. Inspect application settings (Theme, Footer, Sync State)
    await Setting.findOneAndUpdate(
      { key: 'theme' },
      { $setOnInsert: { value: DEFAULT_THEME_DATA, description: 'Active color theme' } },
      { upsert: true }
    );

    await Setting.findOneAndUpdate(
      { key: 'footer' },
      { $setOnInsert: { value: DEFAULT_FOOTER_DATA, description: 'Restaurant footer info' } },
      { upsert: true }
    );

    await Setting.findOneAndUpdate(
      { key: 'sync_state' },
      { $setOnInsert: { value: { version: 1, lastUpdated: new Date() } } },
      { upsert: true }
    );
    console.log('✅ Settings (Theme, Footer, Sync State) verified & preserved.');

    // 4. Verify Admin Account
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@hungryhut.com').toLowerCase().trim();
    const adminExists = await Admin.findOne({ email: adminEmail });
    if (!adminExists) {
      const password = process.env.ADMIN_PASSWORD || '@admin(hungryhut)';
      await Admin.create({
        email: adminEmail,
        password,
        role: 'admin'
      });
      console.log(`✅ Admin account created: ${adminEmail}`);
    } else {
      console.log(`✅ Admin account verified: ${adminEmail}`);
    }

    // 5. Final Verification Audit
    const finalItemCount = await MenuItem.countDocuments();
    const finalCatCount = await Category.countDocuments();
    const finalSettings = await Setting.countDocuments();

    console.log('\n📊 Migration Summary & Verification:');
    console.log(` - Menu Items: ${finalItemCount} dishes in MongoDB`);
    console.log(` - Categories: ${finalCatCount} categories`);
    console.log(` - Settings Documents: ${finalSettings}`);
    console.log('🎉 Data Migration successfully completed and verified without data loss!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();


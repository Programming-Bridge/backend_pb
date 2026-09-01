const dotenv = require('dotenv');
dotenv.config();

const dbConnection = require('../config/db');
const User = require('../model/user.model');

const seedAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await dbConnection();

        const adminName = process.env.ADMIN_NAME || 'Programming Bridge Admin';
        const adminEmail = (process.env.ADMIN_EMAIL || 'admin@programmingbridge.org').toLowerCase().trim();
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';

        let user = await User.findOne({ email: adminEmail }).select('+password');

        if (user) {
            console.log(`User ${adminEmail} found. Updating password...`);
            user.password = adminPassword; // Pre-save hook will hash it
            user.name = adminName;
            user.role = 'superadmin';
            user.isActive = true;
            await user.save();
            console.log(`✅ Admin account updated successfully!`);
        } else {
            console.log(`Creating new admin account for ${adminEmail}...`);
            user = new User({
                name: adminName,
                email: adminEmail,
                password: adminPassword,
                role: 'superadmin',
                isActive: true,
            });
            await user.save();
            console.log(`✅ Admin account created successfully!`);
        }

        console.log(`-------------------------------------------`);
        console.log(`👤 Admin Name:     ${adminName}`);
        console.log(`📧 Admin Email:    ${adminEmail}`);
        console.log(`🔑 Admin Password: ${adminPassword}`);
        console.log(`-------------------------------------------`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();

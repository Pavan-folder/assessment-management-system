import { User } from '../models/User';

// In-memory user storage (shared with auth routes)
const users: Map<string, User> = new Map();

export async function initializeUsers() {
  try {
    // Check if admin user already exists
    const existingAdmin = users.get('admin@example.com');
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Create default admin user
    const adminUser = new User(
      'admin@example.com',
      'admin123', // Default password
      'Admin',
      'User'
    );

    // Hash the password
    await adminUser.hashPassword();

    // Store in memory
    users.set('admin@example.com', adminUser);

    console.log('✅ Admin user initialized successfully');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Password: admin123');
    console.log('⚠️  Please change the default password after first login');
  } catch (error) {
    console.error('❌ Error initializing admin user:', error);
  }
}

export { users };

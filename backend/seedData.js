const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');
const Reservation = require('./models/Reservation');
const Contact = require('./models/Contact');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Promise.all([
      User.deleteMany({}),
      MenuItem.deleteMany({}),
      Order.deleteMany({}),
      Reservation.deleteMany({}),
      Contact.deleteMany({}),
    ]);

    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('password123', 10);

    const [admin, john] = await User.create([
      {
        name: 'Admin',
        email: 'admin@gmail.com',
        password: adminPassword,
        role: 'admin',
      },
      {
        name: 'John Doe',
        email: 'john@gmail.com',
        password: userPassword,
        role: 'user',
      },
    ]);

    const menuItems = await MenuItem.insertMany([
      {
        name: 'Midnight Maroon Risotto',
        description:
          'Creamy arborio rice infused with red wine, wild mushrooms, and aged parmesan, finished with a maroon beet reduction.',
        price: 1099,
        category: 'Mains',
        image: '/images/risotto.jpg',
        location: 'Main',
      },
      {
        name: 'Seaside Citrus Cured Salmon',
        description:
          'Cured in salt, citrus, and a little seaside salt. Served with a lime crema.',
        price: 950,
        category: 'Mains',
        location: 'Main',
      },
      {
        name: 'Riverside Charcoal Burger',
        description:
          'A thick patty charred over riverbed embers. Topped with smoked gouda and onion jam.',
        price: 850,
        category: 'Mains',
        location: 'Main',
      },
      {
        name: 'Ember Roasted Carrots',
        description: 'Tossed in a honey and charcoal glaze. Riverside soul on a plate.',
        price: 450,
        category: 'Starters',
        location: 'Main',
      },
    ]);

    john.favorites = [menuItems[0]._id, menuItems[1]._id];
    await john.save();

    await Reservation.create({
      user: john._id,
      name: 'John Doe',
      email: 'john@gmail.com',
      phone: '+1 555 000 1234',
      branch: 'Main',
      date: '2026-03-10',
      time: '19:30',
      partySize: 2,
      notes: 'Window seat if possible.',
      status: 'confirmed',
    });

    await Order.create({
      user: john._id,
      customerName: john.name,
      items: [
        {
          menuItem: menuItems[0]._id,
          name: menuItems[0].name,
          price: menuItems[0].price,
          quantity: 1,
        },
        {
          menuItem: menuItems[2]._id,
          name: menuItems[2].name,
          price: menuItems[2].price,
          quantity: 2,
        },
      ],
      totalAmount: menuItems[0].price + menuItems[2].price * 2,
      location: 'Main',
      notes: 'Leave at reception if late.',
      status: 'completed',
    });

    await Contact.create([
      {
        name: 'Sarah Miller',
        email: 'sarah.miller@gmail.com',
        phone: '+1 555 123 4567',
        message: 'Do you offer private dining for groups of 12? Looking for a celebration venue.',
      },
      {
        name: 'James Wilson',
        email: 'j.wilson@yahoo.com',
        phone: '+1 555 987 6543',
        message: 'The Midnight Maroon Risotto was incredible. Just wanted to let the chef know!',
      },
    ]);

    // eslint-disable-next-line no-console
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Seeding failed', err);
    process.exit(1);
  }
}

seed();


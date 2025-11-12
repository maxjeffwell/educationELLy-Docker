import 'dotenv/config.js';
import mongoose from 'mongoose';
import User from '../models/user.js';
import Student from '../models/student.js';

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/local');
    console.log('Connected to MongoDB');

    // Create sample users (only if they don't exist)
    const usersData = [
      {
        email: 'demo@example.com',
        password: 'demopassword',
      },
      {
        email: 'teacher1@example.com',
        password: 'password123',
      },
      {
        email: 'teacher2@example.com',
        password: 'password123',
      },
      {
        email: 'admin@example.com',
        password: 'password123',
      },
      {
        email: 'demo2@example.com',
        password: 'demopassword',
      }
    ];

    let createdUsers = 0;
    for (const userData of usersData) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        createdUsers++;
      }
    }
    console.log(`Created ${createdUsers} new users`);

    // Create sample students (only if they don't exist)
    const studentsData = [
      {
        fullName: 'Maria Rodriguez',
        school: 'Lincoln Elementary',
        studentId: 12345,
        teacher: 'Ms. Johnson',
        dateOfBirth: new Date('2012-03-15'),
        gender: 'Female',
        race: 'Hispanic',
        gradeLevel: 5,
        nativeLanguage: 'Spanish',
        cityOfBirth: 'Mexico City',
        countryOfBirth: 'Mexico',
        ellStatus: 'ELL',
        compositeLevel: 'Intermediate',
        active: true,
        designation: 'General Education',
      },
      {
        fullName: 'Yuki Tanaka',
        school: 'Lincoln Elementary',
        studentId: 12346,
        teacher: 'Mr. Davis',
        dateOfBirth: new Date('2013-07-22'),
        gender: 'Male',
        race: 'Asian',
        gradeLevel: 4,
        nativeLanguage: 'Japanese',
        cityOfBirth: 'Tokyo',
        countryOfBirth: 'Japan',
        ellStatus: 'ELL',
        compositeLevel: 'Beginning',
        active: true,
        designation: 'General Education',
      },
      {
        fullName: 'Ahmed Hassan',
        school: 'Washington Middle School',
        studentId: 12347,
        teacher: 'Mrs. Smith',
        dateOfBirth: new Date('2011-11-08'),
        gender: 'Male',
        race: 'Middle Eastern',
        gradeLevel: 6,
        nativeLanguage: 'Arabic',
        cityOfBirth: 'Cairo',
        countryOfBirth: 'Egypt',
        ellStatus: 'ELL',
        compositeLevel: 'Intermediate',
        active: true,
        designation: 'Special Education',
      },
      {
        fullName: 'Ling Chen',
        school: 'Washington Middle School',
        studentId: 12348,
        teacher: 'Mr. Thompson',
        dateOfBirth: new Date('2010-02-28'),
        gender: 'Female',
        race: 'Asian',
        gradeLevel: 7,
        nativeLanguage: 'Mandarin',
        cityOfBirth: 'Beijing',
        countryOfBirth: 'China',
        ellStatus: 'Former ELL',
        compositeLevel: 'Advanced',
        active: true,
        designation: 'General Education',
      },
      {
        fullName: 'Sofia Petrov',
        school: 'Lincoln Elementary',
        studentId: 12349,
        teacher: 'Ms. Johnson',
        dateOfBirth: new Date('2012-09-12'),
        gender: 'Female',
        race: 'White',
        gradeLevel: 5,
        nativeLanguage: 'Russian',
        cityOfBirth: 'Moscow',
        countryOfBirth: 'Russia',
        ellStatus: 'ELL',
        compositeLevel: 'Intermediate',
        active: true,
        designation: 'General Education',
      },
      {
        fullName: 'Jean-Pierre Dubois',
        school: 'Roosevelt High School',
        studentId: 12350,
        teacher: 'Mr. Anderson',
        dateOfBirth: new Date('2008-04-30'),
        gender: 'Male',
        race: 'Black',
        gradeLevel: 9,
        nativeLanguage: 'French',
        cityOfBirth: 'Port-au-Prince',
        countryOfBirth: 'Haiti',
        ellStatus: 'ELL',
        compositeLevel: 'Advanced',
        active: true,
        designation: 'General Education',
      },
      {
        fullName: 'Fatima Al-Rashid',
        school: 'Washington Middle School',
        studentId: 12351,
        teacher: 'Mrs. Smith',
        dateOfBirth: new Date('2011-06-18'),
        gender: 'Female',
        race: 'Middle Eastern',
        gradeLevel: 6,
        nativeLanguage: 'Arabic',
        cityOfBirth: 'Damascus',
        countryOfBirth: 'Syria',
        ellStatus: 'ELL',
        compositeLevel: 'Beginning',
        active: true,
        designation: 'General Education',
      },
      {
        fullName: 'Carlos Mendez',
        school: 'Roosevelt High School',
        studentId: 12352,
        teacher: 'Ms. Martinez',
        dateOfBirth: new Date('2007-12-03'),
        gender: 'Male',
        race: 'Hispanic',
        gradeLevel: 10,
        nativeLanguage: 'Spanish',
        cityOfBirth: 'Guatemala City',
        countryOfBirth: 'Guatemala',
        ellStatus: 'Former ELL',
        compositeLevel: 'Proficient',
        active: true,
        designation: 'General Education',
      },
      {
        fullName: 'Min-Ji Park',
        school: 'Lincoln Elementary',
        studentId: 12353,
        teacher: 'Mr. Davis',
        dateOfBirth: new Date('2013-10-25'),
        gender: 'Female',
        race: 'Asian',
        gradeLevel: 4,
        nativeLanguage: 'Korean',
        cityOfBirth: 'Seoul',
        countryOfBirth: 'South Korea',
        ellStatus: 'ELL',
        compositeLevel: 'Beginning',
        active: true,
        designation: 'General Education',
      },
      {
        fullName: 'Oluwaseun Adeyemi',
        school: 'Roosevelt High School',
        studentId: 12354,
        teacher: 'Mr. Anderson',
        dateOfBirth: new Date('2008-08-14'),
        gender: 'Male',
        race: 'Black',
        gradeLevel: 9,
        nativeLanguage: 'Yoruba',
        cityOfBirth: 'Lagos',
        countryOfBirth: 'Nigeria',
        ellStatus: 'ELL',
        compositeLevel: 'Intermediate',
        active: true,
        designation: 'General Education',
      },
    ];

    let createdStudents = 0;
    for (const studentData of studentsData) {
      const existingStudent = await Student.findOne({ studentId: studentData.studentId });
      if (!existingStudent) {
        await Student.create(studentData);
        createdStudents++;
      }
    }

    console.log(`Created ${createdStudents} new students`);

    console.log('\nDatabase seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('Email: demo@example.com, Password: demopassword');
    console.log('Email: teacher1@example.com, Password: password123');
    console.log('Email: teacher2@example.com, Password: password123');
    console.log('Email: admin@example.com, Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
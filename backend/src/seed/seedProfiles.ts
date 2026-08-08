import User from '../models/User.js';
import Event from '../models/Event.js';

// this function is used for seeding default profiles and initial campus poster events for more info refer code-wiki.md line 14
export const seedInitialData = async (): Promise<void> => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Seed] Creating default Student, Organizer, and Teacher profiles...');
      
      const student = await User.create({
        name: 'Rahul V. S.',
        email: 'rahul.s6@ktu.edu.in',
        role: 'STUDENT',
        department: 'Computer Science & Engineering',
        studentId: 'TVE21CS045',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
      });

      const organizer = await User.create({
        name: 'IEEE Student Branch Council',
        email: 'ieee@campus.edu.in',
        role: 'ORGANIZER',
        department: 'Innovation & Student Affairs',
        avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80'
      });

      const teacher = await User.create({
        name: 'Dr. Anjali Nair',
        email: 'anjali.nair@ktu.edu.in',
        role: 'TEACHER',
        department: 'Computer Science HOD / Staff Advisor',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
      });

      console.log(`[Seed] Profiles seeded: Student (${student._id}), Organizer (${organizer._id}), Teacher (${teacher._id})`);

      // Seed initial vibrant events for immediate swipe feed demo
      const initialEvents = [
        {
          title: 'HackCampus 2026: 24h Build-a-Thon',
          description: 'Build futuristic solutions for campus automation, sustainability, and student lifecycle management. Win cash prizes worth ₹50,000!',
          organizerId: organizer._id,
          organizerName: 'IEEE Student Branch Council',
          activityGroup: 'Group I',
          points: 30,
          date: new Date(Date.now() + 86400000 * 5),
          location: 'Main Auditorium & Innovation Lab',
          posterUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
          registrationCap: 150,
          registeredCount: 0,
          isCompleted: false
        },
        {
          title: 'AI & Quantum Computing Workshop',
          description: 'Hands-on intensive masterclass on Qiskit, PyTorch, and deep learning architectures led by industry research engineers.',
          organizerId: organizer._id,
          organizerName: 'IEEE Student Branch Council',
          activityGroup: 'Group I',
          points: 20,
          date: new Date(Date.now() + 86400000 * 3),
          location: 'CS Seminar Hall 2',
          posterUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
          registrationCap: 80,
          registeredCount: 0,
          isCompleted: false
        },
        {
          title: 'Rhythms 2026: Inter-College Cultural Fest',
          description: 'Battle of the bands, classical & fusion dance, photography exhibition, and live DJ night. Earn KTU Group III Activity Points!',
          organizerId: organizer._id,
          organizerName: 'Arts & Cultural Cell',
          activityGroup: 'Group III',
          points: 25,
          date: new Date(Date.now() + 86400000 * 12),
          location: 'Campus Open Air Theatre (OAT)',
          posterUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
          registrationCap: 500,
          registeredCount: 0,
          isCompleted: false
        },
        {
          title: 'Green Campus Clean Energy Drive',
          description: 'NSS initiative for solar panel installation audit, e-waste recycling collection, and tree plantation across campus grounds.',
          organizerId: organizer._id,
          organizerName: 'NSS Unit 104',
          activityGroup: 'Group II',
          points: 15,
          date: new Date(Date.now() + 86400000 * 7),
          location: 'Campus Square',
          posterUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
          registrationCap: 100,
          registeredCount: 0,
          isCompleted: false
        }
      ];

      await Event.insertMany(initialEvents);
      console.log('[Seed] Initial poster events created successfully!');
    }
  } catch (error) {
    console.error('[Seed] Error seeding data:', error);
  }
};

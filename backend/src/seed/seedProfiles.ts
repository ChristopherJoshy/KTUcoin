import User from '../models/User';
import Event from '../models/Event';
import Discussion from '../models/Discussion';

// this function is used for seeding default profiles, poster events, and discussion threads into MongoDB for more info refer code-wiki.md line 14
export const seedInitialData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create([
        {
          name: 'Rahul V. S.',
          email: 'rahul@ktu.edu.in',
          role: 'STUDENT',
          studentId: 'TVE21CS045',
          department: 'Computer Science & Engineering',
          avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
        },
        {
          name: 'IEEE Student Branch Council',
          email: 'ieee@ktu.edu.in',
          role: 'ORGANIZER',
          department: 'Campus Activity Council',
          avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150'
        },
        {
          name: 'Dr. Anjali Nair',
          email: 'anjali.nair@ktu.edu.in',
          role: 'TEACHER',
          department: 'Computer Science HOD',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
        }
      ]);
      console.log('Seed: Default profiles created in MongoDB');
    }

    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      const organizer = await User.findOne({ role: 'ORGANIZER' });
      const organizerId = organizer ? organizer._id : undefined;

      await Event.create([
        {
          title: 'HackCampus 2026: 24-Hour AI & Web Challenge',
          description: 'Build demo-ready campus web applications. Win prizes and claim mandatory KTU activity points under Group I Technical Competitions.',
          posterUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
          points: 30,
          activityGroup: 'Group I Tech',
          date: '2026-08-15',
          venue: 'Main Auditorium, CET Campus',
          capacity: 150,
          registeredCount: 42,
          organizerId,
          status: 'UPCOMING'
        },
        {
          title: 'Green Energy & Solar Campus Drive',
          description: 'Participate in the sustainable energy awareness drive. Counts toward mandatory KTU Group II Social Service points.',
          posterUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&auto=format&fit=crop&q=80',
          points: 20,
          activityGroup: 'Group II Social',
          date: '2026-08-20',
          venue: 'Campus Square',
          capacity: 200,
          registeredCount: 88,
          organizerId,
          status: 'UPCOMING'
        },
        {
          title: 'Rhythms 2026: Inter-College Cultural Fest',
          description: 'Compete in music, arts, and drama competitions. Claim Group III Arts & Sports KTU Activity Points.',
          posterUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
          points: 25,
          activityGroup: 'Group III Arts',
          date: '2026-09-01',
          venue: 'Open Air Theatre',
          capacity: 300,
          registeredCount: 115,
          organizerId,
          status: 'UPCOMING'
        }
      ]);
      console.log('Seed: Default opportunity events created in MongoDB');
    }

    const discussionCount = await Discussion.countDocuments();
    if (discussionCount === 0) {
      await Discussion.create([
        {
          authorName: 'Rahul V. S.',
          authorRole: 'Student (S6 CSE)',
          authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
          title: 'How many Group I Activity Points does HackCampus 2026 award?',
          content: 'I noticed HackCampus is listed under Group I. Is the 30 points allocation credited directly to the advisor portal upon gate verification?',
          category: 'Group I Tech',
          upvotes: 24,
          comments: [
            {
              author: 'IEEE Student Branch Council',
              text: 'Yes! Once you scan your QR pass at the entrance and the event completes, points forward automatically to Dr. Anjali Nair queue.',
              createdAt: new Date()
            }
          ]
        },
        {
          authorName: 'Dr. Anjali Nair',
          authorRole: 'Staff Advisor',
          authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
          title: 'Guide to KTU Group II Social & Green Energy Drive Approvals',
          content: 'All S6 & S8 students participating in the Green Campus initiative must ensure gate QR scanning is recorded. Unverified attendance cannot be credited.',
          category: 'Group II Social',
          upvotes: 42,
          comments: []
        }
      ]);
      console.log('Seed: Default discussion threads created in MongoDB');
    }
  } catch (err) {
    console.error('Seed Error:', err);
  }
};

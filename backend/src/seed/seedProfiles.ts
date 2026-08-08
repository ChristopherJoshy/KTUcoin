import User from '../models/User';
import Event from '../models/Event';
import Discussion from '../models/Discussion';

// this function is used for seeding default profiles, KTU poster events, and Kerala campus discussion threads into MongoDB for more info refer code-wiki.md line 14
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
          department: 'College of Engineering Trivandrum (CET)',
          avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
        },
        {
          name: 'IEEE Student Branch Council',
          email: 'ieee@ktu.edu.in',
          role: 'ORGANIZER',
          department: 'CET Campus Activity Council',
          avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150'
        },
        {
          name: 'Dr. Anjali Nair',
          email: 'anjali.nair@ktu.edu.in',
          role: 'TEACHER',
          department: 'Senior Faculty Advisor (SFA), CSE Dept',
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
          description: 'Build demo-ready campus web applications. Win prizes and claim 30 mandatory KTU Activity Points under Group III (Hackathons & Innovations). Fulfills 30% of graduation requirements.',
          posterUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
          points: 30,
          activityGroup: 'Group III Arts',
          date: '2026-08-15',
          venue: 'Main Auditorium, CET Trivandrum',
          capacity: 150,
          registeredCount: 42,
          organizerId,
          status: 'UPCOMING'
        },
        {
          title: 'Green Energy & Solar Campus Drive',
          description: 'Participate in the sustainable energy awareness drive organized by NSS Unit 104. Fulfills Group I (Social Service) 20 Activity Points.',
          posterUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&auto=format&fit=crop&q=80',
          points: 20,
          activityGroup: 'Group I Social',
          date: '2026-08-20',
          venue: 'Campus Square, GEC Thrissur',
          capacity: 200,
          registeredCount: 88,
          organizerId,
          status: 'UPCOMING'
        },
        {
          title: 'Drishti 2026: National Level Technical Paper Presentation',
          description: 'Present original engineering research papers. Awarded 40 KTU Activity Points under Group II (Technical & Professional).',
          posterUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
          points: 40,
          activityGroup: 'Group II Tech',
          date: '2026-09-01',
          venue: 'Aryabhatta Hall, TKM College of Engineering',
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
          authorRole: 'Student (S6 CSE, CET)',
          authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
          title: 'How are Group III Hackathon points credited on KTU e-Gov portal?',
          content: 'We won 1st place in a state-level hackathon. Does Senior Faculty Advisor (SFA) require the hardcopy certificate or does gate QR verification directly sync with the 100 points graduation ledger?',
          category: 'Group III Arts',
          upvotes: 38,
          comments: [
            {
              author: 'IEEE Student Branch Council',
              text: 'Once the organizer marks the event complete in KTUcoins, your verified attendance auto-forwards to Dr. Anjali Nair approval queue with 30 points credited upon 1 click!',
              createdAt: new Date()
            },
            {
              author: 'Anish Kumar (GEC Thrissur)',
              text: 'Can confirm! Verified pass saved me from submitting manual paper certificates to advisor office.',
              createdAt: new Date()
            }
          ]
        },
        {
          authorName: 'Dr. Anjali Nair',
          authorRole: 'Senior Faculty Advisor (SFA)',
          authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
          title: 'Important: Deadline for S6 B.Tech Activity Point Submissions (2024 Scheme)',
          content: 'All S6 CSE students must ensure a minimum of 100 total activity points accrued across Group I (Social), Group II (Technical), and Group III (Innovations/Cultural). Point ledger upload closes on August 25.',
          category: 'Group I Tech',
          upvotes: 64,
          comments: [
            {
              author: 'NSS CET Unit 104',
              text: 'Students short on Group I points can join the Green Energy Solar Drive on August 20 for instant 20 points verification.',
              createdAt: new Date()
            }
          ]
        },
        {
          authorName: 'Devika Menon',
          authorRole: 'Student (S4 ECE, TKM)',
          authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          title: 'Can paper presentation in Drishti 2026 clear Group II Tech points requirement?',
          content: 'I currently have 50 points in Group I and 20 in Group III. If I present a paper at TKM Drishti, will the 40 points fully complete my 100-point graduation requirement?',
          category: 'Group II Tech',
          upvotes: 29,
          comments: [
            {
              author: 'Dr. Anjali Nair',
              text: 'Yes Devika! National level paper presentation awards 40 points under Group II Technical, pushing your total to 110 points.',
              createdAt: new Date()
            }
          ]
        },
        {
          authorName: 'Kiran Das',
          authorRole: 'Student (S8 Mech, MEC Kochi)',
          authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          title: 'Lateral Entry Student Activity Point minimum limit?',
          content: 'Just confirming for 3rd semester lateral entry joiners: Is our mandatory target 90 points instead of 100 points under KTU rules?',
          category: 'Internships',
          upvotes: 19,
          comments: [
            {
              author: 'Faculty Advisor Office',
              text: 'Correct. Lateral entry B.Tech requirement is 90 activity points across 6 semesters.',
              createdAt: new Date()
            }
          ]
        }
      ]);
      console.log('Seed: Default Kerala KTU discussion threads created in MongoDB');
    }
  } catch (err) {
    console.error('Seed Error:', err);
  }
};

import User from '../models/User';
import Event from '../models/Event';
import Discussion from '../models/Discussion';

// this function is used for seeding default profiles, real competition poster events, and Kerala campus discussion threads into MongoDB for more info refer code-wiki.md line 14
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
          department: 'SJCET Palai & CET Campus Council',
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

    const organizer = await User.findOne({ role: 'ORGANIZER' });
    const organizerId = organizer ? organizer._id : undefined;

    // Refresh default competition posters in MongoDB
    await Event.deleteMany({});
    await Event.create([
      {
        title: 'Nexus Wars: AI Agents Arena Challenge',
        description: 'AI AGENTS. ONE UNIVERSE. NO MERCY. Build autonomous AI agents competing in real-time strategic game loops. Prize Pool: 1st ₹1111, 2nd ₹777, 3rd ₹555. Grants +50 KTU Activity Points under Group III (Hackathons & Innovations).',
        posterUrl: '/posters/comp5.jpeg',
        points: 50,
        activityGroup: 'Group III Arts',
        date: '2026-07-31',
        venue: 'SJCET Palai AI Arena',
        capacity: 100,
        registeredCount: 68,
        organizerId,
        status: 'UPCOMING'
      },
      {
        title: 'Tech4Good: Ideas Today, Impact Tomorrow',
        description: 'Join SIGHT Quest Orientation Session with Dr. Arun P (Head, Dept. of ECE, SJCET). Explore how AI can drive meaningful humanitarian social impact, learn competition format, and submit proposal ideas.',
        posterUrl: '/posters/comp1.jpeg',
        points: 20,
        activityGroup: 'Group I Social',
        date: '2026-08-11',
        venue: 'Online / SJCET Seminar Hall',
        capacity: 250,
        registeredCount: 142,
        organizerId,
        status: 'UPCOMING'
      },
      {
        title: 'Elite League: Women in Engineering Competitive Coding',
        description: '7 Hybrid Sessions (6 Online Technical + 1 Offline LeetCode Practice). Learn competitive C programming from scratch (Variables, Loops, Arrays, Strings, Functions, Pointers). HackerRank assignments & Grand Finale prizes.',
        posterUrl: '/posters/comp2.jpeg',
        points: 30,
        activityGroup: 'Group II Tech',
        date: '2026-08-18',
        venue: 'IEEE Computer Society Lab, SJCET Palai',
        capacity: 120,
        registeredCount: 85,
        organizerId,
        status: 'UPCOMING'
      },
      {
        title: 'Elite League: 4-Week Competitive Programming League',
        description: 'Intensive 4-week competitive coding league for female engineering students. Master data structures, algorithmic efficiency, and contest strategies. Includes verified KTU Activity Points pass.',
        posterUrl: '/posters/comp3.jpeg',
        points: 40,
        activityGroup: 'Group II Tech',
        date: '2026-08-08',
        venue: 'Hybrid (Online Contests + Campus Finale)',
        capacity: 150,
        registeredCount: 110,
        organizerId,
        status: 'UPCOMING'
      },
      {
        title: 'IEEE SIGHT Membership Development Session',
        description: 'Orientation session led by Kritthik Rajeev Nair (Chair), Rijo Shaji (Vice Chair), and Alan K Albin (Secretary). Discover humanitarian technology grants, social project mentorship, and KTU activity point credits.',
        posterUrl: '/posters/comp4.jpeg',
        points: 20,
        activityGroup: 'Group I Social',
        date: '2026-08-05',
        venue: 'Campus Auditorium, Open to All Branches',
        capacity: 300,
        registeredCount: 195,
        organizerId,
        status: 'UPCOMING'
      }
    ]);
    console.log('Seed: 5 Real SJCET IEEE Competition events seeded in MongoDB');

    const discussionCount = await Discussion.countDocuments();
    if (discussionCount === 0) {
      await Discussion.create([
        {
          authorName: 'Rahul V. S.',
          authorRole: 'Student (S6 CSE, CET)',
          authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
          title: 'How are Group III Nexus Wars AI Arena points credited on KTU portal?',
          content: 'We are participating in Nexus Wars AI Agents Arena at SJCET. Does Senior Faculty Advisor (SFA) accept gate QR verification directly for the +50 activity points credit?',
          category: 'Group III Arts',
          upvotes: 45,
          comments: [
            {
              author: 'IEEE Student Branch Council',
              text: 'Yes! Once SJCET completes the event in KTUcoins, your verified attendance auto-forwards to Dr. Anjali Nair approval queue with 50 points credited upon 1 click!',
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
          upvotes: 72,
          comments: [
            {
              author: 'IEEE SIGHT Council',
              text: 'Students short on Group I points can join the Tech4Good Orientation for instant 20 points verification.',
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

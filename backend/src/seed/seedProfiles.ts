import User from '../models/User';
import Event from '../models/Event';
import Discussion from '../models/Discussion';

// this function is used for seeding default profiles, real competition poster events, and Kerala campus discussion threads into MongoDB for more info refer code-wiki.md line 14
export const seedInitialData = async () => {
  try {
    const defaultUsers = [
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
    ];

    for (const user of defaultUsers) {
      await User.findOneAndUpdate({ email: user.email }, user, { upsert: true });
    }
    console.log('Seed: Default profiles upserted in MongoDB');

    const organizer =
      (await User.findOne({ role: 'ORGANIZER' })) ||
      (await User.findOne({})) ||
      (await User.create(defaultUsers))[0];
    const organizerId = organizer ? organizer._id : undefined;

    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      await Event.create([
        {
          title: 'Nexus Wars: AI Agents Arena Challenge',
          description: 'AI AGENTS. ONE UNIVERSE. NO MERCY. Build autonomous AI agents competing in real-time strategic game loops. Prize Pool: 1st ₹1111, 2nd ₹777, 3rd ₹555. Grants +50 KTU Activity Points under Group III (Hackathons & Innovations).',
          posterUrl: '/posters/comp5.jpeg',
          points: 50,
          activityGroup: 'Group III',
          date: '2026-07-31',
          location: 'SJCET Palai AI Arena',
          registrationCap: 100,
          registeredCount: 68,
          organizerId,
          organizerName: 'IEEE Student Branch Council'
        },
        {
          title: 'Tech4Good: Ideas Today, Impact Tomorrow',
          description: 'Join SIGHT Quest Orientation Session with Dr. Arun P (Head, Dept. of ECE, SJCET). Explore how AI can drive meaningful humanitarian social impact, learn competition format, and submit proposal ideas.',
          posterUrl: '/posters/comp1.jpeg',
          points: 20,
          activityGroup: 'Group I',
          date: '2026-08-11',
          location: 'Online / SJCET Seminar Hall',
          registrationCap: 250,
          registeredCount: 142,
          organizerId,
          organizerName: 'IEEE Student Branch Council'
        },
        {
          title: 'Elite League: Women in Engineering Competitive Coding',
          description: '7 Hybrid Sessions (6 Online Technical + 1 Offline LeetCode Practice). Learn competitive C programming from scratch (Variables, Loops, Arrays, Strings, Functions, Pointers). HackerRank assignments & Grand Finale prizes.',
          posterUrl: '/posters/comp2.jpeg',
          points: 30,
          activityGroup: 'Group II',
          date: '2026-08-18',
          location: 'IEEE Computer Society Lab, SJCET Palai',
          registrationCap: 120,
          registeredCount: 85,
          organizerId,
          organizerName: 'IEEE Student Branch Council'
        },
        {
          title: 'Elite League: 4-Week Competitive Programming League',
          description: 'Intensive 4-week competitive coding league for female engineering students. Master data structures, algorithmic efficiency, and contest strategies. Includes verified KTU Activity Points pass.',
          posterUrl: '/posters/comp3.jpeg',
          points: 40,
          activityGroup: 'Group II',
          date: '2026-08-08',
          location: 'Hybrid (Online Contests + Campus Finale)',
          registrationCap: 150,
          registeredCount: 110,
          organizerId,
          organizerName: 'IEEE Student Branch Council'
        },
        {
          title: 'IEEE SIGHT Membership Development Session',
          description: 'Orientation session led by Kritthik Rajeev Nair (Chair), Rijo Shaji (Vice Chair), and Alan K Albin (Secretary). Discover humanitarian technology grants, social project mentorship, and KTU activity point credits.',
          posterUrl: '/posters/comp4.jpeg',
          points: 20,
          activityGroup: 'Group I',
          date: '2026-08-05',
          location: 'Campus Auditorium, Open to All Branches',
          registrationCap: 300,
          registeredCount: 195,
          organizerId,
          organizerName: 'IEEE Student Branch Council'
        }
      ]);
      console.log('Seed: 5 Real SJCET IEEE Competition events seeded in MongoDB');
    }

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
          content: 'All S6 CSE students must ensure a minimum of 120 total activity points accrued across Group I (Social), Group II (Technical), and Group III (Innovations/Cultural). Point ledger upload closes on August 25.',
          category: 'Group I Tech',
          upvotes: 72,
          comments: [
            {
              author: 'IEEE SIGHT Council',
              text: 'Students short on Group I points can join the Tech4Good Orientation for instant 20 points verification.',
              createdAt: new Date()
            }
          ]
        },
        {
          authorName: 'Meera K. S.',
          authorRole: 'Student (S6 CSE, CET)',
          authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          title: 'Nexus Wars AI Arena — what is the exact team size and prize split for 1st place?',
          content: 'Our team registered for Nexus Wars AI Agents Arena at SJCET Palai. The poster says 1st place takes ₹1111. Do we need exactly 4 members, and is the +50 Group III points shared across the whole team or given to each member individually?',
          category: 'Group III Arts',
          upvotes: 41,
          comments: [
            {
              author: 'IEEE Student Branch Council',
              text: 'Prize pool splits per team as a single award. The +50 KTU Activity Points are credited to EACH verified attendee individually after gate QR scan and advisor approval.',
              createdAt: new Date()
            },
            {
              author: 'Rahul V. S.',
              text: 'Team size is 2-4. Our squad of 3 is already practicing the arena loop every evening in the AI lab.',
              createdAt: new Date()
            }
          ]
        },
        {
          authorName: 'Adarsh T. P.',
          authorRole: 'Student (S4 ECE, SJCET)',
          authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          title: 'Tech4Good ideas — does the proposal need a working demo or just a slide deck?',
          content: 'Planning to attend the Tech4Good SIGHT Quest orientation on Aug 11. I have a rainwater-monitoring IoT idea but no prototype yet. Will an idea presentation with impact analysis be enough to earn the 20 Group I points?',
          category: 'Group I Social',
          upvotes: 29,
          comments: [
            {
              author: 'IEEE SIGHT Council',
              text: 'Idea-stage proposals are welcome. Dr. Arun P evaluates the social impact framework in the orientation — no working prototype needed for the points credit.',
              createdAt: new Date()
            }
          ]
        },
        {
          authorName: 'Fathima N. R.',
          authorRole: 'Student (S6 CSE, CET)',
          authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
          title: 'Elite League Women in Engineering — pointers first or straight to LeetCode?',
          content: 'Joined the Elite League 7-session coding track. The sessions cover pointers and arrays first, but the grand finale is LeetCode-style. Should I grind HackerRank basics in parallel or trust the offline practice session?',
          category: 'Group II Tech',
          upvotes: 35,
          comments: [
            {
              author: 'Rahul V. S.',
              text: 'Trust the offline session. Last year the finale mostly repeated the practice-set patterns with a twist.',
              createdAt: new Date()
            },
            {
              author: 'IEEE Student Branch Council',
              text: 'Session 5 is pointers-to-LeetCode mapping. Complete the HackerRank assignments — 30% of finale questions come straight from them.',
              createdAt: new Date()
            }
          ]
        },
        {
          authorName: 'Vishnu P. M.',
          authorRole: 'Student (S2 ME, SJCET)',
          authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
          title: 'IEEE SIGHT Membership orientation — is the 20 point credit automatic for all branches?',
          content: 'The SIGHT orientation on Aug 5 says "Open to All Branches". I am from Mechanical — will my attendance still trigger the Group I point credit, or does it need the HOD permission letter first?',
          category: 'Group I Social',
          upvotes: 24,
          comments: [
            {
              author: 'Dr. Anjali Nair',
              text: 'Cross-branch credits are fully valid. Send the HOD permission letter from the app after claiming your pass, and your verified attendance will auto-forward to my approval queue.',
              createdAt: new Date()
            }
          ]
        },
        {
          authorName: 'Lakshmi S. A.',
          authorRole: 'Student (S6 CSE, CET)',
          authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          title: '4-Week Competitive Programming League — can we audit sessions without the finale?',
          content: 'Interested in the 4-week Elite League track but have a project submission clash with the finale date. Can I attend the weekly contests for learning and still earn partial points without sitting the final contest?',
          category: 'Group II Tech',
          upvotes: 18,
          comments: [
            {
              author: 'IEEE Student Branch Council',
              text: 'Partial credit is possible — 10 points for weekly contest participation. The full 40 points require the campus finale attendance.',
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

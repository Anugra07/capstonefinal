import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const documentTitles = [
    'Product Roadmap Q1 2025',
    'Market Research Analysis',
    'Competitor Analysis Report',
    'User Interview Summary',
    'Technical Architecture Document',
    'Marketing Strategy Plan',
    'Financial Projections 2025',
    'Partnership Proposal',
    'Product Requirements Document',
    'Go-to-Market Strategy',
    'Customer Feedback Report',
    'Sales Playbook',
    'Engineering Roadmap',
    'Design System Guidelines',
    'User Persona Documentation',
    'Feature Specification',
    'API Documentation',
    'Security Audit Report',
    'Performance Metrics Dashboard',
    'Team Onboarding Guide',
    'Investor Pitch Deck',
    'Legal Compliance Checklist',
    'Brand Guidelines',
    'Content Strategy Plan',
    'Customer Success Playbook'
];

const taskTitles = [
    'Conduct 10 user interviews',
    'Design MVP wireframes',
    'Set up development environment',
    'Create landing page',
    'Build authentication system',
    'Implement payment integration',
    'Write API documentation',
    'Set up CI/CD pipeline',
    'Design database schema',
    'Create user onboarding flow',
    'Build admin dashboard',
    'Implement search functionality',
    'Add email notifications',
    'Create mobile responsive design',
    'Set up analytics tracking',
    'Write unit tests',
    'Perform security audit',
    'Optimize database queries',
    'Create marketing materials',
    'Launch beta program',
    'Gather user feedback',
    'Iterate on product features',
    'Scale infrastructure',
    'Hire engineering team',
    'Secure seed funding',
    'Build partner integrations',
    'Create content marketing strategy',
    'Design referral program',
    'Implement A/B testing',
    'Launch public beta',
    'Prepare investor pitch',
    'Build customer support system',
    'Create help documentation',
    'Set up monitoring and alerts',
    'Optimize conversion funnel'
];

const journalTitles = [
    'Week 1: Getting Started',
    'User Feedback Session Notes',
    'Product Development Update',
    'Team Meeting Summary',
    'Market Research Findings',
    'Technical Challenges Overcome',
    'Customer Interview Insights',
    'Feature Launch Reflection',
    'Partnership Discussion Notes',
    'Investor Meeting Recap',
    'Product Iteration Thoughts',
    'Team Building Activities',
    'Marketing Campaign Results',
    'Customer Success Stories',
    'Technical Architecture Decisions',
    'User Experience Improvements',
    'Business Model Refinement',
    'Competitive Analysis Update',
    'Team Growth Reflections',
    'Product Vision Alignment'
];

const messageContents = [
    'Hey team! Great progress this week.',
    'Let\'s schedule a meeting to discuss the roadmap.',
    'I think we should prioritize user feedback.',
    'The new feature is looking great!',
    'Can someone review the PR?',
    'Let\'s discuss the pricing strategy.',
    'I have some ideas for the onboarding flow.',
    'The user interviews went really well.',
    'We should update the documentation.',
    'Let\'s plan the next sprint.',
    'I found a bug in the authentication flow.',
    'The analytics dashboard needs updates.',
    'We should consider adding dark mode.',
    'The API performance looks good.',
    'Let\'s discuss the marketing strategy.',
    'I have feedback on the design mockups.',
    'We need to update the user guide.',
    'The deployment went smoothly.',
    'Let\'s schedule a demo for stakeholders.',
    'I think we should pivot slightly.',
    'The customer feedback is very positive.',
    'We need to improve error handling.',
    'Let\'s add more unit tests.',
    'The database migration is complete.',
    'We should update the roadmap.',
    'I have questions about the architecture.',
    'Let\'s discuss the hiring plan.',
    'The new feature is ready for testing.',
    'We should improve the documentation.',
    'Let\'s plan the next release.',
    'I have ideas for improving UX.',
    'The performance metrics look good.',
    'We should add more logging.',
    'Let\'s discuss the security audit.',
    'The customer support tickets are down.',
    'We need to update the API version.',
    'Let\'s plan the marketing campaign.',
    'I have feedback on the pricing.',
    'The team is doing great work!',
    'We should schedule a retrospective.',
    'Let\'s discuss the next features.',
    'The user onboarding needs improvement.',
    'We should add more analytics.',
    'Let\'s plan the team offsite.',
    'I have ideas for the product roadmap.',
    'The customer satisfaction is high.',
    'We need to update the terms of service.',
    'Let\'s discuss the partnership opportunities.',
    'The new design system is ready.',
    'We should improve the search functionality.'
];

const taskCategories = ['Validation', 'Product', 'Marketing', 'Engineering', 'Design', 'Sales', 'Operations'];
const taskStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];

async function seedDummyData() {
    console.log('🌱 Starting dummy data seeding...\n');

    try {
        // Find or create a test user
        let user = await prisma.user.findFirst({
            where: { email: { contains: 'test' } }
        });

        if (!user) {
            console.log('Creating test user...');
            user = await prisma.user.create({
                data: {
                    email: `test-user-${Date.now()}@example.com`,
                    password: 'hashedpassword',
                    name: 'Test User'
                }
            });
        }

        console.log(`✅ Using user: ${user.name} (${user.email})\n`);

        // Find or create a test space
        let space = await prisma.space.findFirst();

        if (!space) {
            console.log('Creating test space...');
            space = await prisma.space.create({
                data: {
                    name: 'Test Startup Space',
                    description: 'A test space for pagination demo',
                    problemStatement: 'Testing pagination functionality'
                }
            });

            // Add user as owner
            await prisma.spaceMember.create({
                data: {
                    userId: user.id,
                    spaceId: space.id,
                    role: 'OWNER'
                }
            });
        }

        console.log(`✅ Using space: ${space.name} (${space.id})\n`);

        // Ensure user is a member of the space
        const existingMember = await prisma.spaceMember.findFirst({
            where: {
                userId: user.id,
                spaceId: space.id
            }
        });

        if (!existingMember) {
            await prisma.spaceMember.create({
                data: {
                    userId: user.id,
                    spaceId: space.id,
                    role: 'OWNER'
                }
            });
        }

        // 1. Create Documents (25 items for pagination)
        console.log('📄 Creating documents...');
        const documentPromises = documentTitles.map((title, index) => {
            return prisma.document.create({
                data: {
                    spaceId: space.id,
                    title,
                    summary: `This is a detailed summary for ${title}. It contains important information about the document content and key insights. This document was created for testing pagination functionality.`,
                    createdAt: new Date(Date.now() - index * 3600000) // Stagger creation times
                }
            });
        });
        await Promise.all(documentPromises);
        console.log(`✅ Created ${documentTitles.length} documents\n`);

        // 2. Create Tasks (35 items for pagination)
        console.log('✅ Creating tasks...');
        const taskPromises = taskTitles.map((title, index) => {
            const status = taskStatuses[index % taskStatuses.length];
            const category = taskCategories[index % taskCategories.length];
            
            return prisma.task.create({
                data: {
                    spaceId: space.id,
                    userId: user.id,
                    title,
                    description: `Description for ${title}. This task is part of our development roadmap.`,
                    status,
                    category,
                    isAiGenerated: index % 3 === 0,
                    createdAt: new Date(Date.now() - index * 3600000)
                }
            });
        });
        await Promise.all(taskPromises);
        console.log(`✅ Created ${taskTitles.length} tasks\n`);

        // 3. Create Journal Entries (20 items for pagination)
        console.log('📝 Creating journal entries...');
        const journalPromises = journalTitles.map((title, index) => {
            return prisma.journalEntry.create({
                data: {
                    spaceId: space.id,
                    userId: user.id,
                    title,
                    content: `This is the content for ${title}. It contains detailed notes and reflections about our progress, challenges, and learnings. This entry was created for testing pagination functionality. We've made significant progress and learned valuable lessons along the way.`,
                    sentiment: index % 2 === 0 ? 'Positive' : 'Neutral',
                    createdAt: new Date(Date.now() - index * 3600000)
                }
            });
        });
        await Promise.all(journalPromises);
        console.log(`✅ Created ${journalTitles.length} journal entries\n`);

        // 4. Create Messages (50 items for pagination)
        console.log('💬 Creating messages...');
        const messagePromises = messageContents.map((content, index) => {
            return prisma.message.create({
                data: {
                    spaceId: space.id,
                    userId: user.id,
                    content,
                    createdAt: new Date(Date.now() - index * 60000) // Stagger by minutes
                }
            });
        });
        await Promise.all(messagePromises);
        console.log(`✅ Created ${messageContents.length} messages\n`);

        console.log('🎉 Dummy data seeding completed successfully!\n');
        console.log(`📊 Summary:`);
        console.log(`   - Documents: ${documentTitles.length}`);
        console.log(`   - Tasks: ${taskTitles.length}`);
        console.log(`   - Journal Entries: ${journalTitles.length}`);
        console.log(`   - Messages: ${messageContents.length}`);
        console.log(`\n🔗 Space ID: ${space.id}`);
        console.log(`👤 User ID: ${user.id}`);
        console.log(`\n💡 Use this space ID in your frontend to see pagination in action!`);

    } catch (error) {
        console.error('❌ Error seeding dummy data:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seedDummyData()
    .then(() => {
        console.log('\n✅ Seeding completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Seeding failed:', error);
        process.exit(1);
    });


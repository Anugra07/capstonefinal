import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
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

// Seed dummy data endpoint
router.post('/seed', async (req, res) => {
    const { spaceId, userId } = req.body;

    if (!spaceId || !userId) {
        return res.status(400).json({ error: 'spaceId and userId are required' });
    }

    try {
        // Verify space and user exist
        const space = await prisma.space.findUnique({ where: { id: spaceId } });
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!space) {
            return res.status(404).json({ error: 'Space not found' });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const results = {
            documents: 0,
            tasks: 0,
            journalEntries: 0,
            messages: 0
        };

        // Create Documents
        const documentPromises = documentTitles.map((title, index) => {
            return prisma.document.create({
                data: {
                    spaceId,
                    title,
                    summary: `This is a detailed summary for ${title}. It contains important information about the document content and key insights. This document was created for testing pagination functionality.`,
                    createdAt: new Date(Date.now() - index * 3600000)
                }
            });
        });
        const documents = await Promise.all(documentPromises);
        results.documents = documents.length;

        // Create Tasks
        const taskPromises = taskTitles.map((title, index) => {
            const status = taskStatuses[index % taskStatuses.length];
            const category = taskCategories[index % taskCategories.length];
            
            return prisma.task.create({
                data: {
                    spaceId,
                    userId,
                    title,
                    description: `Description for ${title}. This task is part of our development roadmap.`,
                    status,
                    category,
                    isAiGenerated: index % 3 === 0,
                    createdAt: new Date(Date.now() - index * 3600000)
                }
            });
        });
        const tasks = await Promise.all(taskPromises);
        results.tasks = tasks.length;

        // Create Journal Entries
        const journalPromises = journalTitles.map((title, index) => {
            return prisma.journalEntry.create({
                data: {
                    spaceId,
                    userId,
                    title,
                    content: `This is the content for ${title}. It contains detailed notes and reflections about our progress, challenges, and learnings. This entry was created for testing pagination functionality. We've made significant progress and learned valuable lessons along the way.`,
                    sentiment: index % 2 === 0 ? 'Positive' : 'Neutral',
                    createdAt: new Date(Date.now() - index * 3600000)
                }
            });
        });
        const journals = await Promise.all(journalPromises);
        results.journalEntries = journals.length;

        // Create Messages
        const messagePromises = messageContents.map((content, index) => {
            return prisma.message.create({
                data: {
                    spaceId,
                    userId,
                    content,
                    createdAt: new Date(Date.now() - index * 60000)
                }
            });
        });
        const messages = await Promise.all(messagePromises);
        results.messages = messages.length;

        res.json({
            success: true,
            message: 'Dummy data created successfully',
            results
        });
    } catch (error) {
        console.error('Error seeding data:', error);
        res.status(500).json({ error: 'Failed to seed dummy data: ' + error.message });
    }
});

export default router;


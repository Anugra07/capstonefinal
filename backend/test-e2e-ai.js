import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testE2E() {
    console.log('🚀 Starting End-to-End AI Co-founder Test\n');

    try {
        // Step 1: Create test space and user
        console.log('📦 Step 1: Creating test space and user...');
        const space = await prisma.space.create({
            data: {
                name: 'E2E Test Startup',
                description: 'Testing AI Co-founder functionality'
            }
        });

        const user = await prisma.user.create({
            data: {
                email: `e2e-test-${Date.now()}@example.com`,
                password: 'hashedpassword',
                name: 'E2E Test User'
            }
        });

        await prisma.spaceMember.create({
            data: {
                userId: user.id,
                spaceId: space.id,
                role: 'OWNER'
            }
        });

        console.log(`✅ Created space: ${space.name} (ID: ${space.id})\n`);

        // Step 2: Create chat messages
        console.log('💬 Step 2: Creating chat messages...');
        await fetch('http://localhost:4000/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                spaceId: space.id,
                userId: user.id,
                content: 'We need to launch our MVP by end of Q4 2025.'
            })
        });

        await fetch('http://localhost:4000/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                spaceId: space.id,
                userId: user.id,
                content: 'Our target is 10,000 users in the first month.'
            })
        });

        console.log('✅ Created 2 chat messages\n');

        // Step 3: Create journal entries
        console.log('📝 Step 3: Creating journal entries...');
        await fetch('http://localhost:4000/api/journal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                spaceId: space.id,
                userId: user.id,
                title: 'Product Strategy',
                content: 'We are building an AI-powered productivity tool for startups. Our main competitor is Notion.'
            })
        });

        await fetch('http://localhost:4000/api/journal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                spaceId: space.id,
                userId: user.id,
                title: 'Hiring Plan',
                content: 'We need to hire 2 senior engineers and 1 product designer by March 2025.'
            })
        });

        console.log('✅ Created 2 journal entries\n');

        // Step 4: Wait for embeddings to be processed
        console.log('⏳ Step 4: Waiting for embeddings to be stored...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log('✅ Embeddings should be stored\n');

        // Step 5: Test AI queries
        console.log('🤖 Step 5: Testing AI Co-founder queries...\n');

        const queries = [
            'What is our launch timeline?',
            'How many users are we targeting?',
            'Who are our competitors?',
            'What is our hiring plan?'
        ];

        for (const query of queries) {
            console.log(`\n📊 Query: "${query}"`);
            console.log('─'.repeat(60));

            const response = await fetch('http://localhost:4000/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    spaceId: space.id,
                    query: query
                })
            });

            if (!response.ok) {
                throw new Error(`AI chat failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            console.log(`\n💡 AI Response:\n${data.answer.substring(0, 300)}...`);
            console.log(`\n📚 Context Used: ${data.context.length} items`);
            data.context.forEach((ctx, i) => {
                console.log(`   ${i + 1}. [${ctx.type}] ${ctx.content.substring(0, 50)}...`);
            });
        }

        console.log('\n\n✅ All tests passed! AI Co-founder is working end-to-end! 🎉\n');

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

testE2E();

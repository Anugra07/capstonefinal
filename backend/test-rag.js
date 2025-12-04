import { PrismaClient } from '@prisma/client';
import { storeEmbedding, searchContext, genAI } from './utils/ai.js';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function testRAG() {
    console.log('Starting RAG Test...');

    try {
        // 1. Create Mock Data
        console.log('Creating mock space and user...');
        const space = await prisma.space.create({
            data: {
                name: 'Test Space ' + Date.now(),
                description: 'A test space for RAG verification'
            }
        });

        const user = await prisma.user.create({
            data: {
                email: 'test-rag-' + Date.now() + '@example.com',
                password: 'hashedpassword',
                name: 'Test User'
            }
        });

        const spaceMember = await prisma.spaceMember.create({
            data: {
                userId: user.id,
                spaceId: space.id,
                role: 'OWNER'
            }
        });

        console.log(`Created Space: ${space.name} (${space.id})`);

        // 2. Create Content & Embeddings
        console.log('Creating content and embeddings...');

        const messageContent = "We need to focus on hiring a React developer.";
        const message = await prisma.message.create({
            data: { spaceId: space.id, userId: user.id, content: messageContent }
        });
        await storeEmbedding('CHAT', message.id, messageContent, space.id);
        console.log('Stored chat embedding.');

        const journalContent = "Our Q3 goal is to launch the MVP by September.";
        const journal = await prisma.journalEntry.create({
            data: { spaceId: space.id, userId: user.id, title: "Q3 Goals", content: journalContent }
        });
        await storeEmbedding('JOURNAL', journal.id, "Q3 Goals\n" + journalContent, space.id);
        console.log('Stored journal embedding.');

        // 3. Test Vector Search
        console.log('Testing vector search...');
        const query = "What is our hiring plan?";
        const results = await searchContext(query, space.id);

        console.log('Search Results:');
        results.forEach(r => console.log(`- [${r.type}] ${r.content} (Score: ${r.score || 'N/A'})`));

        if (results.length > 0) {
            console.log('✅ Vector search working!');
        } else {
            console.error('❌ Vector search returned no results.');
        }

        // 4. Test Gemini Generation
        console.log('Testing Gemini generation...');
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `Context: ${results.map(r => r.content).join('\n')}\n\nQuestion: ${query}`;
        const result = await model.generateContent(prompt);
        console.log('AI Response:', result.response.text());
        console.log('✅ Gemini generation working!');

    } catch (error) {
        console.error('Test Failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testRAG();

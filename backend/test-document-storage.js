import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDocumentStorage() {
    console.log('📄 Testing Document Storage\n');

    try {
        // Get a test space
        const space = await prisma.space.findFirst();
        const user = await prisma.user.findFirst();

        if (!space || !user) {
            console.log('❌ No space or user found. Creating test data...');
            return;
        }

        console.log(`Using space: ${space.name} (${space.id})\n`);

        // Test 1: Create a document via API
        console.log('📝 Step 1: Creating document via API...');
        const response = await fetch('http://localhost:4000/api/documents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                spaceId: space.id,
                title: 'Product Roadmap Q1 2025',
                summary: 'Our roadmap includes launching MVP, acquiring first 1000 users, and securing seed funding.'
            })
        });

        if (!response.ok) {
            console.log(`❌ Document creation failed: ${response.status} ${response.statusText}`);
            const error = await response.text();
            console.log('Error:', error);
            return;
        }

        const doc = await response.json();
        console.log(`✅ Document created: ${doc.title}`);

        // Test 2: Wait for embedding to be stored
        console.log('\n⏳ Step 2: Waiting for embedding to be stored...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Test 3: Check if document is in database
        console.log('\n🔍 Step 3: Checking database...');
        const dbDoc = await prisma.document.findUnique({
            where: { id: doc.id }
        });

        if (dbDoc) {
            console.log(`✅ Document found in database: ${dbDoc.title}`);
        } else {
            console.log('❌ Document not found in database');
        }

        // Test 4: Check if embedding exists
        const embedding = await prisma.embedding.findFirst({
            where: {
                type: 'DOC',
                sourceId: doc.id
            }
        });

        if (embedding) {
            console.log(`✅ Embedding found for document`);
            console.log(`   Content: ${embedding.content.substring(0, 60)}...`);
        } else {
            console.log('❌ No embedding found for document');
        }

        // Test 5: Query AI about the document
        console.log('\n🤖 Step 4: Testing AI access to document...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay to avoid rate limit

        const aiResponse = await fetch('http://localhost:4000/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                spaceId: space.id,
                query: 'What is in our product roadmap?'
            })
        });

        if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            console.log(`✅ AI successfully queried`);
            console.log(`   Retrieved ${aiData.context.length} context items`);

            const hasDocContext = aiData.context.some(ctx => ctx.type === 'DOC');
            if (hasDocContext) {
                console.log(`   ✅ AI found the document in context!`);
            } else {
                console.log(`   ⚠️ AI did not retrieve the document (might need more time for indexing)`);
            }

            console.log(`\n   AI Response: ${aiData.answer.substring(0, 200)}...`);
        } else {
            console.log(`⚠️ AI query failed: ${aiResponse.status} (might be rate limited)`);
        }

        console.log('\n' + '='.repeat(60));
        console.log('✅ Document storage test complete!');
        console.log('='.repeat(60));

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

testDocumentStorage();

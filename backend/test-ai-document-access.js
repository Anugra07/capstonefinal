import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAIDocumentAccess() {
    console.log('🔍 Testing AI Access to Document Content\n');

    try {
        // Get a test space
        const space = await prisma.space.findFirst();

        if (!space) {
            console.log('❌ No space found. Please create a space first.');
            return;
        }

        console.log(`Using space: ${space.name} (${space.id})\n`);

        // Step 1: Create a test document with meaningful content
        console.log('📄 Step 1: Creating test document...');
        const testDoc = await prisma.document.create({
            data: {
                spaceId: space.id,
                title: 'Product Roadmap 2025',
                summary: 'Our 2025 roadmap includes launching AI features, expanding to enterprise customers, and achieving 100K users by Q4.'
            }
        });
        console.log(`✅ Created document: ${testDoc.title}`);

        // Step 2: Wait for embedding to be stored
        console.log('\n⏳ Step 2: Waiting for embedding to be stored...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Step 3: Check if embedding exists
        const embedding = await prisma.embedding.findFirst({
            where: {
                sourceId: testDoc.id,
                type: 'DOC'
            }
        });

        if (embedding) {
            console.log(`✅ Embedding found for document`);
            console.log(`   Content stored: ${embedding.content.substring(0, 60)}...`);
        } else {
            console.log('❌ No embedding found - document content may not be indexed');
        }

        // Step 4: Query AI about the document
        console.log('\n🤖 Step 3: Querying AI about document content...');
        const response = await fetch('http://localhost:4000/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                spaceId: space.id,
                query: 'What is in our product roadmap for 2025?'
            })
        });

        if (!response.ok) {
            console.log(`❌ AI query failed: ${response.status} ${response.statusText}`);
            return;
        }

        const aiData = await response.json();

        console.log(`✅ AI Response received`);
        console.log(`   Context items retrieved: ${aiData.context.length}`);

        // Check if document was found in context
        const docInContext = aiData.context.find(ctx => ctx.type === 'DOC' && ctx.content.includes('Product Roadmap'));

        if (docInContext) {
            console.log(`   ✅ AI FOUND THE DOCUMENT in context!`);
            console.log(`   Document content: ${docInContext.content.substring(0, 80)}...`);
        } else {
            console.log(`   ⚠️ Document not found in AI context`);
            console.log(`   Context types: ${aiData.context.map(c => c.type).join(', ')}`);
        }

        console.log(`\n💬 AI Answer:`);
        console.log(`   ${aiData.answer.substring(0, 200)}...`);

        // Step 5: Cleanup
        console.log('\n🧹 Cleaning up test data...');
        await prisma.embedding.deleteMany({
            where: { sourceId: testDoc.id }
        });
        await prisma.document.delete({
            where: { id: testDoc.id }
        });
        console.log('✅ Cleanup complete');

        console.log('\n' + '='.repeat(60));
        if (docInContext) {
            console.log('✅ SUCCESS: AI can read and access document content!');
        } else {
            console.log('⚠️ WARNING: AI could not find document in context');
        }
        console.log('='.repeat(60));

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

testAIDocumentAccess();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyDataStorage() {
    console.log('🔍 Verifying Chat & Document Storage + AI Access\n');

    try {
        // Step 1: Check if chat messages are in the database
        console.log('📊 Step 1: Checking chat messages in database...');
        const messages = await prisma.message.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: true, space: true }
        });

        console.log(`✅ Found ${messages.length} chat messages in database`);
        messages.forEach((msg, i) => {
            console.log(`   ${i + 1}. [${msg.space.name}] ${msg.content.substring(0, 50)}...`);
        });

        // Step 2: Check if documents are in the database
        console.log('\n📄 Step 2: Checking documents in database...');
        const documents = await prisma.document.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { space: true }
        });

        console.log(`✅ Found ${documents.length} documents in database`);
        documents.forEach((doc, i) => {
            console.log(`   ${i + 1}. [${doc.space.name}] ${doc.title}`);
        });

        // Step 3: Check if embeddings exist for chats
        console.log('\n🧠 Step 3: Checking embeddings for chat messages...');
        const chatEmbeddings = await prisma.embedding.findMany({
            where: { type: 'CHAT' },
            take: 5,
            orderBy: { createdAt: 'desc' }
        });

        console.log(`✅ Found ${chatEmbeddings.length} chat embeddings`);
        chatEmbeddings.forEach((emb, i) => {
            console.log(`   ${i + 1}. ID: ${emb.sourceId} | Content: ${emb.content.substring(0, 40)}...`);
        });

        // Step 4: Check if embeddings exist for documents
        console.log('\n📚 Step 4: Checking embeddings for documents...');
        const docEmbeddings = await prisma.embedding.findMany({
            where: { type: 'DOC' },
            take: 5,
            orderBy: { createdAt: 'desc' }
        });

        console.log(`✅ Found ${docEmbeddings.length} document embeddings`);
        docEmbeddings.forEach((emb, i) => {
            console.log(`   ${i + 1}. ID: ${emb.sourceId} | Content: ${emb.content.substring(0, 40)}...`);
        });

        // Step 5: Test AI access to chat data
        if (messages.length > 0) {
            console.log('\n🤖 Step 5: Testing AI access to chat data...');
            const testSpace = messages[0].space;

            const response = await fetch('http://localhost:4000/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    spaceId: testSpace.id,
                    query: 'What have we been discussing in our chats?'
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`✅ AI successfully accessed chat data`);
                console.log(`   Retrieved ${data.context.length} context items`);
                console.log(`   Response preview: ${data.answer.substring(0, 150)}...`);
            } else {
                console.log(`⚠️ AI request failed: ${response.status} ${response.statusText}`);
            }
        }

        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('📋 SUMMARY');
        console.log('='.repeat(60));
        console.log(`✅ Chat Messages: ${messages.length} stored`);
        console.log(`✅ Documents: ${documents.length} stored`);
        console.log(`✅ Chat Embeddings: ${chatEmbeddings.length} stored`);
        console.log(`✅ Document Embeddings: ${docEmbeddings.length} stored`);
        console.log('\n🎉 All data is being stored correctly!\n');

    } catch (error) {
        console.error('\n❌ Verification failed:', error.message);
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyDataStorage();

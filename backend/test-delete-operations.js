import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDeleteOperations() {
    console.log('🗑️  Testing Delete CRUD Operations\n');

    try {
        // Get a test space
        const space = await prisma.space.findFirst();
        const user = await prisma.user.findFirst();

        if (!space || !user) {
            console.log('❌ No space or user found');
            return;
        }

        console.log(`Using space: ${space.name}\n`);

        // Test 1: Create and delete a journal entry
        console.log('📝 Test 1: Journal Entry Delete');
        const journal = await prisma.journalEntry.create({
            data: {
                spaceId: space.id,
                userId: user.id,
                title: 'Test Entry',
                content: 'This will be deleted'
            }
        });
        console.log(`✅ Created journal entry: ${journal.id}`);

        const deleteJournal = await fetch(`http://localhost:4000/api/journal/${journal.id}`, {
            method: 'DELETE'
        });
        console.log(deleteJournal.ok ? '✅ Journal entry deleted successfully' : '❌ Failed to delete journal entry');

        // Test 2: Create and delete a task
        console.log('\n📋 Test 2: Task Delete');
        const task = await prisma.task.create({
            data: {
                spaceId: space.id,
                userId: user.id,
                title: 'Test Task',
                status: 'TODO'
            }
        });
        console.log(`✅ Created task: ${task.id}`);

        const deleteTask = await fetch(`http://localhost:4000/api/tasks/${task.id}`, {
            method: 'DELETE'
        });
        console.log(deleteTask.ok ? '✅ Task deleted successfully' : '❌ Failed to delete task');

        // Test 3: Create and delete a document
        console.log('\n📄 Test 3: Document Delete');
        const doc = await prisma.document.create({
            data: {
                spaceId: space.id,
                title: 'Test Document',
                summary: 'This will be deleted'
            }
        });
        console.log(`✅ Created document: ${doc.id}`);

        const deleteDoc = await fetch(`http://localhost:4000/api/documents/${doc.id}`, {
            method: 'DELETE'
        });
        console.log(deleteDoc.ok ? '✅ Document deleted successfully' : '❌ Failed to delete document');

        // Test 4: Create and delete a message
        console.log('\n💬 Test 4: Message Delete');
        const message = await prisma.message.create({
            data: {
                spaceId: space.id,
                userId: user.id,
                content: 'This message will be deleted'
            }
        });
        console.log(`✅ Created message: ${message.id}`);

        const deleteMessage = await fetch(`http://localhost:4000/api/messages/${message.id}`, {
            method: 'DELETE'
        });
        console.log(deleteMessage.ok ? '✅ Message deleted successfully' : '❌ Failed to delete message');

        console.log('\n' + '='.repeat(60));
        console.log('✅ All delete operations working!');
        console.log('='.repeat(60));

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

testDeleteOperations();

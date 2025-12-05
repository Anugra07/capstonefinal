import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Create a new space
router.post('/', async (req, res) => {
    const { name, description, problemStatement, userId, isPublic = true } = req.body;
    try {
        const space = await prisma.space.create({
            data: {
                name,
                description,
                problemStatement,
                isPublic,
                members: {
                    create: {
                        userId,
                        role: 'OWNER'
                    }
                }
            }
        });
        res.json(space);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Join a space
router.post('/join', async (req, res) => {
    const { inviteToken, userId } = req.body;
    
    if (!inviteToken) {
        return res.status(400).json({ error: 'Invite token is required' });
    }
    
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const space = await prisma.space.findUnique({
            where: { inviteToken }
        });

        if (!space) {
            return res.status(404).json({ error: 'Space not found. Invalid invite code.' });
        }

        // Check if user is already a member
        const existingMember = await prisma.spaceMember.findUnique({
            where: {
                userId_spaceId: {
                    userId,
                    spaceId: space.id
                }
            }
        });

        if (existingMember) {
            return res.json({ 
                space, 
                member: existingMember,
                message: 'You are already a member of this space'
            });
        }

        const member = await prisma.spaceMember.create({
            data: {
                userId,
                spaceId: space.id,
                role: 'MEMBER'
            }
        });

        res.json({ space, member });
    } catch (error) {
        console.error('Error joining space:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all public spaces (for browsing)
router.get('/', async (req, res) => {
    try {
        const spaces = await prisma.space.findMany({
            where: { isPublic: true },
            include: {
                members: {
                    include: { user: { select: { id: true, name: true, email: true } } },
                    take: 5
                },
                _count: {
                    select: { members: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(spaces);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get space details
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const space = await prisma.space.findUnique({
            where: { id },
            include: {
                members: { include: { user: true } },
                journalEntries: { take: 5, orderBy: { createdAt: 'desc' } },
                tasks: true,
                documents: true
            }
        });
        res.json(space);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create join request
router.post('/:spaceId/request', async (req, res) => {
    const { spaceId } = req.params;
    const { userId, reason } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        // Check if user is already a member
        const existingMember = await prisma.spaceMember.findUnique({
            where: {
                userId_spaceId: {
                    userId,
                    spaceId
                }
            }
        });

        if (existingMember) {
            return res.status(400).json({ error: 'You are already a member of this space' });
        }

        // Check if there's already a pending request
        const existingRequest = await prisma.spaceJoinRequest.findUnique({
            where: {
                userId_spaceId: {
                    userId,
                    spaceId
                }
            }
        });

        if (existingRequest && existingRequest.status === 'PENDING') {
            return res.status(400).json({ error: 'You already have a pending request for this space' });
        }

        // Create new request
        const request = await prisma.spaceJoinRequest.create({
            data: {
                userId,
                spaceId,
                reason: reason || null
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                space: { select: { id: true, name: true } }
            }
        });

        // Notify space admins/owners
        const admins = await prisma.spaceMember.findMany({
            where: {
                spaceId,
                role: { in: ['OWNER', 'ADMIN'] }
            },
            include: { user: true }
        });

        for (const admin of admins) {
            await prisma.notification.create({
                data: {
                    userId: admin.userId,
                    type: 'JOIN_REQUEST_RECEIVED',
                    title: 'New Join Request',
                    message: `${request.user.name || request.user.email} wants to join "${request.space.name}"`,
                    spaceId,
                    requestId: request.id
                }
            });
        }

        res.json(request);
    } catch (error) {
        console.error('Error creating join request:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get join requests for a space (admin only)
router.get('/:spaceId/requests', async (req, res) => {
    const { spaceId } = req.params;
    const { userId } = req.query; // User making the request

    try {
        // Verify user is admin/owner
        const member = await prisma.spaceMember.findUnique({
            where: {
                userId_spaceId: {
                    userId,
                    spaceId
                }
            }
        });

        if (!member || !['OWNER', 'ADMIN'].includes(member.role)) {
            return res.status(403).json({ error: 'Only admins and owners can view join requests' });
        }

        const requests = await prisma.spaceJoinRequest.findMany({
            where: { spaceId },
            include: {
                user: { select: { id: true, name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Approve join request
router.post('/requests/:requestId/approve', async (req, res) => {
    const { requestId } = req.params;
    const { userId } = req.body; // Admin/owner approving

    try {
        const request = await prisma.spaceJoinRequest.findUnique({
            where: { id: requestId },
            include: { space: true }
        });

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Verify user is admin/owner
        const member = await prisma.spaceMember.findUnique({
            where: {
                userId_spaceId: {
                    userId,
                    spaceId: request.spaceId
                }
            }
        });

        if (!member || !['OWNER', 'ADMIN'].includes(member.role)) {
            return res.status(403).json({ error: 'Only admins and owners can approve requests' });
        }

        // Update request status
        const updatedRequest = await prisma.spaceJoinRequest.update({
            where: { id: requestId },
            data: {
                status: 'APPROVED',
                reviewedBy: userId,
                reviewedAt: new Date()
            }
        });

        // Add user to space
        await prisma.spaceMember.create({
            data: {
                userId: request.userId,
                spaceId: request.spaceId,
                role: 'MEMBER'
            }
        });

        // Notify the user
        await prisma.notification.create({
            data: {
                userId: request.userId,
                type: 'JOIN_REQUEST_APPROVED',
                title: 'Join Request Approved',
                message: `Your request to join "${request.space.name}" has been approved!`,
                spaceId: request.spaceId,
                requestId: request.id
            }
        });

        res.json({ message: 'Request approved', request: updatedRequest });
    } catch (error) {
        console.error('Error approving request:', error);
        res.status(500).json({ error: error.message });
    }
});

// Reject join request
router.post('/requests/:requestId/reject', async (req, res) => {
    const { requestId } = req.params;
    const { userId } = req.body; // Admin/owner rejecting

    try {
        const request = await prisma.spaceJoinRequest.findUnique({
            where: { id: requestId },
            include: { space: true }
        });

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Verify user is admin/owner
        const member = await prisma.spaceMember.findUnique({
            where: {
                userId_spaceId: {
                    userId,
                    spaceId: request.spaceId
                }
            }
        });

        if (!member || !['OWNER', 'ADMIN'].includes(member.role)) {
            return res.status(403).json({ error: 'Only admins and owners can reject requests' });
        }

        // Update request status
        const updatedRequest = await prisma.spaceJoinRequest.update({
            where: { id: requestId },
            data: {
                status: 'REJECTED',
                reviewedBy: userId,
                reviewedAt: new Date()
            }
        });

        // Notify the user
        await prisma.notification.create({
            data: {
                userId: request.userId,
                type: 'JOIN_REQUEST_REJECTED',
                title: 'Join Request Rejected',
                message: `Your request to join "${request.space.name}" has been rejected.`,
                spaceId: request.spaceId,
                requestId: request.id
            }
        });

        res.json({ message: 'Request rejected', request: updatedRequest });
    } catch (error) {
        console.error('Error rejecting request:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;

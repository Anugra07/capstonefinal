import React from 'react';

// Base skeleton component
export const Skeleton = ({ className = '', width, height }) => (
    <div
        className={`animate-pulse bg-gray-200 rounded ${className}`}
        style={{ width, height }}
    />
);

// Card skeleton
export const SkeletonCard = () => (
    <div className="card-flat space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
    </div>
);

// List item skeleton
export const SkeletonListItem = () => (
    <div className="flex items-center gap-3 p-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
        </div>
    </div>
);

// Table row skeleton
export const SkeletonTableRow = ({ columns = 4 }) => (
    <tr>
        {Array.from({ length: columns }).map((_, i) => (
            <td key={i} className="px-4 py-3">
                <Skeleton className="h-4 w-full" />
            </td>
        ))}
    </tr>
);

// Message skeleton (for chat)
export const SkeletonMessage = ({ align = 'left' }) => (
    <div className={`flex ${align === 'right' ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[70%] space-y-2 ${align === 'right' ? 'items-end' : 'items-start'}`}>
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-16 w-64 rounded-2xl" />
        </div>
    </div>
);

// Stats card skeleton
export const SkeletonStatCard = () => (
    <div className="card-flat">
        <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="w-8 h-8 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-16 mb-1" />
        <Skeleton className="h-3 w-32" />
    </div>
);

// Journal entry skeleton
export const SkeletonJournalEntry = () => (
    <div className="card-flat space-y-3">
        <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="w-6 h-6 rounded" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
    </div>
);

// Task card skeleton
export const SkeletonTaskCard = () => (
    <div className="card-flat space-y-2">
        <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16 rounded-full" />
            <Skeleton className="w-4 h-4" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-3/4" />
    </div>
);

// Document card skeleton
export const SkeletonDocumentCard = () => (
    <div className="card-flat">
        <div className="flex items-start gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
            </div>
        </div>
    </div>
);

// Page skeleton for loading states
export const SkeletonPage = () => (
    <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-4 w-96 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
            </div>
        </div>
    </div>
);

// Chat message skeleton
export const SkeletonChatMessage = () => (
    <div className="flex justify-start mb-4">
        <div className="max-w-[70%] space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-16 w-64 rounded-2xl" />
        </div>
    </div>
);

// Team member skeleton
export const SkeletonTeamMember = () => (
    <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
        <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
            </div>
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
    </div>
);

export default Skeleton;

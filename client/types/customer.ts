import { BaseEntity, SoftDeletableEntity } from './common';
import { LoyaltyTransactionType, MembershipTier } from './enums';

export interface Customer extends SoftDeletableEntity {
    phoneNumber: string;
    fullName: string;
    rewardPoints: number;
    membershipTier: MembershipTier;
}

export interface LoyaltyTransaction extends BaseEntity {
    customerId: number;
    orderId?: number | null;
    orderCode?: string | null;
    transactionType: LoyaltyTransactionType;
    points: number;
    balanceAfter: number;
    description?: string | null;
}

// DTO phản hồi từ View v_CustomerLoyaltySummary
export interface CustomerSummaryView {
    customerId: number;
    fullName: string;
    phoneNumber: string;
    membershipTier: MembershipTier;
    currentRewardPoints: number;
    totalPointsEarned: number;
    totalPointsRedeemed: number;
}
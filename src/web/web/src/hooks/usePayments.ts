import { useState } from 'react';

export interface Payment {
    id: string;
    amount: number;
    currency: string;
    status: 'pending' | 'approved' | 'declined' | 'refunded';
    method: string;
    date: string;
    description: string;
}

export interface PaymentReceipt {
    transactionId: string;
    date: string;
    time: string;
    status: string;
    method: string;
    amount: string;
    doctor: string;
    service: string;
    duration: string;
    insurancePlan: string;
    insuranceCoverage: string;
}

/** Shape returned by the usePayments hook */
export interface UsePaymentsReturn {
    payments: Payment[];
    isLoading: boolean;
    error: Error | null;
    processPayment: (amount: number, method: string) => Promise<void>;
    getPaymentHistory: () => Promise<void>;
    getReceipt: (paymentId: string) => PaymentReceipt | null;
}

/**
 * Hook for managing payment data and actions
 * for the 2 payment pages in the Care Now journey.
 */
export const usePayments = (): UsePaymentsReturn => {
    const [payments] = useState<Payment[]>([]);
    const [isLoading] = useState(false);
    const [error] = useState<Error | null>(null);

    const processPayment = async (_amount: number, _method: string): Promise<void> => {};
    const getPaymentHistory = async (): Promise<void> => {};
    const getReceipt = (_paymentId: string): PaymentReceipt | null => null;

    return {
        payments,
        isLoading,
        error,
        processPayment,
        getPaymentHistory,
        getReceipt,
    };
};

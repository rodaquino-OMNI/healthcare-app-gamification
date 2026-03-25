import { useState, useCallback } from 'react';

import { restClient } from '@/api/client';

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
    const [payments, setPayments] = useState<Payment[]>([]);
    const [receipts, setReceipts] = useState<Record<string, PaymentReceipt>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const processPayment = useCallback(async (amount: number, method: string): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await restClient.post<Payment>('/api/plan/payments', { amount, method });
            setPayments((prev) => [response.data, ...prev]);
        } catch (err: unknown) {
            setError(err instanceof Error ? err : new Error('Erro ao processar pagamento.'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getPaymentHistory = useCallback(async (): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await restClient.get<Payment[]>('/api/plan/payments');
            setPayments(response.data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err : new Error('Erro ao carregar histórico de pagamentos.'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getReceipt = useCallback(
        (paymentId: string): PaymentReceipt | null => {
            const cached = receipts[paymentId];
            if (cached) {
                return cached;
            }
            // Fetch in background and update state; return null until available
            void restClient
                .get<PaymentReceipt>(`/api/plan/payments/${paymentId}/receipt`)
                .then((response) => {
                    setReceipts((prev) => ({ ...prev, [paymentId]: response.data }));
                })
                .catch((err: unknown) => {
                    setError(err instanceof Error ? err : new Error('Erro ao carregar recibo.'));
                });
            return null;
        },
        [receipts]
    );

    return {
        payments,
        isLoading,
        error,
        processPayment,
        getPaymentHistory,
        getReceipt,
    };
};

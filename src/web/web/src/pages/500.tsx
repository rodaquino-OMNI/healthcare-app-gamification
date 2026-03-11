import { colors } from 'design-system/tokens/colors';
import type { NextPage } from 'next';
import React from 'react';

import { useAuth } from '@/hooks/useAuth';

const ServerErrorPage: NextPage = () => {
    const { isAuthenticated: _isAuthenticated } = useAuth();
    // Care journey color - used for error pages to signal attention and care
    const careJourneyColor = colors.journeys.care.primary;

    return (
        <div className="error-container">
            <div className="error-content">
                <div className="error-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                            stroke={careJourneyColor}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M12 8V12"
                            stroke={careJourneyColor}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M12 16H12.01"
                            stroke={careJourneyColor}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
                <h1>Encontramos um problema</h1>
                <p>Desculpe pelo inconveniente. Nosso servidor encontrou um erro inesperado.</p>
                <p>Nossa equipe técnica foi notificada e estamos trabalhando para resolver o problema.</p>
                <div className="error-actions">
                    <button onClick={() => (window.location.href = '/')} className="primary-button">
                        Voltar para a página inicial
                    </button>
                    <button onClick={() => window.location.reload()} className="secondary-button">
                        Tentar novamente
                    </button>
                </div>
            </div>
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                .error-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    padding: 16px;
                    background-color: ${colors.journeys.care.background};
                }
                .error-content {
                    max-width: 600px;
                    padding: 24px;
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    border-left: 4px solid ${careJourneyColor};
                    text-align: center;
                }
                .error-icon {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 16px;
                }
                .error-container h1 {
                    color: ${colors.neutral.gray900};
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 16px;
                }
                .error-container p {
                    color: ${colors.gray[50]};
                    margin-bottom: 8px;
                    font-size: 16px;
                    line-height: 1.5;
                }
                .error-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-top: 24px;
                }
                .primary-button {
                    background-color: ${careJourneyColor};
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                .primary-button:hover {
                    background-color: ${colors.journeys.care.secondary};
                }
                .secondary-button {
                    background-color: transparent;
                    color: ${careJourneyColor};
                    border: 1px solid ${careJourneyColor};
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                .secondary-button:hover {
                    background-color: rgba(255, 140, 66, 0.1);
                }
                @media (min-width: 768px) {
                    .error-actions {
                        flex-direction: row;
                        justify-content: center;
                        gap: 16px;
                    }
                }
            `,
                }}
            />
        </div>
    );
};

export default ServerErrorPage;

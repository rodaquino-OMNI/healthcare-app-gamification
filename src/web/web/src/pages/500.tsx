import { colors } from 'design-system/tokens/colors';
import type { NextPage } from 'next';
import Image from 'next/image';
import React from 'react';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line @typescript-eslint/no-var-requires -- static PNG asset
const errorIllustration = require('@austa/design-system/assets/illustrations/error-utility/error-utility-02.png');

const ServerErrorPage: NextPage = () => {
    const { t: _t } = useTranslation();
    // Care journey color - used for error pages to signal attention and care
    const careJourneyColor = colors.journeys.care.primary;

    return (
        <div className="error-container">
            <div className="error-content">
                <div className="error-icon">
                    <Image src={errorIllustration} alt="Server error illustration" width={300} height={300} />
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
            {/* eslint-disable-next-line react/no-unknown-property -- styled-jsx uses the jsx prop on style tags, not a standard HTML attribute */}
            <style jsx>{`
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
            `}</style>
        </div>
    );
};

export default ServerErrorPage;

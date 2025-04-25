import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MOBILE_PLAN_ROUTES } from 'src/web/shared/constants/routes';
import Input from 'src/web/design-system/src/components/Input/Input';
import { Select } from 'src/web/design-system/src/components/Select/Select';
import Button from 'src/web/design-system/src/components/Button/Button';
import Card from 'src/web/design-system/src/components/Card/Card';

/**
 * A screen component that allows users to simulate healthcare costs 
 * based on insurance coverage within the Plan journey.
 */
export const CostSimulatorScreen: React.FC = () => {
  // State for input fields and result
  const [procedureType, setProcedureType] = useState('');
  const [provider, setProvider] = useState('');
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  
  // Procedure type options for the dropdown
  const procedureOptions = [
    { label: 'Consulta médica', value: 'consultation' },
    { label: 'Exame laboratorial', value: 'labTest' },
    { label: 'Exame de imagem', value: 'imaging' },
    { label: 'Cirurgia', value: 'surgery' },
    { label: 'Fisioterapia', value: 'physicalTherapy' },
  ];
  
  /**
   * Simulates the cost based on procedure type and provider.
   * In a real implementation, this would call an API to get accurate estimates.
   */
  const handleSimulateCost = () => {
    // Basic validation
    if (!procedureType || !provider) {
      alert('Por favor, preencha todos os campos');
      return;
    }
    
    // This is a simplified mock implementation
    // In a real app, we would call the backend API to calculate the actual cost
    let baseCost = 0;
    
    switch (procedureType) {
      case 'consultation':
        baseCost = 150;
        break;
      case 'labTest':
        baseCost = 200;
        break;
      case 'imaging':
        baseCost = 500;
        break;
      case 'surgery':
        baseCost = 3000;
        break;
      case 'physicalTherapy':
        baseCost = 100;
        break;
      default:
        baseCost = 0;
    }
    
    // Mock coverage calculation (80% coverage)
    const coverage = 0.8;
    const outOfPocket = baseCost * (1 - coverage);
    
    // Round to 2 decimal places
    setEstimatedCost(Math.round(outOfPocket * 100) / 100);
  };
  
  return (
    <div>
      <h1>Simulador de Custos</h1>
      <p>Simule quanto custará seu procedimento com base na sua cobertura</p>
      
      <Card journey="plan">
        <div style={{ marginBottom: '16px' }}>
          <Select
            label="Tipo de Procedimento"
            options={procedureOptions}
            value={procedureType}
            onChange={(value) => setProcedureType(value as string)}
            journey="plan"
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="provider" style={{ display: 'block', marginBottom: '8px' }}>
            Nome do Profissional ou Clínica
          </label>
          <Input
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            placeholder="Digite o nome do profissional ou clínica"
            journey="plan"
          />
        </div>
        
        <Button 
          onPress={handleSimulateCost}
          journey="plan"
        >
          Simular Custo
        </Button>
        
        {estimatedCost !== null && (
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <h2>Custo Estimado</h2>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3A86FF' }}>
              R$ {estimatedCost.toFixed(2)}
            </p>
            <p>
              Este é o valor estimado que você pagará após a cobertura do seu plano.
            </p>
            <p style={{ fontSize: '14px', color: '#757575', marginTop: '8px' }}>
              Cobertura aplicada: 80%
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
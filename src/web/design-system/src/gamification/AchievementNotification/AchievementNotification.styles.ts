import styled from 'styled-components'; // version 6.1.8

export const NotificationContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  text-align: center;
`;

export const NotificationContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const NotificationTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
`;

export const NotificationMessage = styled.p`
  font-size: 16px;
  color: #666;
`;
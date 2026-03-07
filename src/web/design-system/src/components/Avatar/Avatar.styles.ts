import styled from 'styled-components'; // styled-components@6.1.8

export const AvatarContainer = styled.div<{ size?: string }>`
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${(props) => props.size || '40px'};
    height: ${(props) => props.size || '40px'};
    border-radius: 50%;
    background-color: ${(props) => props.theme.colors.neutral.gray300};
    overflow: hidden;
`;

export const AvatarImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

export const AvatarFallback = styled.span<{ size?: string }>`
    font-size: ${(props) => (props.size ? `calc(${props.size} / 3)` : '1rem')};
    font-weight: 500;
    color: ${(props) => props.theme.colors.neutral.gray700};
`;

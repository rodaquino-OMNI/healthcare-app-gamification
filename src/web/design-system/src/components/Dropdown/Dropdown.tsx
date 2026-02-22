import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';
import { shadows } from '../../tokens/shadows';
import { borderRadius } from '../../tokens/borderRadius';

export interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  searchable?: boolean;
  disabled?: boolean;
  journey?: 'health' | 'care' | 'plan';
  accessibilityLabel?: string;
}

const getJourneyColor = (journey?: string) => {
  if (journey && colors.journeys[journey as keyof typeof colors.journeys]) {
    return colors.journeys[journey as keyof typeof colors.journeys].primary;
  }
  return colors.brand.primary;
};

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownTrigger = styled.button<{ isOpen: boolean; disabled?: boolean; journey?: string }>`
  width: 100%;
  padding: ${spacing.sm} ${spacing.md};
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize.md};
  color: ${colors.neutral.gray900};
  background-color: ${props => props.disabled ? colors.neutral.gray100 : colors.neutral.white};
  border: 1px solid ${props => props.isOpen ? getJourneyColor(props.journey) : colors.neutral.gray300};
  border-radius: ${borderRadius.md};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  opacity: ${props => props.disabled ? 0.6 : 1};
  transition: border-color 0.2s ease-in-out;

  &:focus-visible {
    outline: none;
    border-color: ${props => getJourneyColor(props.journey)};
    box-shadow: 0 0 0 2px ${props => getJourneyColor(props.journey)}40;
  }
`;

const Placeholder = styled.span`
  color: ${colors.neutral.gray500};
`;

const Arrow = styled.span<{ isOpen: boolean }>`
  font-size: ${typography.fontSize.xs};
  color: ${colors.neutral.gray500};
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform 0.2s ease-in-out;
`;

const DropdownMenu = styled.ul`
  position: absolute;
  top: calc(100% + ${spacing['3xs']});
  left: 0;
  right: 0;
  max-height: 240px;
  overflow-y: auto;
  background-color: ${colors.neutral.white};
  border: 1px solid ${colors.neutral.gray300};
  border-radius: ${borderRadius.md};
  box-shadow: ${shadows.md};
  list-style: none;
  padding: ${spacing['3xs']} 0;
  margin: 0;
  z-index: 50;
`;

const SearchInput = styled.input`
  width: calc(100% - ${spacing.md} * 2);
  margin: ${spacing.xs} ${spacing.md};
  padding: ${spacing.xs} ${spacing.sm};
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize.sm};
  border: 1px solid ${colors.neutral.gray300};
  border-radius: ${borderRadius.sm};
  outline: none;

  &:focus {
    border-color: ${colors.brand.primary};
  }
`;

const DropdownItem = styled.li<{ isSelected: boolean; disabled?: boolean; journey?: string }>`
  padding: ${spacing.sm} ${spacing.md};
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize.md};
  color: ${props => props.disabled ? colors.neutral.gray500 : colors.neutral.gray900};
  background-color: ${props => props.isSelected ? `${getJourneyColor(props.journey)}10` : 'transparent'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover {
    background-color: ${props => !props.disabled ? colors.neutral.gray100 : 'transparent'};
  }
`;

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  placeholder = 'Select an option',
  onChange,
  searchable = false,
  disabled = false,
  journey,
  accessibilityLabel = 'Dropdown',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = searchable && searchQuery
    ? options.filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: DropdownOption) => {
    if (option.disabled) return;
    onChange?.(option.value);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <DropdownContainer ref={containerRef} data-testid="dropdown">
      <DropdownTrigger
        isOpen={isOpen}
        disabled={disabled}
        journey={journey}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        aria-label={accessibilityLabel}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        data-testid="dropdown-trigger"
      >
        {selectedOption ? (
          <span>{selectedOption.label}</span>
        ) : (
          <Placeholder>{placeholder}</Placeholder>
        )}
        <Arrow isOpen={isOpen} aria-hidden="true">&#9660;</Arrow>
      </DropdownTrigger>
      {isOpen && (
        <DropdownMenu role="listbox" data-testid="dropdown-menu">
          {searchable && (
            <SearchInput
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              autoFocus
              aria-label="Search options"
              data-testid="dropdown-search"
            />
          )}
          {filteredOptions.map((option) => (
            <DropdownItem
              key={option.value}
              isSelected={option.value === value}
              disabled={option.disabled}
              journey={journey}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={option.value === value}
              data-testid={`dropdown-option-${option.value}`}
            >
              {option.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
};

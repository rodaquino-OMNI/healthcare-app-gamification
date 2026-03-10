/* eslint-disable @typescript-eslint/no-empty-interface */

// Augment the jest global namespace Matchers (for global jest usage)
declare namespace jest {
  interface Matchers<R, T = {}> {
    toBeInTheDocument(): R;
    toBeVisible(): R;
    toBeEmpty(): R;
    toBeEmptyDOMElement(): R;
    toBeDisabled(): R;
    toBeEnabled(): R;
    toBeInvalid(): R;
    toBeRequired(): R;
    toBeValid(): R;
    toHaveAttribute(attr: string, value?: unknown): R;
    toHaveClass(...classNames: string[]): R;
    toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): R;
    toHaveFocus(): R;
    toHaveFormValues(expectedValues: Record<string, unknown>): R;
    toHaveStyle(css: string | Record<string, unknown>): R;
    toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): R;
    toHaveValue(value?: string | string[] | number | null): R;
    toBeChecked(): R;
    toBePartiallyChecked(): R;
    toHaveDescription(text?: string | RegExp): R;
    toHaveAccessibleDescription(text?: string | RegExp): R;
    toHaveAccessibleErrorMessage(text?: string | RegExp): R;
    toHaveAccessibleName(text?: string | RegExp): R;
    toHaveErrorMessage(text?: string | RegExp): R;
    toContainElement(element: HTMLElement | SVGElement | null): R;
    toContainHTML(htmlText: string): R;
    toHaveRole(role: string): R;
    toHaveProp(prop: string, value?: unknown): R;
  }
}

// Augment the expect module Matchers (for @jest/globals import usage)
declare module "expect" {
  interface Matchers<R extends void | Promise<void>, T = unknown> {
    toBeInTheDocument(): R;
    toBeVisible(): R;
    toBeEmpty(): R;
    toBeEmptyDOMElement(): R;
    toBeDisabled(): R;
    toBeEnabled(): R;
    toBeInvalid(): R;
    toBeRequired(): R;
    toBeValid(): R;
    toHaveAttribute(attr: string, value?: unknown): R;
    toHaveClass(...classNames: string[]): R;
    toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): R;
    toHaveFocus(): R;
    toHaveFormValues(expectedValues: Record<string, unknown>): R;
    toHaveStyle(css: string | Record<string, unknown>): R;
    toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): R;
    toHaveValue(value?: string | string[] | number | null): R;
    toBeChecked(): R;
    toBePartiallyChecked(): R;
    toHaveDescription(text?: string | RegExp): R;
    toHaveAccessibleDescription(text?: string | RegExp): R;
    toHaveAccessibleErrorMessage(text?: string | RegExp): R;
    toHaveAccessibleName(text?: string | RegExp): R;
    toHaveErrorMessage(text?: string | RegExp): R;
    toContainElement(element: HTMLElement | SVGElement | null): R;
    toContainHTML(htmlText: string): R;
    toHaveRole(role: string): R;
    toHaveProp(prop: string, value?: unknown): R;
  }
}

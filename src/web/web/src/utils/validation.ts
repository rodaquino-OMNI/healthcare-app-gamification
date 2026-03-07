/**
 * Validates a Brazilian CPF (Cadastro de Pessoas Físicas) number.
 *
 * @param cpf - The CPF string to validate
 * @returns True if the CPF is valid, false otherwise
 */
export function validateCPF(cpf: string): boolean {
    // Remove non-digit characters
    const cleanCpf = cpf.replace(/\D/g, '');

    // Check if it has 11 digits
    if (cleanCpf.length !== 11) {
        return false;
    }

    // Check if all digits are the same (invalid CPF)
    if (/^(\d)\1{10}$/.test(cleanCpf)) {
        return false;
    }

    // Calculate first verification digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
    }

    let remainder = sum % 11;
    const digit1 = remainder < 2 ? 0 : 11 - remainder;

    // Calculate second verification digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
    }

    remainder = sum % 11;
    const digit2 = remainder < 2 ? 0 : 11 - remainder;

    // Check if calculated verification digits match the CPF's verification digits
    return parseInt(cleanCpf.charAt(9)) === digit1 && parseInt(cleanCpf.charAt(10)) === digit2;
}

/**
 * Validates an email address format.
 *
 * @param email - The email address to validate
 * @returns True if the email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
    // Regular expression for email validation
    // This pattern checks for standard email format with proper domain structure
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailRegex.test(email);
}

/**
 * Checks if a password meets strength criteria:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 *
 * @param password - The password to check
 * @returns True if the password meets all criteria, false otherwise
 */
export function isStrongPassword(password: string): boolean {
    // Check minimum length
    if (password.length < 8) {
        return false;
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
        return false;
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
        return false;
    }

    // Check for at least one number
    if (!/[0-9]/.test(password)) {
        return false;
    }

    // Check for at least one special character
    if (!/[^A-Za-z0-9]/.test(password)) {
        return false;
    }

    return true;
}

/**
 * An object of functions for checking whether simple conditions are met.
 *
 * @since 0.4.0
 */
const operatorFunctions = {
    '=': (a, b) => a == b,
    '!=': (a, b) => a != b,
    '>': (a, b) => a > b,
    '>=': (a, b) => a >= b,
    '<': (a, b) => a < b,
    '<=': (a, b) => a <= b,
    contains: (a, b) => String(a).includes(b),
    not_contains: (a, b) => !String(a).includes(b),
};

export default operatorFunctions;

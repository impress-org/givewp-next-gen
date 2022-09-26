import {isFieldNameUnique, getFieldNameSuggestion} from "./useFieldNames";

it('is validates a field name as unique', () => {
    expect(
        isFieldNameUnique('text-field-1', [])
    ).toBeTruthy();
});

it('is fails validation for a field name that is already used', () => {
    expect(
        isFieldNameUnique('text-field-1', [
            'text-field-1',
        ])
    ).toBeFalsy();
});

it('suggests a name to be unique', () => {
    expect(
        getFieldNameSuggestion('text-field', [
            'text-field'
        ])
    ).toBe('text-field-1')

    expect(
        getFieldNameSuggestion('text-field', [
            'text-field',
            'text-field-1'
        ])
    ).toBe('text-field-2')

    expect(
        getFieldNameSuggestion('text-field', [
            'text-field',
            'text-field-2'
        ])
    ).toBe('text-field-3')
});

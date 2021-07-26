import {
    FORM_ADVANCED_CONSTRAINTS,
    FORM_CONSTRAINTS,
    FORM_TYPE_CONSTRAINTS
} from '../constants/form.const';

export const metadataToRulesMap = (metadatas) => {
    return metadatas.reduce((rulesMap, metadata) => {
        const {
            key,
            valueType
        } = metadata;

        if (!!metadata.constraints) {
            const {
                rules,
                specialRules,
                specialFieldsMap
            } = metadata.constraints.reduce((acc, constraint) => {
                if (FORM_CONSTRAINTS[constraint.constraintType]) {
                    const rule = FORM_CONSTRAINTS[constraint.constraintType];

                    // maps simple rules to ant Form.Item format
                    acc.rules = [...acc.rules, {
                        type: valueType,
                        [rule]: constraint.value ? constraint.value : true,
                        message: constraint.level
                    }];
                } else if (FORM_ADVANCED_CONSTRAINTS[constraint.constraintType]) { 
                    /*** special rules like 'multiply' are kept apart,
                    *  to avoid bugs caused by rules not recognized by Form.Item
                    */
                    acc.specialRules = {
                        ...acc.specialRules,
                        constraint: {
                            ...constraint
                        }
                    };

                    /**
                     * Maps fields involved in a calculation (like multiply) in an array
                     * of fields which are involved in a calculation
                     */
                    acc.specialFieldsMap = {
                        ...acc.specialFieldsMap,
                        ...constraint.fields?.reduce((specialFieldsMap, field) => {
                            specialFieldsMap = {
                                ...specialFieldsMap,
                                [field]: [...(specialFieldsMap[field] || []), key]
                            }

                            return specialFieldsMap;
                        }, {})
                    }
                }

                return acc;
            }, {
                rules: [],
                specialRules: {},
                specialFieldsMap: {}
            });

            rulesMap = {
                ...rulesMap,
                [key]: {
                    rules,
                    specialRules
                },
                specialFieldsMap
            };
        } else if (FORM_TYPE_CONSTRAINTS[valueType]) {
            /*** in case a field has no constraints, but does have a special type, like url or email
            * a rule is added to enforce the Form.Item to be on that format by default.
            */

            rulesMap[key] = {
                rules: [{
                    type: valueType, 
                    message: `Field must be in ${valueType} format`
                }]
            }
        }

        return rulesMap;
    }, {});
}

import { Modal, Form } from 'antd';
import { useEffect, useState } from 'react';

import {
    FORM_ADVANCED_CONSTRAINTS,
    FORM_CONSTRAINTS,
    FORM_TYPE_CONSTRAINTS
} from '../constants/form.const';

import DynamicFormItem from './DynamicFormItem';

const TileModal = function (props) {
    const {
        tileMetaData,
        tileData,
        handleOk,
        handleCancel,
        ...restProps
    } = props;

    const [tileForm] = Form.useForm();
    const [formLoaded, setFormLoaded] = useState(false);

    let fieldsRulesMap = _buldFieldRulesMap(tileMetaData);

    // used to set field values only if the form has been loaded at least once
    useEffect(() => {
        tileForm.setFieldsValue(tileData);
        setFormLoaded(true);
    }, []);

    if (formLoaded) tileForm.setFieldsValue(tileData);

    /////////////////
    /////////////////

    const onFieldsChange = onFieldsChangeFn;
    const onAfterClose = onAfterCloseFn;
    const onOk = onOkFn;
    const onCancel = onCancelFn;

    return (
        <Modal title="Tile Modal"
            onOk={onOk}
            onCancel={onCancel}
            afterClose={onAfterClose}
            {...restProps}>

            <Form
                form={tileForm}
                name="tileForm"
                layout="vertical"
                onFieldsChange={onFieldsChange}
                validateTrigger={['onChange']}>

                {
                    (tileMetaData && tileMetaData.map((formItemMetaData) => {
                        const {
                            key,
                            ...restMetaData
                        } = formItemMetaData;

                        return (
                            <div key={key}>
                                <DynamicFormItem
                                    keyId={key}
                                    fieldConstraints={fieldsRulesMap[key]}
                                    {...restMetaData} />
                            </div>
                        )
                    }))
                }
            </Form>
        </Modal>
    )

    ////////////////////
    ////////////////////

    function onFieldsChangeFn(changeData) {
        const changedField = changeData[0]?.name[0];

        const toCalculateFields = fieldsRulesMap.specialFieldsMap[changedField];

        // checks and calculates all the fields that are dependent on the changed field
        if (toCalculateFields?.length > 0) {
            toCalculateFields.forEach((fieldToCalculate) => {
                const calculationRules = fieldsRulesMap[fieldToCalculate].specialRules.constraint;
                const calculation = calculationRules.constraintType;

                let result = _initValue(calculation);

                for (let i = 0; i < calculationRules.fields.length; i++) {
                    const field = calculationRules.fields[i];

                    const fieldValue = tileForm.getFieldValue(field);

                    if (fieldValue) result = _performAction(calculation, result, fieldValue);
                    else {
                        result = undefined;
                        break;
                    }
                }

                tileForm.setFieldsValue({
                    [fieldToCalculate]: result
                });
            });

            function _initValue(calculation) {
                if (calculation === FORM_ADVANCED_CONSTRAINTS.multiply) return 1;
                else if (calculation === FORM_ADVANCED_CONSTRAINTS.add) return 0;
            }
        }

        tileForm.setFieldsValue({
            [changeData.name]: changeData.value
        });
    }

    function onOkFn() {
        tileForm
            .validateFields()
            .then(() => {
                if (_isFormValid()) {
                    handleOk({
                        id: tileData.id,
                        ...tileForm.getFieldsValue()
                    });
                }
        });
    }

    function onCancelFn() {
        tileForm.resetFields();

        handleCancel();
    }

    function onAfterCloseFn() {
        tileForm.resetFields();
    }

    //////////////////////
    //////////////////////

    function _buldFieldRulesMap(metadatas) {
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

    function _isFormInvalid() {
        return tileForm.getFieldsError().some((item) => item.errors.length > 0);
    }

    function _isFormValid() {
        return !_isFormInvalid();
    }

    function _performAction(action, a, b) {
        if (action === FORM_ADVANCED_CONSTRAINTS.multiply) return a * b;
        else if (action === FORM_ADVANCED_CONSTRAINTS.add) return a+b;
    }
}

export default TileModal;

import { Modal, Form } from 'antd';

import {
    FORM_ADVANCED_CONSTRAINTS
} from '../constants/form.const';

import { metadataToRulesMap } from '../utils/metadata.utils';

import DynamicFormItem from './DynamicFormItem';

const DynamicFormModal = function (props) {
    const {
        metadatas,
        data,
        handleOk,
        handleCancel,
        ...restProps
    } = props;

    const [form] = Form.useForm();

    let fieldsRulesMap = metadataToRulesMap(metadatas);

    if (props.visible) form.setFieldsValue(data);

    ///////////////////
    ///////////////////

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
                form={form}
                name="form"
                layout="vertical"
                onFieldsChange={onFieldsChange}
                validateTrigger={['onChange']}>

                {
                    (metadatas && metadatas.map((formItemMetaData) => {
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

        form.setFieldsValue({
            [changeData.name]: changeData.value
        });

        // checks and calculates all the fields that are dependent on the changed field
        _calculateFields(toCalculateFields);
    }

    function onOkFn() {
        form
            .validateFields()
            .then(() => {
                if (_isFormValid()) {
                    handleOk({
                        id: data.id,
                        ...form.getFieldsValue()
                    });
                }
        });
    }

    function onCancelFn() {
        form.resetFields();

        handleCancel();
    }

    function onAfterCloseFn() {
        form.resetFields();
    }

    //////////////////////
    //////////////////////

    function _calculateFields(toCalculateFields) {
        toCalculateFields?.forEach((fieldToCalculate) => {
            const calculationRules = fieldsRulesMap[fieldToCalculate].specialRules.constraint;
            const calcAction = calculationRules.constraintType;

            let result = _initValue(calcAction);

            for (let i = 0; i < calculationRules.fields.length; i++) {
                const field = calculationRules.fields[i];

                const fieldValue = form.getFieldValue(field);

                if (fieldValue) result = _performAction(calcAction, result, fieldValue);
                else {
                    result = undefined;
                    break;
                }
            }

            form.setFieldsValue({
                [fieldToCalculate]: result
            });
        });

        /////////////////////
        /////////////////////

        function _initValue(calculation) {
            if (calculation === FORM_ADVANCED_CONSTRAINTS.multiply) return 1;
            else if (calculation === FORM_ADVANCED_CONSTRAINTS.add) return 0;
        }
    }

    function _isFormInvalid() {
        return form.getFieldsError().some((item) => item.errors.length > 0);
    }

    function _isFormValid() {
        return !_isFormInvalid();
    }

    function _performAction(action, a, b) {
        if (action === FORM_ADVANCED_CONSTRAINTS.multiply) return a * b;
        else if (action === FORM_ADVANCED_CONSTRAINTS.add) return a + b;
    }
}

export default DynamicFormModal;

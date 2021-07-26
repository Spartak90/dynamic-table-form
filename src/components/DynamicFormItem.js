import { Form, Input, InputNumber, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import {FORM_INPUTS} from '../constants/form.const';

const { Option } = Select;

export default function DynamicFormItem (props) {
    const {
        keyId,
        label,
        valueType,
        fieldConstraints,
        options
    } = props;

    const disableField = _isCalculatedField(fieldConstraints);

    return (
        <Form.Item
            name={keyId}
            label={label}
            rules={fieldConstraints?.rules}>
                {
                    _getField(valueType, {
                        options,
                        disableField
                    })
                }
        </Form.Item>
    )

    /////////////////////
    /////////////////////

    function _isCalculatedField(fieldConstraints) {
        return !!fieldConstraints?.specialRules?.constraint;
    }

    function _getField(valueType, config) {
        const { options, disableField } = config;

        switch(valueType) {
            case FORM_INPUTS.STRING: {
                return <Input disabled={disableField} />;
            }

            case FORM_INPUTS.LONG_STRING: {
                return <TextArea disabled={disableField} />
            }

            case FORM_INPUTS.NUMBER: {
                return <InputNumber disabled={disableField} className="form-input-number" />;
            }

            case FORM_INPUTS.SELECT: {
                return <Select allowClear disabled={disableField}>
                        {
                            options && options.map(({label, value}, index) => (
                                <Option key={`${value}_${index}`} value={value}>
                                    {label}
                                </Option>
                            ))
                        }
                    </Select>;
            }

            case FORM_INPUTS.URL: {
                return (
                    <Input disabled={disableField} />
                );
            }
        }
    }
}

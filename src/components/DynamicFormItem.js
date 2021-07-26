import { Form, Input, InputNumber, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import {FORM_INPUTS} from '../constants/form.const';

const { Option } = Select;

export default function DynamicFormItem (props) {
    const {
        keyName,
        label,
        valueType,
        fieldConstraints,
        options
    } = props;

    return (
        <Form.Item
            name={keyName}
            label={label}
            rules={fieldConstraints?.rules}>
                {
                    _getField(valueType, {
                        options
                    })
                }
        </Form.Item>
    )

    /////////////////////
    /////////////////////

    function _getField(valueType, config) {
        const { options } = config;

        switch(valueType) {
            case FORM_INPUTS.STRING: {
                return <Input />;
            }

            case FORM_INPUTS.LONG_STRING: {
                return <TextArea />
            }

            case FORM_INPUTS.NUMBER: {
                return <InputNumber className="form-input-number" />;
            }

            case FORM_INPUTS.SELECT: {
                return <Select allowClear>
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
                    <Input />
                );
            }
        }
    }
}

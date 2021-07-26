
import { Button } from 'antd';
import { FORM_INPUTS } from '../constants/form.const';
import { EditOutlined } from '@ant-design/icons';

export const buildColumns = (metadatas, {
    onEdit
}) => {
    let columns = metadatas?.map((metadata) => {
        return buildColumn(metadata);
    });

    columns = [
        ...columns,
        {
            title: 'Actions',
            key: 'actions',
            dataIndex: 'action',
            render: (field, row) => {
                return (
                    <>
                        <Button onClick={() => onEdit(row)}>
                            <EditOutlined />
                        </Button>
                    </>
                )
            }
    }];

    return columns;

    ///////////////////
    ///////////////////

    function buildColumn(metadata) {
        const {
            label,
            key,
            valueType
        } = metadata;

        let render;

        switch(valueType) {
            case FORM_INPUTS.SELECT: {
                render = (field) => {
                    const option = metadata.options.find(option => option.value === field);

                    return (
                        <>
                            {field && option && option.label}
                        </>
                    )
                }

                break;
            }

            case FORM_INPUTS.URL: {
                render = (field) => {
                    return (
                        <>
                            {field && <img className="table-img" src={field} />}
                        </>
                    )
                };

                break;
            }
        }

        return {
            title: label,
            key: key,
            dataIndex: key,
            render
        }
    }
}

import { Table } from "antd";
import { buildColumns } from "../utils/table.utils";

const DynamicTable = (props) => {
    const {
        metadata = [],
        onEdit,
        ...restProps
    } = props;

    const columns = buildColumns(metadata, {
        onEdit
    });

    return <Table
        columns={columns}
        {...restProps} />
}

export default DynamicTable;

import 'antd/dist/antd.css';

import { useTilesMetadataQuery, useTilesQuery } from '../queries/tiles.queries';
import { useModal } from '../hooks/modal.hook';
import { Table } from 'antd';
import { Button } from 'antd';
import TileModal from '../components/TileModal';
import { EditOutlined }  from '@ant-design/icons';
import { useAddTileMutation, useUpdateTileMutation } from '../mutations/tile.mutations';
import { useQueryClient } from 'react-query';
import { TILES_QUERY_KEY } from '../queries/tiles.queries.keys';
import {FORM_INPUTS} from '../constants/form.const';

/////////////////////
/////////////////////

const TilesPage = function () {
    const queryClient = useQueryClient();

    const tilesQuery = useTilesQuery();
    const tilesMetadataQuery = useTilesMetadataQuery();

    const {
        isModalVisible: isTileModalVisible,
        openModal: openTileModal,
        closeModal: closeTileModal,
        modalData: tileModalData
    } = useModal();

    const pagination = { position: ['none', 'none']};

    let tilesTableColumns = [];
    let tilesDataSource = [];

    let tileMetaData = [];

    const addTileMutation = useAddTileMutation({
        onSuccess: () => {
            queryClient.invalidateQueries(TILES_QUERY_KEY, {exact: true});
        }
    });

    const updateTileMutation = useUpdateTileMutation({
        onSuccess: () => {
            queryClient.invalidateQueries(TILES_QUERY_KEY, {exact: true});
        }
    });

    const resultTiles = tilesQuery.data;
    const resultTilesMetaData = tilesMetadataQuery.data;

    if (tilesMetadataQuery.isSuccess) {
        tileMetaData = resultTilesMetaData?.data?.model?.attributes;
        tilesTableColumns = _buildColumns(resultTilesMetaData?.data?.model?.attributes);
    }

    if (tilesQuery.isSuccess) {
        tilesDataSource = resultTiles?.data;
    }

    ///////////////////
    ///////////////////

    const onCreateTileClick = onCreateTileClickFn;
    const onEditTileClick = onEditTileClickFn;
    const handleOk = handleOkFn;
    const handleCancel = handleCancelFn;

    //////////////////////
    //////////////////////

    return (
        <div>
            <div className="tile-header">
                <h1>
                    Tiles Page
                </h1>

                <div>
                    <Button type="primary"
                        onClick={onCreateTileClick}>

                        Create Tile</Button>
                </div>
            </div>

            <div>
                <Table
                    columns={tilesTableColumns}
                    dataSource={tilesDataSource}
                    rowKey="id"
                    pagination={pagination}/>
            </div>

            <TileModal
                visible={isTileModalVisible}
                handleOk={handleOk}
                handleCancel={handleCancel}
                tileData={tileModalData}
                tileMetaData={tileMetaData}
                destroyOnClose={true} />
        </div>
    )

    //////////////////////
    //////////////////////

    function onCreateTileClickFn() {
        openTileModal();
    }

    function onEditTileClickFn(data) {
        openTileModal({...data});
    }

    function handleOkFn(tileData) {
        if (tileData.id) {
            updateTileMutation.mutate(tileData);
        } else {
            addTileMutation.mutate(tileData);
        }

        closeTileModal();
    }

    function handleCancelFn() {
        closeTileModal();
    }

    ////////////////////
    ////////////////////

    function _buildColumns(metadatas) {
        let columns = metadatas.map((metadata) => {
            return _buildColumn(metadata);
        });

        columns = [...columns, {
            title: 'Actions',
            key: 'actions',
            dataIndex: 'action',
            render: (field, row) => {
                return (
                    <>
                        <Button onClick={() => onEditTileClick(row)}>
                            <EditOutlined />
                        </Button>
                    </>
                )
            }
        }];

        return columns;
    }

    function _buildColumn(metadata) {
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

export default TilesPage;

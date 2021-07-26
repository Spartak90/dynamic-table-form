import 'antd/dist/antd.css';

import { useTilesMetadataQuery, useTilesQuery } from '../queries/tiles.queries';
import { useModal } from '../hooks/modal.hook';
import { Button } from 'antd';
import DynamicFormModal from '../components/DynamicFormModal';
import { useAddTileMutation, useUpdateTileMutation } from '../mutations/tile.mutations';
import { useQueryClient } from 'react-query';
import { TILES_QUERY_KEY } from '../queries/tiles.queries.keys';
import DynamicTable from '../components/DynamicTable';

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

    const pagination = { position: ['none', 'none']};

    const resultTiles = tilesQuery.data;
    const resultTilesMetaData = tilesMetadataQuery.data;

    if (tilesMetadataQuery.isSuccess) {
        tileMetaData = resultTilesMetaData?.data?.model?.attributes;
    }

    if (tilesQuery.isSuccess) {
        tilesDataSource = resultTiles?.data;
    }

    /////////////////////
    /////////////////////

    const onCreateTileClick = onCreateTileClickFn;
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

            <DynamicTable
                rowKey="id"
                pagination={pagination}
                dataSource={tilesDataSource}
                metadata={tileMetaData}
                onEdit={onEditTileClickFn}
            />

            <DynamicFormModal
                visible={isTileModalVisible}
                handleOk={handleOk}
                handleCancel={handleCancel}
                data={tileModalData}
                metadatas={tileMetaData}
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
}

export default TilesPage;

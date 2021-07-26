import { useQuery } from "react-query";
import { getTiles, getTilesMetadata } from "../api/tiles.api";
import { TILES_METADATA_QUERY_KEY, TILES_QUERY_KEY } from "./tiles.queries.keys";

export const useTilesQuery = (config = {}) => {
    return useQuery(TILES_QUERY_KEY, getTiles, config);
}

export const useTilesMetadataQuery = (config = {}) => {
    return useQuery(TILES_METADATA_QUERY_KEY, getTilesMetadata, config);
}

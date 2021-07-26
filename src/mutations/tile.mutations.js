import { useMutation } from "react-query";
import { addTile, updateTile } from "../api/tiles.api";

export const useAddTileMutation = config => useMutation(addTile, config);
export const useUpdateTileMutation = config => useMutation(updateTile, config);

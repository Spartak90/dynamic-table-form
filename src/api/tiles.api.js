const axios = require('axios');

const api = 'http://localhost:3005';


export const getTiles = () => {
    return axios.get(`${api}/tiles`);
};

export const getTilesMetadata = () => {
    return axios.get(`${api}/tilesMetadata`);
}

export const addTile = (tile) => {
    return axios.post(`${api}/tiles`, tile);
}

export const updateTile = (tile) => {
    return axios.put(`${api}/tiles/${tile.id}`, tile);
}

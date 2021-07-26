import { useState } from 'react';

export const useModal = () => {
    // const [modalState, setModalState] = useState({
    //     isModalVisible: false,
    //     modalData: {}
    // });

    // const { isModalVisible, modalData } = modalState;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalData, setModalData] = useState({});

    const openModal = (modalData = {}) => {
        // setModalState({
        //     isModalVisible: false,
        //     modalData: {}
        // });
        setIsModalVisible(true);
        setModalData(modalData);
    };

    const closeModal = () => {
        // setModalState({
        //     isModalVisible: false,
        //     modalData: {}
        // });

        setIsModalVisible(false);
        setModalData({});
    };

    return {
        isModalVisible,
        modalData,
        // setIsModalVisible,
        // setModalData,
        openModal,
        closeModal
    }
}

import { useState } from 'react';
import { getTrashPhotoKey } from '../../utils/trash';

const useTrashSelection = ({
  rejectedPhotos,
  deletedBestPicks,
}) => {
  const [activeTab, setActiveTab] =
    useState('rejected');

  const [
    isSelectionMode,
    setIsSelectionMode,
  ] = useState(false);

  const [
    selectedPhotoKeys,
    setSelectedPhotoKeys,
  ] = useState([]);

  const visiblePhotos =
    activeTab === 'rejected'
      ? rejectedPhotos
      : deletedBestPicks;

  const getPhotoKey = (photo) =>
    getTrashPhotoKey(photo, activeTab);

  const isPhotoSelected = (photo) =>
    selectedPhotoKeys.includes(
      getPhotoKey(photo),
    );

  const selectedPhotos =
    visiblePhotos.filter(isPhotoSelected);

  const changeTab = (nextTab) => {
    setActiveTab(nextTab);
    setIsSelectionMode(false);
    setSelectedPhotoKeys([]);
  };

  const toggleSelectionMode = () => {
    if (isSelectionMode) {
      setSelectedPhotoKeys([]);
    }

    setIsSelectionMode(
      (previous) => !previous,
    );
  };

  const togglePhoto = (photo) => {
    const photoKey = getPhotoKey(photo);

    setSelectedPhotoKeys(
      (previousKeys) =>
        previousKeys.includes(photoKey)
          ? previousKeys.filter(
              (key) => key !== photoKey,
            )
          : [...previousKeys, photoKey],
    );
  };

  const clearSelection = () => {
    setSelectedPhotoKeys([]);
    setIsSelectionMode(false);
  };

  return {
    activeTab,
    visiblePhotos,
    selectedPhotos,
    isSelectionMode,

    getPhotoKey,
    isPhotoSelected,
    changeTab,
    toggleSelectionMode,
    togglePhoto,
    clearSelection,
  };
};

export default useTrashSelection;

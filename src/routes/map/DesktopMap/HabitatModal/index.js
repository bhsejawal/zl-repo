import {
  Layer,
  Box,
  Heading,
  Text,
  TextArea,
  MaskedInput,
  Button,
  Select,
} from 'grommet';
import { connect } from 'react-redux';
import { useMemo, useRef, useState } from 'preact/hooks';
import useFetch from 'use-http';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';

import { buildURL } from 'Shared/fetch';
import { PrimaryButton, OutlineButton } from 'Components/Buttons';
import HabitatCard from 'Components/HabitatCard';
import ImageSelector from 'Components/ImageSelector';

import { updateHabitatData, setEditHabitat, toggleMapModal } from '../../actions';
import { updateHabitat } from '../../../../redux/actions';

import style from '../../style.scss';

const HabitatModal = ({
  allHabitats,
  editHabitat,
  updateHabitatDataAction,
  setEditHabitatAction,
  toggleMapModalAction,
  updateHabitatAction,
}) => {
  const [errors, setErrors] = useState(null);
  const imgSelectorRef = useRef();
  const habitatList = useMemo(
    () => allHabitats.map(({ _id, title }) => ({ _id, title })),
    [allHabitats],
  );
  const { patch, response } = useFetch(
    buildURL('/admin/habitats'),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const handleInputChange = (field, value) => {
    updateHabitatDataAction(field, value);
  }

  const submitHandler = async () => {
    setErrors(null);
    const formErrors = {};

    const isValidImage = await imgSelectorRef.current.validate();

    if (!isValidImage) {
      formErrors.image = true;
    }

    if (!editHabitat.description
      || editHabitat.description.length === 0
      || editHabitat.description.length > 145) {
      formErrors.description = true;
    }

    if (Number.isNaN(parseInt(editHabitat.mapPosition?.top, 10))
      || Number.isNaN(parseInt(editHabitat.mapPosition?.left, 10))) {
      formErrors.mapPosition = true;
    }

    if (Object.keys(formErrors).length) {
      setErrors(formErrors);
      return;
    }

    const { description, mapPosition, wideImage } = editHabitat;
    const editData = { description, mapPosition, wideImage };

    await patch(`${editHabitat._id}?v=${editHabitat.__v || 0}`, editData);
    if (response.ok) {
      updateHabitatAction(editHabitat._id, editData);
      toggleMapModalAction();
    }
  }

  const onSelectEditHabitat = ({ target }) => {
    setEditHabitatAction(allHabitats.find(({ _id }) => _id === target.value));
  };

  return (
    <Layer onClickOutside={toggleMapModalAction}>
      <Box
        background="white"
        round="10px"
        direction="row"
        pad="45px"
        width={{ min: '893px' }}
        height={{ min: '672px' }}
        style={{ position: 'relative'}}
      >
        <Box style={{ position: 'absolute', top: '25px', right: '20px' }}>
          <Button
            plain
            onClick={toggleMapModalAction}
            icon={<FontAwesomeIcon size="2x" icon={faTimes} />}
          />

        </Box>
        <Box basis="1/2">
          <Box>
            <Heading level="2" margin="0">Map Settings</Heading>
          </Box>
          <Box margin={{ top: '25px' }}>
            <Heading level="4" as="label">Habitat:</Heading>
            <Box margin={{ top: '16px' }}>
              <Select
                labelKey="title"
                placeholder="Select a habitat"
                valueKey={{ key: '_id', reduce: true }}
                value={editHabitat?._id || undefined}
                onChange={onSelectEditHabitat}
                options={habitatList}
              />
            </Box>
          </Box>
          {editHabitat?._id && (
            <>
              <Box margin={{ top: '25px' }}>
                <Heading level="4" as="label">Location on Map:</Heading>
                <Box direction="row" gap="medium" margin={{ top: '10px' }}>
                  <Box direction="row" align="center" basis="1/3">
                    <Heading level="4" as="label" color="var(--mediumGrey)">X:</Heading>
                    <Box margin={{ left: "10px", right: "4px" }} width="50px">
                      <MaskedInput
                        mask={[
                          {
                            length: [2, 3],
                            regexp: /^([0-9]|[1-9][0-9]|100)$/,
                          },
                        ]}
                        placeholder="0"
                        value={editHabitat?.mapPosition?.left}
                        size="large"
                        onChange={(evt) => handleInputChange('mapPosition.left', evt.target.value)}
                      />
                    </Box>
                    <Text size="medium" as="label">%</Text>
                  </Box>
                  <Box direction="row" align="center" basis="1/3">
                    <Heading level="4" as="label" color="var(--mediumGrey)">Y:</Heading>
                    <Box margin={{ left: "10px", right: "4px" }} width="50px">
                      <MaskedInput
                        mask={[
                          {
                            length: [2, 3],
                            regexp: /^([0-9]|[1-9][0-9]|100)$/,
                          },
                        ]}
                        placeholder="0"
                        size="large"
                        value={editHabitat?.mapPosition?.top}
                        onChange={(evt) => handleInputChange('mapPosition.top', evt.target.value)}
                      />
                    </Box>
                    <Text size="medium" as="label">%</Text>
                  </Box>
                </Box>
                <Box margin={{ top: '4px' }} height="20px">
                  {errors?.mapPosition && (
                    <Text color="status-error">Both coordinate points are required</Text>
                  )}
                </Box>
              </Box>
              <Box margin={{ top: '5px' }}>
                <Heading level="4" as="label">Photo:</Heading>
                <Text size="large">We recommend using the habitat photo, cropped to 450px by 150px.</Text>
                <Box margin={{ top: '10px' }}>
                  <ImageSelector
                    required
                    url={editHabitat.wideImage}
                    ref={imgSelectorRef}
                    placeholder="https://"
                    constraints={{
                      acceptedFormats: ['jpg', 'jpeg'],
                      maxFileSize: 500_000,
                    }}
                    onChange={(url) => handleInputChange('wideImage', url)}
                  />
                </Box>
              </Box>
              <Box margin={{ top: '25px' }}>
                <Heading level="4" as="label">Description:</Heading>
                <Box height="120px" direction="column" margin={{ top: '10px' }}>
                  <TextArea
                    placeholder="Habitat Description"
                    value={editHabitat.description}
                    onChange={(evt) => handleInputChange('description', evt.target.value)}
                    resize={false}
                    fill
                  />
                  <Box direction="row" fill="horizontal" margin={{ top: '4px'}} gap="small">
                    <Box>
                      {errors?.description && (
                        <Text color="status-error">
                          Text should be between 1 and 145 characters
                        </Text>
                      )}
                    </Box>
                    <Box flex="grow">
                      <Text textAlign="end">
                        {editHabitat.description?.length ?? 0}
                        /145
                      </Text>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </Box>
        <Box pad={{ horizontal: "20px" }} className={style.divider} />
        <Box basis="1/2" align="center">
          <Box margin={{ top: '75px' }} style={{ pointerEvents: 'none' }}>
            {editHabitat && (
              <HabitatCard
                slug={editHabitat.slug}
                zooSlug={editHabitat.zoo?.slug}
                online={editHabitat.online}
                liveTalk={editHabitat.liveTalk}
                title={editHabitat.title}
                description={editHabitat.description}
                image={editHabitat.wideImage}
                logo={editHabitat.zoo?.logo}
                className={style.card}
                habitatId={editHabitat._id}
              />
            )}
          </Box>
          <Box justify="end" flex="grow">
            <Box
              direction="row"
              pad={{ horizontal: "medium" }}
              gap="small"
              height="50px"
            >
              <OutlineButton label="Cancel" onClick={toggleMapModalAction} />
              <PrimaryButton
                label="Publish"
                onClick={submitHandler}
                disabled={!editHabitat._id}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Layer>
  )
};

export default connect(
  ({
    allHabitats,
    map: {
      editHabitat,
      habitats,
    },
  }) => ({
    allHabitats,
    editHabitat,
    habitats,
  }),
  {
    updateHabitatDataAction: updateHabitatData,
    setEditHabitatAction: setEditHabitat,
    toggleMapModalAction: toggleMapModal,
    updateHabitatAction: updateHabitat,
  },
)(HabitatModal);

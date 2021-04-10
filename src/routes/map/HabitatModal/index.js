import {
  Layer,
  Box,
  Heading,
  Text,
  TextArea,
  MaskedInput,
  Button,
} from 'grommet';
import { connect } from 'react-redux';
import { useMemo, useRef, useState } from 'preact/hooks';
import useFetch from 'use-http';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faTimes } from '@fortawesome/pro-solid-svg-icons';

import { buildURL } from 'Shared/fetch';
import { PrimaryButton, OutlineButton } from 'Components/Buttons';
import HabitatCard from 'Components/HabitatCard';
import ImageSelector from 'Components/ImageSelector';

import {
  updateHabitatData,
  selectEditHabitat,
  toggleMapModal,
  updateHabitatList,
} from '../actions';

import style from '../style.scss';

const HabitatModal = ({
  editHabitat,
  habitats,
  updateHabitatDataAction,
  selectEditHabitatAction,
  toggleMapModalAction,
  updateHabitatListAction,
}) => {
  const [errors, setErrors] = useState(null);
  const imgSelectorRef = useRef();
  const habitatList = useMemo(() => habitats.map(({ _id, title }) => ({ _id, title })), [habitats]);
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
      || editHabitat.description.length > 125) {
      formErrors.description = true;
    }

    if (Number.isNaN(parseInt(editHabitat.mapPosition.top, 10))
      || Number.isNaN(parseInt(editHabitat.mapPosition.left, 10))) {
      formErrors.mapPosition = true;
    }

    if (Object.keys(formErrors).length) {
      setErrors(formErrors);
      return;
    }

    const {
      description,
      mapPosition,
      wideImage,
    } = editHabitat;

    await patch(`${editHabitat._id}?v=${editHabitat.__v || 0}`, { description, mapPosition, wideImage });
    if (response.ok) {
      updateHabitatListAction();
      toggleMapModalAction();
    }
  }

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
            <Box className="simpleSelect" margin={{ top: '16px' }}>
              <select
                value={editHabitat?._id}
                onChange={(evt) => selectEditHabitatAction(evt.target.value)}
              >
                {!editHabitat?._id && (
                  <option value="" selected> Select a habitat</option>
                )}
                {habitatList.map(({ _id, title }) => (
                  <option selected={editHabitat?._id === _id} value={_id}>
                    {title}
                  </option>

                ))}
              </select>
              <FontAwesomeIcon icon={faChevronDown} color="var(--blue)" />
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
                        value={editHabitat.mapPosition.left}
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
                        value={editHabitat.mapPosition.top}
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
                <Text size="large">We recommend using the habitat photo, cropped.</Text>
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
                          Text should be between 1 and 125 characters
                        </Text>
                      )}
                    </Box>
                    <Box flex={{ grow: '1' }}>
                      <Text textAlign="end">
                        {editHabitat.description?.length ?? 0}
                        /125
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
              <OutlineButton label="Cancel" size="medium" onClick={toggleMapModalAction} />
              <PrimaryButton
                label="Publish"
                size="medium"
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
    map: {
      editHabitat,
      habitats,
    },
  }) => ({
    editHabitat,
    habitats,
  }),
  {
    updateHabitatDataAction: updateHabitatData,
    selectEditHabitatAction: selectEditHabitat,
    toggleMapModalAction: toggleMapModal,
    updateHabitatListAction: updateHabitatList,
  },
)(HabitatModal);

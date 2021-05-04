import { h } from 'preact';
import { useMemo, useRef, useState } from 'preact/hooks';
import { Link } from 'preact-router';
import { Box, Text } from 'grommet';
import { format, parseISO } from 'date-fns';
import useFetch from 'use-http';

import AdminTable from 'Components/AdminTable';
import ImageSelector from 'Components/ImageSelector';
import { buildURL } from 'Shared/fetch';
import { TEXTAREA, TEXT_AUTOCOMPLETE } from 'Components/AdminTable/constants';

import editImagePlaceholder from './editImagePlaceholder.png';

import style from './style.scss';

const NameWithPhoto = ({
  profileImage,
  title,
  slug,
  zoo,
}) => (
  <Box direction="row">
    <img className={style.tableImg} src={profileImage} alt="profile" />
    <Link href={`/h/${zoo?.slug}/${slug}`}>
      <Text size="large">{title}</Text>
    </Link>
  </Box>
);

const EditHabitatRender = ({ profileImage: profileImageProp }) => {
  const imgRef = useRef();
  const previewImgRef = useRef();
  const [profileImage, setProfileImage] = useState(profileImageProp);

  return (
    <div>
      <Box direction="row" justify="between" align="center">
        <input type="hidden" name="profileImage" value={profileImage} />

        <Box margin={{ right: 'medium' }} width="80px" height="80px">
          <img ref={previewImgRef} src={profileImage || editImagePlaceholder} alt="preview" />
        </Box>

        <Box flex="grow">
          <ImageSelector
            required
            ref={imgRef}
            previewRef={previewImgRef}
            url={profileImage}
            label="Habitat Photo"
            constraints={{
              // TODO: we need to review these
              maxResolution: 800,
              maxFileSize: 100_000,
              aspectRatio: '1:1',
              acceptedFormats: ['jpeg', 'jpg', 'svg', 'png'],
            }}
            onChange={setProfileImage}
          />
        </Box>
      </Box>
    </div>
  );
};

const UpdatedAtCell = ({ updatedAt }) => (
  <Text size="large">
    {updatedAt ? format(parseISO(updatedAt), 'yyyy-MM-dd') : ''}
  </Text>
);

const CreatedAtCell = ({ createdAt }) => (
  <Text size="large">
    {createdAt ? format(parseISO(createdAt), 'yyyy-MM-dd') : ''}
  </Text>
);

const responseTransform = ({ habitats } = {}) => habitats;

const Habitats = () => {
  const { data: { zoos = [] } = {} } = useFetch(
    buildURL('/admin/zoos?pageSize=5000'),
    { credentials: 'include', cachePolicy: 'no-cache' },
    [],
  );

  const columns = useMemo(() => [{
    title: 'Habitat',
    property: 'title',
    render: NameWithPhoto,
  }, {
    property: 'profileImage',
    hiddenOnTable: true,
    editable: true,
    editRender: EditHabitatRender,
  }, {
    title: 'Habitat Name',
    property: 'title',
    hiddenOnTable: true,
    editable: true,
  }, {
    title: 'Species',
    property: 'animal',
    editable: true,
  }, {
    title: 'Description',
    property: 'description',
    editable: true,
    type: TEXTAREA,
  }, {
    title: 'Partner',
    property: 'zoo.name',
    // when post property is defined, AdminTable will use "property" to display value
    // and post property to send that value to the server
    postProperty: 'zoo',
    editable: true,
    type: TEXT_AUTOCOMPLETE,
    selectValues: zoos.map(({ name, _id }) => ({ label: name, value: _id })),
  }, {
    title: 'Status',
    property: 'status',
  }, {
    title: 'Last Modified',
    property: 'updatedAt',
    render: UpdatedAtCell,
    search: false,
  }, {
    title: 'Date Created',
    property: 'createdAt',
    render: CreatedAtCell,
    search: false,
  }], [zoos]);

  return (
    <AdminTable
      deleteDisabled
      columns={columns}
      entity={{ singular: 'Habitat', plural: 'Habitats' }}
      serverPath="/admin/habitats"
      responseTransform={responseTransform}
    />
  );
};

export default Habitats;

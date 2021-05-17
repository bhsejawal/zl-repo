import { h } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { Box, Text } from 'grommet';
import { format, parseISO } from 'date-fns';

import AdminTable from 'Components/AdminTable';
import ImageSelector from 'Components/ImageSelector';
import { TEXTAREA, TEXT_AUTOCOMPLETE } from 'Components/AdminTable/constants';

import editImagePlaceholder from './placeholder.png';
import { countryList, timezoneList } from './constants';

import style from './style.scss';

const EditLogoRender = ({ logo: logoProp }) => {
  const imgRef = useRef();
  const previewImgRef = useRef();
  const [logo, setLogo] = useState(logoProp);

  return (
    <div>
      <Box direction="row" justify="between" align="center">
        <input type="hidden" name="logo" value={logo} />

        <Box margin={{ right: 'medium' }} width="80px" height="80px">
          <img ref={previewImgRef} src={logo || editImagePlaceholder} alt="preview" />
        </Box>

        <Box flex="grow">
          <ImageSelector
            required
            ref={imgRef}
            previewRef={previewImgRef}
            url={logo}
            label="Partner Photo"
            constraints={{
              maxResolution: 500,
              maxFileSize: 100_000,
              acceptedFormats: ['jpeg', 'jpg'],
            }}
            onChange={setLogo}
          />
        </Box>
      </Box>
    </div>
  );
};

const NameWithPhoto = ({ logo, name }) => (
  <Box direction="row">
    <img className={style.tableImg} src={logo} alt="logo" />
    <Text size="large">{name}</Text>
  </Box>
);

const Address = ({ location: { city, state, country } = {} }) => (
  <Text size="large">
    {city}
    {state ? `, ${state}` : ''}
    {', '}
    {country}
  </Text>
);

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

const columns = [{
  property: 'logo',
  hiddenOnTable: true,
  editable: true,
  editRender: EditLogoRender,
}, {
  title: 'Partner',
  property: 'name',
  editable: true,
  render: NameWithPhoto,
}, {
  title: 'Description',
  property: 'description',
  editable: true,
  maxLength: 400,
  type: TEXTAREA,
}, {
  title: 'Address',
  property: 'location',
  render: Address,
}, {
  title: 'Timezone',
  property: 'timezone',
  editable: true,
  type: TEXT_AUTOCOMPLETE,
  selectValues: timezoneList.map((zone) => ({ label: zone, value: zone })),
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
}, {
  title: 'Country',
  property: 'location.country',
  hiddenOnTable: true,
  editable: true,
  type: TEXT_AUTOCOMPLETE,
  selectValues: countryList.map((zone) => ({ label: zone, value: zone })),
}, {
  title: 'State',
  property: 'location.state',
  hiddenOnTable: true,
  editable: true,
  required: false,
}, {
  title: 'City',
  property: 'location.city',
  hiddenOnTable: true,
  editable: true,
}];

const responseTransform = ({ zoos } = {}) => zoos;

const Partners = () => (
  <AdminTable
    deleteDisabled
    columns={columns}
    entity={{ singular: 'Partner', plural: 'Partners' }}
    serverPath="/admin/zoos"
    responseTransform={responseTransform}
  />
)

export default Partners;

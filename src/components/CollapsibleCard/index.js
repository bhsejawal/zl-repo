import { h } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { memo } from 'preact/compat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Box, Card } from 'grommet';

import style from './style.scss';

const CollapsibleCard = ({
  label,
  icon,
  className,
  style: propStyle,
  children,
  defaultOpen = false,
  onOpen,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  const toggle = useCallback(() => {
    setOpen(!open);
  }, [open]);

  useEffect(() => {
    if (open) {
      onOpen?.();
    }
  }, [open, onOpen]);

  return (
    <Card className={className} style={propStyle}>
      {/* eslint-disable-next-line */}
      <div className={style.header} onClick={toggle}>
        <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
        <span>{label}</span>
        {icon}
      </div>

      {open && (
        <div>
          <Box pad="small">
            {children}
          </Box>
        </div>
      )}
    </Card>
  );
};

export default memo(CollapsibleCard);

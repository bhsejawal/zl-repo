import { h } from 'preact';
import classnames from 'classnames';
import style from './style.scss';

const Button = ({
  className,
  variant, // primary, secondary, outline
  size, // sm, xs
  disabled,
  children,
  onClick,
  submit,
}) => (
  <button
    type={submit ? 'submit' : 'button'}
    onClick={onClick}
    disabled={disabled}
    className={classnames(style.button, className, {
      [style[variant]]: variant,
      [style[size]]: size,
    })}
  >
    {children}
  </button>
);

export default Button;

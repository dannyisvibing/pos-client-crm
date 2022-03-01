import React from 'react';
import classnames from 'classnames';

export const Flag = ({ negative, warning, classes, children }) => (
  <div
    className={classnames('vd-flag', classes, {
      'vd-flag--negative': negative,
      'vd-flag--warning': warning
    })}
  >
    {children}
  </div>
);

export const Header = ({
  classes,
  page,
  subPage,
  section,
  settings,
  dialog,
  children
}) => (
  <div
    className={classnames('vd-header', classes, {
      'vd-header--page': page,
      'vd-header--subpage': subPage,
      'vd-header--section': section,
      'vd-header--settings': settings,
      'vd-header--dialog': dialog
    })}
  >
    {children}
  </div>
);

export const Field = ({ children, classes }) => (
  <div className={classnames('vd-field', classes)}>{children}</div>
);

export const FieldLabel = ({ classes, children }) => (
  <div className={classnames('vd-label', classes)}>{children}</div>
);

export const FieldValue = ({ classes, children }) => (
  <div className={classnames('vd-value', classes)}>{children}</div>
);

export const A = ({
  title,
  faIcon,
  secondary,
  supplementary,
  href,
  classes,
  ...props
}) => (
  <a
    href={href}
    className={classnames('vd-link', classes, {
      'vd-link--secondary': secondary,
      'vd-text-supplementary': supplementary
    })}
    {...props}
  >
    {faIcon && (
      <span>
        <i className={faIcon} />
      </span>
    )}
    {title}
  </a>
);

export const TextArea = ({
  id = 'default-textarea',
  label,
  note,
  scrollable,
  classes,
  ...props
}) => (
  <div className={classnames('vd-field', classes)}>
    {label && <div className={'vd-label'}>{label}</div>}
    <div className="vd-value">
      <textarea
        className={classnames('vd-input vd-textarea', {
          'vd-textarea--scrollable': scrollable
        })}
        {...props}
      />
      {note && <p className="vd-p vd-text--sub vd-text--secondary">{note}</p>}
    </div>
  </div>
);

export const Input = ({
  id = 'default-input',
  unnested = false,
  classes = {},
  label,
  textRight,
  ...props
}) =>
  unnested ? (
    <input
      id={id}
      name={id}
      type="text"
      className={classnames('vd-input', classes.input, {
        'vd-input--text-align-right': textRight
      })}
      {...props}
    />
  ) : (
    <div className={classnames('vd-field', classes.root)}>
      {label && <div className={'vd-label'}>{label}</div>}
      <div className={classnames('vd-value', classes.wrapper)}>
        <input
          id={id}
          name={id}
          type="text"
          className={classnames('vd-input', classes.input, {
            'vd-input--text-align-right': textRight
          })}
          {...props}
        />
      </div>
    </div>
  );

export const IconInput = ({
  id = 'default-icon-input',
  classes,
  style = {},
  faIcon,
  symbol,
  iconRight,
  label,
  textRight,
  ...props
}) => (
  <div className={classnames('vd-field', classes)}>
    {label && (
      <label className="vd-label" htmlFor={id}>
        {label}
      </label>
    )}
    <div className="vd-value">
      <input
        id={id}
        name={id}
        type="text"
        className={classnames('vd-input', {
          'vd-input--icon-left': (faIcon || symbol) && !iconRight,
          'vd-input--icon-right': (faIcon || symbol) && iconRight,
          'vd-input--text-align-right': textRight
        })}
        style={style.input}
        {...props}
      />
      {faIcon ? (
        <i
          className={classnames('vd-input-icon', faIcon, {
            'vd-input-icon--left': !iconRight,
            'vd-input-icon--right': iconRight
          })}
        />
      ) : (
        <div
          className={classnames('vd-input-icon vd-input-symbol', {
            'vd-input-icon--left': symbol && !iconRight,
            'vd-input-icon--right': symbol && iconRight
          })}
        >
          {symbol}
        </div>
      )}
    </div>
  </div>
);

export const Checkbox = ({
  classes,
  label,
  primary,
  secondary,
  negative,
  tertiary,
  info,
  ...props
}) => (
  <div
    className={classnames('vd-checkbox', classes, {
      'vd-checkbox--primary': primary,
      'vd-checkbox--secondary': secondary,
      'vd-checkbox--negative': negative,
      'vd-checkbox--tertiary': tertiary,
      'vd-checkbox--info': info
    })}
  >
    <label className="vd-checkbox-container">
      <div className="vd-checkbox-input-container">
        <input className="vd-checkbox-input" type="checkbox" {...props} />
        <div className="vd-checkbox-tick" />
        <div className="vd-checkbox-label">{label}</div>
      </div>
    </label>
  </div>
);

export const Button = ({
  children,
  component,
  big,
  strong,
  table,
  primary,
  secondary,
  negative,
  faIcon,
  text,
  group,
  inline,
  unnested,
  classes,
  ...props
}) =>
  unnested ? (
    component === 'a' ? (
      <a
        className={classnames(
          'vd-button',
          typeof classes === 'object' ? classes.btn : classes,
          {
            'vd-button--big': big,
            'vd-button--primary': primary,
            'vd-button--negative': negative,
            'vd-button--secondary': secondary,
            'vd-button--icon': !text && faIcon,
            'vd-button--strong': strong,
            'vd-button--table': table,
            'vd-button--text': text
          }
        )}
        {...props}
      >
        {faIcon && <i className={faIcon} />}
        {!text ? children : <span>{text}</span>}
      </a>
    ) : (
      <button
        className={classnames(
          'vd-button',
          typeof classes === 'object' ? classes.btn : classes,
          {
            'vd-button--big': big,
            'vd-button--primary': primary,
            'vd-button--negative': negative,
            'vd-button--secondary': secondary,
            'vd-button--icon': !text && faIcon,
            'vd-button--strong': strong,
            'vd-button--table': table,
            'vd-button--text': text
          }
        )}
        type="button"
        {...props}
      >
        {faIcon && <i className={faIcon} />}
        {!text ? children : <span>{text}</span>}
      </button>
    )
  ) : (
    <div
      className={classnames(typeof classes === 'object' ? classes.root : '', {
        'vd-button-group': group,
        'vd-inline-box': inline
      })}
    >
      {component === 'a' ? (
        <a
          className={classnames(
            'vd-button',
            typeof classes === 'object' ? classes.btn : classes,
            {
              'vd-button--big': big,
              'vd-button--primary': primary,
              'vd-button--negative': negative,
              'vd-button--secondary': secondary,
              'vd-button--icon': !text && faIcon,
              'vd-button--strong': strong,
              'vd-button--table': table,
              'vd-button--text': text
            }
          )}
          {...props}
        >
          {faIcon && <i className={faIcon} />}
          {!text ? children : <span>{text}</span>}
        </a>
      ) : (
        <button
          className={classnames(
            'vd-button',
            typeof classes === 'object' ? classes.btn : classes,
            {
              'vd-button--big': big,
              'vd-button--primary': primary,
              'vd-button--negative': negative,
              'vd-button--secondary': secondary,
              'vd-button--icon': !text && faIcon,
              'vd-button--strong': strong,
              'vd-button--table': table,
              'vd-button--text': text
            }
          )}
          type="button"
          {...props}
        >
          {faIcon && <i className={faIcon} />}
          {!text ? children : <span>{text}</span>}
        </button>
      )}
    </div>
  );

export const RadioButton = ({
  radios,
  classes,
  primary,
  secondary,
  negative,
  value,
  ...props
}) => (
  <div className="vd-field">
    <div className="vd-value">
      {radios.map((radio, i) => (
        <div
          key={i}
          className={classnames('vd-radio', classes, {
            'vd-radio--primary': primary,
            'vd-radio--secondary': secondary,
            'vd-radio--negative': negative
          })}
        >
          <label className="vd-radio-container">
            <div className="vd-radio-input-container">
              <input
                className="vd-radio-input"
                name="radio"
                type="radio"
                value={radio.value}
                checked={radio.value === value}
                {...props}
              />
              <div className="vd-radio-tick" />
              <div className="vd-radio-label">{radio.label}</div>
            </div>
          </label>
        </div>
      ))}
    </div>
  </div>
);

// Button Group used for Day, Week, Year period selector in Retail Dashboard
export const FlattenButtonGroup = ({
  buttons = [],
  selected = 0,
  classes,
  onClick
}) => (
  <ul className={classnames('button-group', classes)}>
    {buttons.map((button, i) => (
      <li key={i}>
        <a
          className={classnames('button fixed', {
            secondary: i === selected
          })}
          onClick={() => onClick(i)}
        >
          {button}
        </a>
      </li>
    ))}
  </ul>
);

// Date Slider for Prev, Next period selector in Retail Dashboard
export const DateSlider = ({ label, onPrevious, onNext, ...props }) => (
  <ul className="button-group">
    <li>
      <a className="button secondary" onClick={onPrevious}>
        <span>
          <i className="fa fa-arrow-left" />
        </span>
      </a>
    </li>
    <li>
      <a className="button date day">
        <strong>{label}</strong>
      </a>
    </li>
    <li>
      <a className="button secondary" onClick={onNext}>
        <span>
          <i className="fa fa-arrow-right" />
        </span>
      </a>
    </li>
  </ul>
);

// Main Button in Repoprting
export const VendButton = ({ label, faIcon, active, classes, ...props }) => (
  <a
    className={classnames(
      'button vend-button vend-button--info report-filter-toggle',
      classes,
      {
        'vend-button--active': active
      }
    )}
  >
    <span>{label}</span>
    <span>
      <i className={faIcon} />
    </span>
  </a>
);

// Button Group in Reporting
export const ButtonGroup = ({ classes, children }) => (
  <ul className={classnames('button-group', classes)}>
    <li>{children}</li>
  </ul>
);

export const UserBadge = ({ user, description }) => (
  <div className="vd-badge">
    <div className="vd-id-badge vd-id-badge--small vd-id-badge--">
      <div
        className="vd-id-badge__image"
        style={{ backgroundImage: 'url(/img/avatar-100x100.svg)' }}
      />
      <div className="vd-id-badge__content">
        <div className="vd-id-badge__header">
          <header>{user}</header>
        </div>
        <div className="vd-id-badge__description">{description}</div>
      </div>
    </div>
  </div>
);

export const Switch = ({ classes, ...props }) => (
  <div className={classnames('vd-switch', classes)}>
    <input className="vd-switch-input" type="checkbox" {...props} />
    <div className="vd-switch-track">
      <i className="vd-switch-icon fa fa-check" />
      <div className="vd-switch-track-knob" />
    </div>
  </div>
);

export const SmallSwitch = ({ ...props }) => (
  <a className="vd-activate vd-button vd-button--icon vd-button--table vd-button--secondary">
    <div className="vd-switch vd-switch--small">
      <input
        className="vd-switch-input"
        type="checkbox"
        checked="checked"
        {...props}
      />
      <div className="vd-switch-track">
        <div className="vd-switch-track-knob" />
      </div>
    </div>
  </a>
);

export const Tabs = ({
  tabs,
  activeTabIndex = 0,
  children,
  noBorder,
  onChange
}) => (
  <ul
    className={classnames('vd-tabs', {
      'vd-tabs--no-border': noBorder
    })}
  >
    {tabs.map((tab, i) => (
      <li
        key={i}
        className={classnames('vd-tab', {
          'vd-tab--active': i === activeTabIndex
        })}
      >
        <button className="vd-tab-button" onClick={() => onChange(i)}>
          {tab}
        </button>
      </li>
    ))}
    {children}
  </ul>
);

export const FilterCheckbox = ({
  id = 'default-basiccheckbox',
  classes,
  label,
  checked,
  onChange
}) => (
  <div className={classnames('basic-checkbox', classes)}>
    <input type="checkbox" id={id} checked={checked} onChange={onChange} />
    <label htmlFor={id}>{label}</label>
  </div>
);

export const ClassicInput = ({
  id,
  split,
  label,
  value,
  classes,
  onChange,
  ...props
}) => (
  <div className={classnames('input-row line', classes)}>
    <div className="unit">
      <label htmlFor={id}>{label}</label>
    </div>
    <div className="unit field">
      <input
        type="text"
        className={classnames('wide', { split })}
        name={id}
        id={id}
        value={value}
        onChange={onChange}
        style={{ padding: 3 }}
      />
      {split && (
        <input
          type="text"
          className={classnames('wide', { split })}
          name={`${id}-split`}
          id={`${id}-split`}
          {...props}
          style={{ padding: 3 }}
        />
      )}
    </div>
  </div>
);

export const ClassicNameInput = ({
  id,
  label,
  firstname,
  lastname,
  classes,
  onChangeFirstname,
  onChangeLastname
}) => (
  <div className={classnames('input-row line', classes)}>
    <div className="unit">
      <label htmlFor={id}>{label}</label>
    </div>
    <div className="unit field">
      <input
        type="text"
        className="wide split"
        name={id}
        id={id}
        value={firstname}
        onChange={onChangeFirstname}
        style={{ padding: 3 }}
      />
      <input
        type="text"
        className="wide split"
        name={`${id}-split`}
        id={`${id}-split`}
        value={lastname}
        onChange={onChangeLastname}
        style={{ padding: 3 }}
      />
    </div>
  </div>
);

export const ClassicDateOfBirth = ({ day, month, year, onChange }) => (
  <div className="input-row line">
    <div className="unit">
      <label>Date of birth</label>
    </div>
    <div className="unit line">
      <input
        type="text"
        placeholder="DD"
        className="split day unit"
        value={day}
        onChange={e => onChange('day', e.target.value)}
      />
      <input
        type="text"
        placeholder="MM"
        className="split month unit"
        value={month}
        onChange={e => onChange('month', e.target.value)}
      />
      <input
        type="text"
        placeholder="YYYY"
        className="split year unit"
        value={year}
        onChange={e => onChange('year', e.target.value)}
      />
    </div>
  </div>
);

export const ClassicSex = ({ value, onChange }) => (
  <div className="input-row line">
    <div className="unit">
      <label>Sex</label>
    </div>
    <div className="unit line">
      <ul className="line radio_list">
        <li className="unit">
          <input
            type="radio"
            name="radio"
            value="Female"
            checked={value === 'Female'}
            onChange={onChange}
          />
          <label>Female</label>
        </li>
        <li className="unit">
          <input
            type="radio"
            name="radio"
            value="Male"
            checked={value === 'Male'}
            onChange={onChange}
          />
          <label>Male</label>
        </li>
      </ul>
    </div>
  </div>
);

export const ClassicCheckbox = ({
  classes,
  labelClasses,
  title,
  label,
  help,
  ...props
}) => (
  <div className={classnames('input-row line', classes)}>
    <div className="unit">
      <label>{title}</label>
    </div>
    <div className="unit field">
      <input type="checkbox" {...props} />
      {label && <label className={labelClasses}>{label}</label>}
      {help && <div className="help">{help}</div>}
    </div>
  </div>
);

export const ClassicNormalCheckbox = ({ label, classes, ...props }) => (
  <div className={classnames('input-row line', classes)}>
    <div className="unit field">
      <input type="checkbox" {...props} />
      <div className="help">{label}</div>
    </div>
  </div>
);

export const ClassicP = ({ label, title }) => (
  <div className="input-row line">
    <div className="unit">
      <label>{label}</label>
    </div>
    <div className="unit">
      <p className="form-text-display">{title}</p>
    </div>
  </div>
);

export const ClassicSelect = ({
  id,
  classes,
  label,
  grouped,
  options,
  ...props
}) => (
  <div className={classnames('input-row line', classes)}>
    {label && (
      <div className="unit">
        <label htmlFor={id}>{label}</label>
      </div>
    )}
    <div className="unit field">
      {grouped ? (
        <select id={id} name={id} className="wide" {...props}>
          {options.groupCount === 1
            ? options.groups[0].options.map((option, i) => (
                <option key={i} value={option.value} disabled={option.disabled}>
                  {option.label}
                </option>
              ))
            : options.groups.map((group, i) => (
                <optgroup key={i} label={group.label}>
                  {group.options.map((option, j) => (
                    <option
                      key={j}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))}
        </select>
      ) : (
        <select id={id} name={id} className="wide" {...props}>
          {options.map((option, i) => (
            <option key={i} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  </div>
);

export const ClassicButton = ({ label, ...props }) => (
  <button className="cl-btn" {...props}>
    {label}
  </button>
);

export const ClassicAddTag = ({
  id,
  label,
  tags = [],
  onAdd,
  onDelete,
  ...props
}) => (
  <div className="input-row line">
    <div className="unit">
      <label htmlFor={id}>{label}</label>
    </div>
    <div className="unit">
      <div className="ajax-tag-holder">
        <input type="text" id={id} {...props} />
        <a className="ajax-tag-submit cl-btn cl-btn--pill" onClick={onAdd}>
          Add
        </a>
        <div className="ajax-tags-content-holder vd-mtm">
          {tags.map((tag, i) => (
            <span className="tag" key={i}>
              <input type="hidden" />
              {tag}
              <a
                className="tag-delete js-delete-tag"
                onClick={e => onDelete(tag)}
              >
                &nbsp;
              </a>
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const ClassicYesNo = ({ name, label, value, onChange }) => (
  <div className="input-row line">
    <div className="unit">
      <label htmlFor="">{label}</label>
    </div>
    <div className="unit field">
      <ul className="line radio_list">
        <li className="unit">
          <input
            name={name}
            type="radio"
            value={1}
            checked={value === 1}
            onChange={e => onChange(1)}
          />&nbsp;
          <label>Yes</label>
        </li>
        <li className="unit">
          <input
            name={name}
            type="radio"
            value={0}
            checked={value === 0}
            onChange={e => onChange(0)}
          />&nbsp;
          <label>No</label>
        </li>
      </ul>
    </div>
  </div>
);

import React, { useState } from 'react';
import { List, Toast, InputItem } from 'antd-mobile';
import { Button } from '@/components/CustomAntdMobile';
import { Picker } from './components';
import { FormConsumer } from './FormContext';
export { FormProvider } from './FormContext';

function judgeComponent(type, inputItemProps = {} as any, component) {
  const { label, ...rest } = inputItemProps;
  if (type === 'custom') {
    return component;
  } else if (type === 'picker') {
    return (
      <Picker cols={1} {...rest}>
        <List.Item arrow="horizontal">{label}</List.Item>
      </Picker>
    )
  } else {
    return (
      <InputItem
        placeholder='请输入'
        clear
        {...rest}
      >
        {label}
      </InputItem>
    )
  }
}

export interface FormProps {
  header?: any;
  footer?: any;
  items: {
    type?: string,
    fieldName: string,
    inputItemProps?: any,
    fieldProps?: any,
    component?: React.ReactElement,
  }[];
  handleSubmit?: (fieldsValue: any) => void;
}

function Form(props: FormProps) {
  const {
    header,
    footer,
    items,
    handleSubmit,
  } = props;
  const [form, setForm] = useState(null as any);

  const setFormItems = (_form, _items: any) => {
    setForm(_form);
    const { getFieldProps, getFieldError } = _form;
    return _items.map(item => {
      const { type, fieldName, inputItemProps, component, fieldProps } = item;

      const error = getFieldError(fieldName);
      const errorProps = error ? {
        error,
        onErrorClick: () => Toast.info(error[0], 2, undefined, false),
      } : {};

      const _fieldProps = type !== 'custom' ? {
        ...getFieldProps(fieldName, fieldProps || undefined),
      } : {};

      return (
        React.cloneElement(
          judgeComponent(type, inputItemProps, component),
          {
            key: fieldName,
            ..._fieldProps,
            ...errorProps,
          }
        )
      );
    });
  }

  const handleClick = () => {
    if (form) {
      form.validateFields((err, values) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log('form err:', err);
          console.log('form values', values);
        }
        if (err) return;
        if (handleSubmit) { handleSubmit(values) };
      });
    }
  }

  const renderButton = () => {
    return (
      <List.Item>
        <Button
          type='primary'
          onClick={handleClick}
        >
          确定
        </Button>
      </List.Item>
    )
  }

  const listProps: any = {};
  if (header) { listProps.renderHeader = () => header; }
  if (footer) { listProps.renderFooter = () => footer; }

  return (
    <FormConsumer>
      {_form => (
        <List {...listProps}>
          {setFormItems(_form, items)}
          {handleSubmit ? renderButton() : null}
        </List>
      )}
    </FormConsumer>
  )
}

export default Form;
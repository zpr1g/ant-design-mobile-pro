import React from 'react';
import { ImagePicker } from 'antd-mobile';
import { ImagePickerPropTypes } from 'antd-mobile/lib/image-picker';

export interface ImagePickerFile {
  file: File;
  orientation: 1;
  url: string;
}

export interface ImagePickerProps extends Omit<ImagePickerPropTypes, 'onChange'> {
  disabled?: boolean;
  filesCountLimit?: number;
  onChange?: (files: ImagePickerFile[]) => void;
}
export default class extends React.Component<ImagePickerProps> {
  /**
   * remove with index
   */
  onChange = (files: ImagePickerFile[], type: 'add' | 'remove', index: number) => {
    const { onChange = () => { } } = this.props;
    console.log(files, type, index);
    onChange(files);
  }

  render() {
    const { onChange, filesCountLimit = 1, disabled, ...rest } = this.props;
    return (
      <ImagePicker
        disableDelete={disabled}
        onChange={this.onChange as any}
        selectable={!rest.files || rest.files.length < (isNaN(filesCountLimit) ? 1 : filesCountLimit)}
        {...rest}
      />
    );
  }
}
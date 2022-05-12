import React, { SyntheticEvent, useCallback, useContext } from 'react';
import { Button, DropZone, Heading, Stack, TextStyle } from '@shopify/polaris';
import { Media, MediaProps } from '@strapify/polaris-common';
import Context from '../context';
import { useRefreshable } from '../../hooks';
import uploadFiles from './uploadFiles';

type Props = {
  label: string;
  field: string;
  description?: string;
  placeholder?: string;
  mediaType: 'file' | 'image';
  accept?: string;
  multiple: boolean;
};

const StrapiMediaInput: React.FC<Props> = (attribute) => {
  const { form, setForm } = useContext(Context);
  const [files, refresh] = useRefreshable<MediaProps[]>(() => {
    if (form[attribute.field]) {
      if (!attribute.multiple) {
        // single file
        const file = form[attribute.field];
        return [
          {
            url: window.URL.createObjectURL(file),
            name: file.name,
            size: (file.size / 1024).toFixed(1),
            mime: file.type,
          },
        ];
      } else {
        // multiple files
        return form[attribute.field].map((file: File) => ({
          url: window.URL.createObjectURL(file),
          name: file.name,
          size: (file.size / 1024).toFixed(1),
          mime: file.type,
        }));
      }
    }
  });

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) => {
      if (!attribute.multiple) {
        // single file
        const file: File = acceptedFiles[0];
        setForm({ ...form, [attribute.field]: file });
        uploadFiles(file).then((fileDb) => {
          setForm({ ...form, [attribute.field]: fileDb.id });
        });
      } else {
        // multiple files
        const files: File[] = acceptedFiles;
        setForm({ ...form, [attribute.field]: files });
        uploadFiles(files).then((filesDb) => {
          setForm({ ...form, [attribute.field]: filesDb.map((x) => x.id) });
        });
      }
      refresh();
    },
    [form, setForm]
  );

  const handleOnRemove: any = (field: string, index: number) => {
    return (e: SyntheticEvent) => {
      e.stopPropagation();
      if (!attribute.multiple) {
        // single file
        setForm({ ...form, [field]: undefined });
      } else {
        // multiple files
        let files = form[field].filter((x: File, i: number) => i !== index);
        if (files.length === 0) files = undefined;
        setForm({ ...form, [field]: files });
      }
      refresh();
    };
  };

  return (
    <>
      <DropZone
        label={<Heading>{attribute.label}</Heading>}
        type={attribute.mediaType}
        accept={attribute.accept}
        allowMultiple={attribute.multiple}
        onDrop={handleDropZoneDrop}
        variableHeight
      >
        {!form[attribute.field] && <DropZone.FileUpload actionHint={attribute.placeholder} />}
        {form[attribute.field] && files && (
          <div style={{ padding: '1.5rem' }}>
            <Stack vertical>
              {files.map((file, index) => (
                <div key={index} style={{ display: 'flex' }}>
                  <div style={{ flex: '1 1 0' }}>
                    <Media url={file.url} name={file.name} size={file.size} mime={file.mime} />
                  </div>
                  <div style={{ position: 'relative', padding: '0.2rem 0', right: 0 }}>
                    <Button outline onClick={handleOnRemove(attribute.field, index)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </Stack>
          </div>
        )}
      </DropZone>
      {attribute.description && <TextStyle variation="subdued">{attribute.description}</TextStyle>}
    </>
  );
};

export default StrapiMediaInput;

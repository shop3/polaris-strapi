import React, { SyntheticEvent, useCallback, useContext, useEffect, useState } from 'react';
import { Button, DropZone, Heading, Spinner, Stack, TextStyle } from '@shopify/polaris';
import { Media, MediaProps } from '@shop3/polaris-common';
import _ from 'lodash';
import Context from '../context';
import fetchFiles from './fetchFiles';
import uploadFiles from './uploadFiles';
import { isFileDb, isFileDbArray, isId, isIdArray } from './types';

type Props = {
  label: string;
  field: string;
  description?: string;
  placeholder?: string;
  mediaType: 'file' | 'image';
  accept?: string;
  multiple: boolean;
};

type FilesState = Array<MediaProps & { id: number }>;

const StrapiMediaInput: React.FC<Props> = (attribute) => {
  const { form, setForm } = useContext(Context);
  const [files, setFiles] = useState<FilesState>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // handle initial value
  useEffect(() => {
    if (form[attribute.field]) {
      if (!attribute.multiple) {
        const file = form[attribute.field];
        if (isId(file)) {
          setLoading(true);
          fetchFiles(file).then((fileDb) => {
            setFiles([
              {
                id: fileDb.id,
                url: fileDb.url,
                name: fileDb.name,
                size: fileDb.size,
                mime: fileDb.mime,
              },
            ]);
            setLoading(false);
          });
        } else if (isFileDb(file)) {
          setFiles([
            {
              id: file.id,
              url: file.url,
              name: file.name,
              size: file.size,
              mime: file.mime,
            },
          ]);
        }
      } else {
        const files = form[attribute.field];
        if (isIdArray(files)) {
          setLoading(true);
          fetchFiles(files).then((filesDb) => {
            setFiles(
              filesDb.map((fileDb) => ({
                id: fileDb.id,
                url: fileDb.url,
                name: fileDb.name,
                size: fileDb.size,
                mime: fileDb.mime,
              }))
            );
            setLoading(false);
          });
        } else if (isFileDbArray(files)) {
          setFiles(
            files.map((file) => ({
              id: file.id,
              url: file.url,
              name: file.name,
              size: file.size,
              mime: file.mime,
            }))
          );
        }
      }
    }
  }, []);

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) => {
      if (!attribute.multiple) {
        // single file
        const fileToUpload: File = acceptedFiles[0];
        setLoading(true);
        uploadFiles(fileToUpload).then((fileDb) => {
          const newFile = {
            id: fileDb.id,
            url: fileDb.url,
            name: fileDb.name,
            size: fileDb.size,
            mime: fileDb.mime,
          };
          setFiles([newFile]);
          setForm({ ...form, [attribute.field]: newFile.id });
          setLoading(false);
        });
      } else {
        // multiple files
        const filesToUpload: File[] = acceptedFiles;
        setLoading(true);
        uploadFiles(filesToUpload).then((filesDb) => {
          const newFiles = filesDb.map((fileDb) => ({
            id: fileDb.id,
            url: fileDb.url,
            name: fileDb.name,
            size: fileDb.size,
            mime: fileDb.mime,
          }));
          setFiles(uniqueUnion(files, newFiles) || []);
          setForm({
            ...form,
            [attribute.field]: uniqueUnion(_.get(form, attribute.field), _.map(newFiles, 'id')),
          });
          setLoading(false);
        });
      }
    },
    [attribute, form, setForm, files, setFiles, setLoading]
  );

  const handleOnRemove: any = (field: string, index: number) => {
    return (e: SyntheticEvent) => {
      e.stopPropagation();
      if (!attribute.multiple) {
        // single file
        setFiles([]);
        setForm({ ...form, [field]: undefined });
      } else {
        // multiple files
        setFiles(removeAtIndex(files, index) || []);
        setForm({ ...form, [field]: removeAtIndex(form[field], index) });
      }
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
        {files && files.length === 0 && <DropZone.FileUpload actionHint={attribute.placeholder} />}
        {loading && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.5)',
              zIndex: 100,
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Spinner size="large" />
          </div>
        )}
        {files && files.length > 0 && (
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

function removeAtIndex<T>(array: T[] | undefined, index: number): T[] | undefined {
  if (!array || !Array.isArray(array)) return undefined;
  const result = array.filter((x, i) => i !== index);
  if (result.length === 0) return undefined;
  return result;
}

function uniqueUnion<T>(...arrays: Array<T[] | undefined>): T[] | undefined {
  const result = _.uniqWith(_.union(...arrays), _.isEqual);
  if (result.length === 0) return undefined;
  return result;
}

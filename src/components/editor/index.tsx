  import { Box, BoxProps } from '@mui/material';
  import EditorToolbar, {formats, redoChange, undoChange} from './EditorToolbar';
  import ReactQuill from 'react-quill-new';


  import { ReactNode, ComponentProps } from 'react';
  import { styled } from '@mui/material/styles';
  type ReactQuillProps = ComponentProps<typeof ReactQuill>;

  // ----------------------------------------------------------------------

  const RootStyle = styled(Box)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    border: `solid 1px ${theme.palette.grey[500_32]}`,
    '& .ql-container.ql-snow': {
      borderColor: 'transparent',
      ...theme.typography.body1,
      fontFamily: theme.typography.fontFamily,
    },
    '& .ql-editor': {
      minHeight: 200,
      maxHeight: 640,
      '&.ql-blank::before': {
        fontStyle: 'normal',
        color: theme.palette.text.disabled,
      },
      '& pre.ql-syntax': {
        ...theme.typography.body2,
        padding: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.grey[900],
      },
    },
  }));

  // ----------------------------------------------------------------------

  export interface Props extends ReactQuillProps {
    id?: string;
    error?: boolean;
    simple?: boolean;
    helperText?: ReactNode;
    sx?: BoxProps;
  }

  export default function Editor({
    id = 'minimal-quill',
    error,
    value,
    onChange,
    simple = false,
    helperText,
    sx,
    ...other
  }: Props) {
    const modules = {
      toolbar: {
        container: `#${id}`,
        handlers: {
          undo: undoChange,
          redo: redoChange,
        },
      },
      history: {
        delay: 500,
        maxStack: 100,
        userOnly: true,
      },
      syntax: true,
      clipboard: {
        matchVisual: false,
      },
    };

    return (
      <div>
        <RootStyle
          sx={{
            ...(error && {
              border: (theme) => `solid 1px ${theme.palette.error.main}`,
            }),
            ...sx,
          }}
        >
          <EditorToolbar id={id} isSimple={simple} />
          <ReactQuill
            value={value || ''}
            onChange={onChange || (() => {})}
            modules={modules}
            formats={formats}
            placeholder="Write something awesome..."
            {...other}
          />
        </RootStyle>

        {helperText && helperText}
      </div>
    );
  }

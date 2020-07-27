import { makeStyles } from '@material-ui/core';

export interface IDialogProps<T> {
  opened: boolean;
  item?: T;
  onComplete: (user: T) => void;
  onCancel: () => void;
}

export const useDialogStyle = makeStyles({
  content: {
    width: 600,
    maxWidth: 'calc(95vw - 50px)'
  },
  heading: {
    marginTop: 20,
    marginBottom: 10
  }
});

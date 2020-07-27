import React, { memo, useCallback, forwardRef } from 'react';
import IOrder from 'interfaces/models/order';
import {
  Dialog,
  Slide,
  LinearProgress,
  DialogTitle,
  DialogContent,
  Grid,
  Button,
  DialogActions
} from '@material-ui/core';
import { IDialogProps, useDialogStyle } from 'components/Shared/FormDialog/helper';
import { useFormikObservable } from 'hooks/useFormikObservable';
import orderService from 'services/order';
import { tap } from 'rxjs/operators';
import { logError } from 'helpers/rxjs-operators/logError';
import * as yup from 'yup';
import TextField from 'components/Shared/Fields/Text';

const validationSchema = yup.object().shape({
  description: yup.string().required().min(3).max(64)
});

const OrderFormDialog = memo((props: IDialogProps<IOrder>) => {
  const classes = useDialogStyle(props);

  const formik = useFormikObservable<IOrder>({
    validationSchema,
    onSubmit(model) {
      return orderService.save(model).pipe(
        tap(order => {
          props.onComplete(order);
        }),
        logError(true)
      );
    }
  });

  const handleEnter = useCallback(() => {
    formik.setValues(props.item ?? formik.initialValues, false);
  }, [formik, props.item]);

  const handleExit = useCallback(() => {
    formik.resetForm();
  }, [formik]);

  return (
    <Dialog
      open={props.opened}
      disableBackdropClick
      disableEscapeKeyDown
      onEnter={handleEnter}
      onExited={handleExit}
      TransitionComponent={Transition}
    >
      {formik.isSubmitting && <LinearProgress color='primary' />}

      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Novo Pedido</DialogTitle>
        <DialogContent className={classes.content}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label='Descrição' name='description' formik={formik} autoFocus={true} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onCancel}>Cancelar</Button>
          <Button color='primary' variant='contained' type='submit' disabled={formik.isSubmitting}>
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
});

const Transition = memo(
  forwardRef((props: any, ref: any) => {
    return <Slide direction='up' {...props} ref={ref} />;
  })
);

export default OrderFormDialog;

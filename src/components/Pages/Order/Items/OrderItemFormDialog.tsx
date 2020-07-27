import React, { memo, useCallback, forwardRef } from 'react';
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
import { tap } from 'rxjs/operators';
import { logError } from 'helpers/rxjs-operators/logError';
import * as yup from 'yup';
import TextField from 'components/Shared/Fields/Text';
import IOrderItem from 'interfaces/models/orderItem';
import orderItemService from 'services/orderItem';

const validationSchema = yup.object().shape({
  description: yup.string().required().min(3).max(64),
  quantity: yup.number().required().min(1),
  price: yup.number().required().min(0.01)
});

const OrderItemFormDialog = memo((props: IDialogProps<IOrderItem>) => {
  const classes = useDialogStyle(props);

  const formik = useFormikObservable<IOrderItem>({
    validationSchema,
    onSubmit(model) {
      model.price = Number(model.price);
      model.quantity = Number(model.quantity);

      return orderItemService.save(props.item.orderId, model).pipe(
        tap(orderItem => {
          props.onComplete(orderItem);
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
            <Grid item xs={12} sm={6}>
              <TextField label='Quantidade' name='quantity' formik={formik} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='Preço' name='price' formik={formik} />
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

export default OrderItemFormDialog;

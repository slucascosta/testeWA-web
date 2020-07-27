import React, { memo, useCallback, useState } from 'react';
import DataGrid from 'components/Shared/DataGrid';
import usePaginationObservable from 'hooks/usePagination';
import orderItemService from 'services/orderItem';
import DeleteIcon from 'mdi-react/DeleteIcon';
import { useCallbackObservable } from 'react-use-observable';
import IOrderItem from 'interfaces/models/orderItem';
import { from } from 'rxjs';
import Alert from 'components/Shared/Alert';
import { filter, switchMap, tap } from 'rxjs/operators';
import { logError } from 'helpers/rxjs-operators/logError';
import Toast from 'components/Shared/Toast';
import { Card, CardContent, Grid, Button, makeStyles } from '@material-ui/core';
import Toolbar from 'components/Layout/Toolbar';
import CardLoader from 'components/Shared/CardLoader';
import SearchField from 'components/Shared/Pagination/SearchField';
import OrderItemFormDialog from './OrderItemFormDialog';
import { Link } from 'react-router-dom';

const OrderItemsPage = memo((props: any) => {
  const orderId = props.match.params.id;
  const [formOpened, setFormOpened] = useState(false);

  const useStyle = makeStyles({
    goBack: {
      display: 'block',
      marginBottom: '10px'
    }
  });

  const classes = useStyle(props);

  const [params, mergeParams, loading, data, error, , refresh] = usePaginationObservable(
    params => orderItemService.list(orderId, params),
    { orderBy: 'description', orderDirection: 'asc' },
    []
  );

  const handleCreate = useCallback(() => {
    setFormOpened(true);
  }, []);

  const formCallback = useCallback(() => {
    setFormOpened(false);
    refresh();
  }, [refresh]);

  const formCancel = useCallback(() => setFormOpened(false), []);
  const handleRefresh = useCallback(() => refresh(), [refresh]);

  const [handleDelete] = useCallbackObservable((item: IOrderItem) => {
    return from(Alert.confirm(`Deseja excluir o item "${item.id} - ${item.description}?"`)).pipe(
      filter(ok => ok),
      switchMap(() => orderItemService.delete(orderId, item.id)),
      logError(),
      tap(
        () => {
          Toast.show(`O item ${item.id} - ${item.description} foi removido`);
          refresh();
        },
        () => Toast.error(`Erro ao excluir o item ${item.id}`)
      )
    );
  }, []);

  const columns = [
    { field: 'id', label: 'Id' },
    { field: 'description', label: 'Descrição' },
    { field: 'quantity', label: 'Quantidade' },
    { field: 'price', label: 'Preço' }
  ];

  const actions: any[] = [{ text: 'Remover', icon: DeleteIcon, handler: handleDelete }];

  const { total, results } = data || ({ total: 0, results: [] } as typeof data);

  return (
    <>
      <Toolbar title='Itens' />

      <Card>
        <OrderItemFormDialog
          item={{ orderId } as IOrderItem}
          opened={formOpened}
          onComplete={formCallback}
          onCancel={formCancel}
        />

        <CardLoader show={loading} />

        <CardContent>
          <Link to={'/pedidos'} className={classes.goBack} onClick={handleCreate}>
            Voltar
          </Link>
          <Grid container justify='space-between' alignItems='center' spacing={2}>
            <Grid item xs={12} sm={6} lg={4}>
              <SearchField paginationParams={params} onChange={mergeParams} />
            </Grid>

            <Grid item xs={12} sm={'auto'}>
              <Button fullWidth variant='contained' color='primary' onClick={handleCreate}>
                Adicionar
              </Button>
            </Grid>
          </Grid>
        </CardContent>

        <DataGrid
          params={params}
          loading={loading}
          mergeParams={mergeParams}
          handleRefresh={handleRefresh}
          columns={columns}
          error={error}
          results={results}
          refresh={refresh}
          total={total}
          actions={actions}
        />
      </Card>
    </>
  );
});

export default OrderItemsPage;

import React, { memo, useCallback, useState } from 'react';
import { Card, CardContent, Grid, Button } from '@material-ui/core';

import CardLoader from 'components/Shared/CardLoader';
import usePaginationObservable from 'hooks/usePagination';
import orderService from 'services/order';
import SearchField from 'components/Shared/Pagination/SearchField';
import IOrder from 'interfaces/models/order';
import DataGrid from 'components/Shared/DataGrid';
import ViewListIcon from 'mdi-react/ViewListIcon';
import { useHistory } from 'react-router-dom';
import DeleteIcon from 'mdi-react/DeleteIcon';
import { useCallbackObservable } from 'react-use-observable';
import { from } from 'rxjs';
import Alert from 'components/Shared/Alert';
import { filter, tap, switchMap } from 'rxjs/operators';
import { logError } from 'helpers/rxjs-operators/logError';
import Toast from 'components/Shared/Toast';
import Toolbar from 'components/Layout/Toolbar';
import OrderFormDialog from './OrderFormDialog';

const OrderListPage = memo(() => {
  const [formOpened, setFormOpened] = useState(false);

  const [params, mergeParams, loading, data, error, , refresh] = usePaginationObservable(
    params => orderService.list(params),
    { orderBy: 'id', orderDirection: 'desc' },
    []
  );

  const handleCreate = useCallback(() => {
    setFormOpened(true);
  }, []);

  const history = useHistory();
  const handleSeeItems = useCallback(
    (order: IOrder) => {
      history.push(`pedidos/${order.id}/itens`);
    },
    [history]
  );

  const formCallback = useCallback(
    (order?: IOrder) => {
      setFormOpened(false);
      handleSeeItems(order);
    },
    [handleSeeItems]
  );

  const formCancel = useCallback(() => setFormOpened(false), []);
  const handleRefresh = useCallback(() => refresh(), [refresh]);

  const [handleDelete] = useCallbackObservable((order: IOrder) => {
    return from(Alert.confirm(`Deseja excluir o pedido "${order.id} - ${order.description}?"`)).pipe(
      filter(ok => ok),
      switchMap(() => orderService.delete(order.id)),
      logError(),
      tap(
        () => {
          Toast.show(`O pedido ${order.id} - ${order.description} foi removido`);
          refresh();
        },
        () => Toast.error(`Erro ao excluir o pedido ${order.id}`)
      )
    );
  }, []);

  const columns = [
    { field: 'id', label: 'Id' },
    { field: 'description', label: 'Descrição' },
    { field: 'total', label: 'Valor total' },
    { field: 'createdDateFormated', label: 'Data de criação' }
  ];

  const actions: any[] = [
    { text: 'Itens', icon: ViewListIcon, handler: handleSeeItems },
    { text: 'Remover', icon: DeleteIcon, handler: handleDelete }
  ];

  const { total, results } = data || ({ total: 0, results: [] } as typeof data);

  return (
    <>
      <Toolbar title='Pedidos' />

      <Card>
        <OrderFormDialog opened={formOpened} onComplete={formCallback} onCancel={formCancel} />

        <CardLoader show={loading} />

        <CardContent>
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

export default OrderListPage;

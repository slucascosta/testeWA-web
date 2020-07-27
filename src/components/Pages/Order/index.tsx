import React, { memo } from 'react';
import { Switch, Route } from 'react-router-dom';

import OrderListPage from './List';
import OrderItemsPage from './Items';

const OrderIndexPage = memo(() => {
  return (
    <Switch>
      <Route path='/pedidos/:id/itens' component={OrderItemsPage} />
      <Route path='/pedidos' component={OrderListPage} />
    </Switch>
  );
});

export default OrderIndexPage;

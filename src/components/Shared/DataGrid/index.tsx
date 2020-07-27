import React from 'react';
import TableWrapper from '../TableWrapper';
import { Table, TableHead, TableRow, IconButton, TableBody, TableCell } from '@material-ui/core';
import TablePagination from 'components/Shared/Pagination/TablePagination';
import TableCellSortable from '../Pagination/TableCellSortable';
import TableCellActions from '../Pagination/TableCellActions';
import RefreshIcon from 'mdi-react/RefreshIcon';
import EmptyAndErrorMessages from '../Pagination/EmptyAndErrorMessages';

import { IDataGridProps } from './props';

const DataGrid = function (props: IDataGridProps) {
  const getOptions = (item: any) =>
    props.actions.map(action => {
      return { text: action.text, icon: action.icon, handler: () => action.handler(item) };
    });

  return (
    <>
      <TableWrapper minWidth={500}>
        <Table>
          <TableHead>
            <TableRow>
              {props.columns.map((col, i) => {
                return (
                  <TableCellSortable
                    key={i}
                    paginationParams={props.params}
                    disabled={props.loading}
                    onChange={props.mergeParams}
                    column={col.field}
                  >
                    {col.label}
                  </TableCellSortable>
                );
              })}

              <TableCellActions>
                <IconButton disabled={props.loading} onClick={props.handleRefresh}>
                  <RefreshIcon />
                </IconButton>
              </TableCellActions>
            </TableRow>
          </TableHead>
          <TableBody>
            <EmptyAndErrorMessages
              colSpan={4}
              error={props.error}
              loading={props.loading}
              hasData={props.results.length > 0}
              onTryAgain={props.refresh}
            />

            {props.results.length
              ? props.results.map((item: any) => (
                  <TableRow key={item.id}>
                    {props.columns.map((col, ic) => (
                      <TableCell key={ic}>{item[col.field].toString()}</TableCell>
                    ))}
                    {props.actions && (
                      <TableCellActions
                        options={getOptions(item)}
                        loading={props.loading}
                        error={props.error}
                        onDismissError={props.handleDismissError}
                      />
                    )}
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </TableWrapper>

      <TablePagination
        total={props.total}
        disabled={props.loading}
        paginationParams={props.params}
        onChange={props.mergeParams}
      />
    </>
  );
};

export default DataGrid;

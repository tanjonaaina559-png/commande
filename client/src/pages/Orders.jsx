import React, { useEffect, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Search, Eye, Trash2, FileText } from 'lucide-react';
import { orderService } from '../services/api';
import { format } from 'date-fns';
import { generatePDF } from '../utils/pdfGenerator';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    orderService.getAll().then((res) => {
      setOrders(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette commande ?')) {
      orderService.delete(id).then(() => {
        setOrders(orders.filter((o) => o.id !== id));
      });
    }
  };

  const handleGeneratePDF = async (id) => {
    const res = await orderService.getById(id);
    generatePDF({ ...res.data, client_name: res.data.client_name });
  };

  const columns = [
    { accessorKey: 'client_name', header: 'Client' },
    { accessorKey: 'type_tshirt', header: 'Type' },
    { accessorKey: 'couleur', header: 'Couleur' },
    {
      accessorKey: 'total',
      header: 'Total (Ar)',
      cell: ({ getValue }) => getValue()?.toLocaleString(),
    },
    {
      accessorKey: 'avance',
      header: 'Avance (Ar)',
      cell: ({ getValue }) => getValue()?.toLocaleString(),
    },
    {
      accessorKey: 'reste',
      header: 'Reste (Ar)',
      cell: ({ row, getValue }) => (
        <span className={parseFloat(getValue()) > 0 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
          {getValue()?.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ getValue }) => {
        try { return format(new Date(getValue()), 'dd/MM/yyyy'); } catch { return getValue(); }
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-1">
          <button
            onClick={() => handleGeneratePDF(row.original.id)}
            className="p-2 hover:bg-green-50 rounded text-green-600 transition-colors"
            title="Générer PDF"
          >
            <FileText size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="p-2 hover:bg-red-50 rounded text-red-500 transition-colors"
            title="Supprimer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: orders,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Commandes</h1>
          <p className="text-gray-500">{orders.length} commande(s) au total</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              className="border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Rechercher..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
          <button
            onClick={() => navigate('/orders/new')}
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            + Nouvelle Commande
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-4 py-3 font-semibold text-gray-600 uppercase tracking-wider text-xs cursor-pointer select-none"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{ asc: ' ↑', desc: ' ↓' }[header.column.getIsSorted()] ?? ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-gray-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && !loading && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium italic">Aucune commande trouvée.</p>
            <p className="text-sm mt-1">Cliquez sur "+ Nouvelle Commande" pour commencer.</p>
          </div>
        )}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

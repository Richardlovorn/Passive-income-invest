import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, X, DollarSign } from 'lucide-react';
import { alpacaAPI } from '@/lib/alpaca';

interface Props {
  positions: any[];
  orders: any[];
  onRefresh: () => void;
}

export default function PositionsManager({ positions, orders, onRefresh }: Props) {
  const [closing, setClosing] = useState<string[]>([]);

  const closePosition = async (symbol: string, qty: string, side: string) => {
    if (!confirm(`Close position for ${symbol}?`)) return;
    
    setClosing([...closing, symbol]);
    
    try {
      await alpacaAPI.createOrder({
        symbol,
        qty: Math.abs(Number(qty)),
        side: side === 'long' ? 'sell' : 'buy',
        type: 'market',
        time_in_force: 'day'
      });
      
      setTimeout(onRefresh, 2000);
    } catch (err: any) {
      alert('Failed to close position: ' + err.message);
    } finally {
      setClosing(closing.filter(s => s !== symbol));
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      await alpacaAPI.cancelOrder(orderId);
      onRefresh();
    } catch (err: any) {
      alert('Failed to cancel order: ' + err.message);
    }
  };

  const totalPL = positions.reduce((sum, p) => sum + parseFloat(p.unrealized_pl), 0);
  const totalValue = positions.reduce((sum, p) => sum + parseFloat(p.market_value), 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positions.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              ${totalValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Unrealized P/L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${totalPL.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Positions Table */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle>Current Positions</CardTitle>
        </CardHeader>
        <CardContent>
          {positions.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No open positions</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Avg Price</TableHead>
                  <TableHead>Current</TableHead>
                  <TableHead>P/L</TableHead>
                  <TableHead>P/L %</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.map((position) => {
                  const pl = parseFloat(position.unrealized_pl);
                  const plPercent = parseFloat(position.unrealized_plpc) * 100;
                  
                  return (
                    <TableRow key={position.asset_id}>
                      <TableCell className="font-medium">{position.symbol}</TableCell>
                      <TableCell>{position.qty}</TableCell>
                      <TableCell>${parseFloat(position.avg_entry_price).toFixed(2)}</TableCell>
                      <TableCell>${parseFloat(position.current_price).toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={pl >= 0 ? 'text-green-400' : 'text-red-400'}>
                          ${pl.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={pl >= 0 ? 'default' : 'destructive'}>
                          {pl >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                          {plPercent.toFixed(2)}%
                        </Badge>
                      </TableCell>
                      <TableCell>${parseFloat(position.market_value).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => closePosition(position.symbol, position.qty, position.side)}
                          disabled={closing.includes(position.symbol)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Close
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Open Orders */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle>Open Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No open orders</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Side</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.symbol}</TableCell>
                    <TableCell>
                      <Badge variant={order.side === 'buy' ? 'default' : 'destructive'}>
                        {order.side.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.order_type}</TableCell>
                    <TableCell>{order.qty}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => cancelOrder(order.id)}
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
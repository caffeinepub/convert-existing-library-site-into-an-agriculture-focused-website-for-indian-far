import { useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { useGetMandiPrices, useAddMandiPrice, useUpdateMandiPrice, useDeleteMandiPrice } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { MandiPrice, PriceId } from '../../backend';

export default function MandiPricesManagement() {
  const { t } = useI18n();
  const { data: prices = [] } = useGetMandiPrices();
  const addPrice = useAddMandiPrice();
  const updatePrice = useUpdateMandiPrice();
  const deletePrice = useDeleteMandiPrice();

  const [showDialog, setShowDialog] = useState(false);
  const [editingPrice, setEditingPrice] = useState<MandiPrice | null>(null);
  const [crop, setCrop] = useState('');
  const [priceValue, setPriceValue] = useState('');
  const [location, setLocation] = useState('');

  const openAddDialog = () => {
    setEditingPrice(null);
    setCrop('');
    setPriceValue('');
    setLocation('');
    setShowDialog(true);
  };

  const openEditDialog = (price: MandiPrice) => {
    setEditingPrice(price);
    setCrop(price.crop);
    setPriceValue(price.price.toString());
    setLocation(price.location);
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    if (!crop.trim() || !priceValue.trim() || !location.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const priceNum = parseInt(priceValue, 10);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      if (editingPrice) {
        await updatePrice.mutateAsync({
          id: editingPrice.id,
          crop: crop.trim(),
          price: BigInt(priceNum),
          location: location.trim(),
        });
        toast.success('Price updated successfully');
      } else {
        await addPrice.mutateAsync({
          crop: crop.trim(),
          price: BigInt(priceNum),
          location: location.trim(),
        });
        toast.success('Price added successfully');
      }
      setShowDialog(false);
    } catch (error) {
      toast.error('Operation failed');
      console.error(error);
    }
  };

  const handleDelete = async (id: PriceId) => {
    if (!confirm('Are you sure you want to delete this price entry?')) return;

    try {
      await deletePrice.mutateAsync(id);
      toast.success('Price deleted successfully');
    } catch (error) {
      toast.error('Failed to delete price');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('manageMandiPrices')}</CardTitle>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              {t('add')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPrice ? t('edit') : t('add')} Mandi Price</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="crop">{t('crop')}</Label>
                <Input
                  id="crop"
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  placeholder="Wheat, Rice, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">{t('price')} (₹/quintal)</Label>
                <Input
                  id="price"
                  type="number"
                  value={priceValue}
                  onChange={(e) => setPriceValue(e.target.value)}
                  placeholder="2000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">{t('location')}</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Delhi, Mumbai, etc."
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={addPrice.isPending || updatePrice.isPending}
                className="w-full"
              >
                {addPrice.isPending || updatePrice.isPending ? t('loading') : t('save')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {prices.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">{t('noData')}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('crop')}</TableHead>
                <TableHead>{t('price')}</TableHead>
                <TableHead>{t('location')}</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prices.map((price) => (
                <TableRow key={price.id.toString()}>
                  <TableCell className="font-medium">{price.crop}</TableCell>
                  <TableCell>₹{price.price.toString()}/quintal</TableCell>
                  <TableCell>{price.location}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(price)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(price.id)}
                        disabled={deletePrice.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

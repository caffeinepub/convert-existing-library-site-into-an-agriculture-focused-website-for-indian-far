import { useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { useGetCropAdvisories, useAddCropAdvisory, useUpdateCropAdvisory, useDeleteCropAdvisory } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { CropAdvisory, AdvisoryId } from '../../backend';

export default function CropAdvisoriesManagement() {
  const { t } = useI18n();
  const { data: advisories = [] } = useGetCropAdvisories();
  const addAdvisory = useAddCropAdvisory();
  const updateAdvisory = useUpdateCropAdvisory();
  const deleteAdvisory = useDeleteCropAdvisory();

  const [showDialog, setShowDialog] = useState(false);
  const [editingAdvisory, setEditingAdvisory] = useState<CropAdvisory | null>(null);
  const [crop, setCrop] = useState('');
  const [guidance, setGuidance] = useState('');
  const [season, setSeason] = useState('');

  const openAddDialog = () => {
    setEditingAdvisory(null);
    setCrop('');
    setGuidance('');
    setSeason('');
    setShowDialog(true);
  };

  const openEditDialog = (advisory: CropAdvisory) => {
    setEditingAdvisory(advisory);
    setCrop(advisory.crop);
    setGuidance(advisory.guidance);
    setSeason(advisory.season);
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    if (!crop.trim() || !guidance.trim() || !season.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (editingAdvisory) {
        await updateAdvisory.mutateAsync({
          id: editingAdvisory.id,
          crop: crop.trim(),
          guidance: guidance.trim(),
          season: season.trim(),
        });
        toast.success('Advisory updated successfully');
      } else {
        await addAdvisory.mutateAsync({
          crop: crop.trim(),
          guidance: guidance.trim(),
          season: season.trim(),
        });
        toast.success('Advisory added successfully');
      }
      setShowDialog(false);
    } catch (error) {
      toast.error('Operation failed');
      console.error(error);
    }
  };

  const handleDelete = async (id: AdvisoryId) => {
    if (!confirm('Are you sure you want to delete this advisory?')) return;

    try {
      await deleteAdvisory.mutateAsync(id);
      toast.success('Advisory deleted successfully');
    } catch (error) {
      toast.error('Failed to delete advisory');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('manageCropAdvisories')}</CardTitle>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              {t('add')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAdvisory ? t('edit') : t('add')} Crop Advisory</DialogTitle>
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
                <Label htmlFor="season">{t('season')}</Label>
                <Input
                  id="season"
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  placeholder="Kharif, Rabi, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guidance">{t('guidance')}</Label>
                <Textarea
                  id="guidance"
                  value={guidance}
                  onChange={(e) => setGuidance(e.target.value)}
                  placeholder="Step-by-step cultivation guidance..."
                  rows={6}
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={addAdvisory.isPending || updateAdvisory.isPending}
                className="w-full"
              >
                {addAdvisory.isPending || updateAdvisory.isPending ? t('loading') : t('save')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {advisories.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">{t('noData')}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('crop')}</TableHead>
                <TableHead>{t('season')}</TableHead>
                <TableHead>{t('guidance')}</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {advisories.map((advisory) => (
                <TableRow key={advisory.id.toString()}>
                  <TableCell className="font-medium">{advisory.crop}</TableCell>
                  <TableCell>{advisory.season}</TableCell>
                  <TableCell className="max-w-md truncate">{advisory.guidance}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(advisory)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(advisory.id)}
                        disabled={deleteAdvisory.isPending}
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

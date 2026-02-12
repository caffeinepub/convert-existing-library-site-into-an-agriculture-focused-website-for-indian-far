import { useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { useGetGovernmentSchemes, useAddGovernmentScheme, useUpdateGovernmentScheme, useDeleteGovernmentScheme } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { GovernmentScheme, SchemeId } from '../../backend';

export default function GovernmentSchemesManagement() {
  const { t } = useI18n();
  const { data: schemes = [] } = useGetGovernmentSchemes();
  const addScheme = useAddGovernmentScheme();
  const updateScheme = useUpdateGovernmentScheme();
  const deleteScheme = useDeleteGovernmentScheme();

  const [showDialog, setShowDialog] = useState(false);
  const [editingScheme, setEditingScheme] = useState<GovernmentScheme | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [eligibility, setEligibility] = useState('');

  const openAddDialog = () => {
    setEditingScheme(null);
    setName('');
    setDescription('');
    setEligibility('');
    setShowDialog(true);
  };

  const openEditDialog = (scheme: GovernmentScheme) => {
    setEditingScheme(scheme);
    setName(scheme.name);
    setDescription(scheme.description);
    setEligibility(scheme.eligibility);
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim() || !eligibility.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (editingScheme) {
        await updateScheme.mutateAsync({
          id: editingScheme.id,
          name: name.trim(),
          description: description.trim(),
          eligibility: eligibility.trim(),
        });
        toast.success('Scheme updated successfully');
      } else {
        await addScheme.mutateAsync({
          name: name.trim(),
          description: description.trim(),
          eligibility: eligibility.trim(),
        });
        toast.success('Scheme added successfully');
      }
      setShowDialog(false);
    } catch (error) {
      toast.error('Operation failed');
      console.error(error);
    }
  };

  const handleDelete = async (id: SchemeId) => {
    if (!confirm('Are you sure you want to delete this scheme?')) return;

    try {
      await deleteScheme.mutateAsync(id);
      toast.success('Scheme deleted successfully');
    } catch (error) {
      toast.error('Failed to delete scheme');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('manageSchemes')}</CardTitle>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              {t('add')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingScheme ? t('edit') : t('add')} Government Scheme</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Scheme Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="PM-KISAN, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t('description')}</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Scheme details..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eligibility">{t('eligibility')}</Label>
                <Textarea
                  id="eligibility"
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  placeholder="Who can apply..."
                  rows={3}
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={addScheme.isPending || updateScheme.isPending}
                className="w-full"
              >
                {addScheme.isPending || updateScheme.isPending ? t('loading') : t('save')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {schemes.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">{t('noData')}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scheme Name</TableHead>
                <TableHead>{t('description')}</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schemes.map((scheme) => (
                <TableRow key={scheme.id.toString()}>
                  <TableCell className="font-medium">{scheme.name}</TableCell>
                  <TableCell className="max-w-md truncate">{scheme.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(scheme)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(scheme.id)}
                        disabled={deleteScheme.isPending}
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

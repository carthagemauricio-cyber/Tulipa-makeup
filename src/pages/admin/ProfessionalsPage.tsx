import { useState } from 'react';
import { useAppStore } from '../../store/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Trash2, Edit, User } from 'lucide-react';
import { Professional } from '../../types';

export default function ProfessionalsPage() {
  const { professionals, addProfessional, updateProfessional, deleteProfessional } = useAppStore();
  const [formData, setFormData] = useState<Partial<Professional>>({ name: '', photoUrl: '', serviceIds: [], schedule: [1,2,3,4,5].map(d=>({dayOfWeek:d, isAvailable:true})) });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = () => {
    if (!formData.name) return;
    if (editingId) {
      updateProfessional(editingId, formData);
      setEditingId(null);
    } else {
      addProfessional(formData as any);
    }
    setFormData({ name: '', photoUrl: '', serviceIds: [], schedule: [1,2,3,4,5].map(d=>({dayOfWeek:d, isAvailable:true})) });
  };

  const handleEdit = (p: Professional) => {
    setEditingId(p.id);
    setFormData(p);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold text-white mb-6">Equipe</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-fit">
          <h2 className="text-xl font-serif font-bold text-white mb-4">{editingId ? 'Editar Profissional' : 'Novo Profissional'}</h2>
          <div className="space-y-4">
            <Input label="Nome" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
            <Input label="URL da Foto" value={formData.photoUrl || ''} onChange={e => setFormData({...formData, photoUrl: e.target.value})} />
            <div className="flex gap-2">
              <Button onClick={handleSave} fullWidth>{editingId ? 'Salvar' : 'Adicionar'}</Button>
              {editingId && <Button variant="ghost" onClick={() => { setEditingId(null); setFormData({ name: '', photoUrl: '', serviceIds: [], schedule: [] }); }}>Cancelar</Button>}
            </div>
          </div>
        </Card>
        <div className="md:col-span-2 space-y-4">
          {professionals.map(p => (
            <Card key={p.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#2a1d35] rounded-full overflow-hidden flex items-center justify-center text-accent-pink border-2 border-border-theme">
                  {p.photoUrl ? <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" /> : <User className="w-8 h-8" />}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">{p.name}</h3>
                  <p className="text-sm text-text-muted">{p.serviceIds.length} serviços atribuídos</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => handleEdit(p)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="danger" onClick={() => deleteProfessional(p.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

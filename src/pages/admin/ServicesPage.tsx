import { useState } from 'react';
import { useAppStore } from '../../store/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Scissors, Trash2, Edit } from 'lucide-react';
import { Service } from '../../types';

export default function ServicesPage() {
  const { services, addService, updateService, deleteService } = useAppStore();
  const [formData, setFormData] = useState<Partial<Service>>({ name: '', durationMinutes: 60, price: 1000, description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = () => {
    if (!formData.name) return;
    if (editingId) {
      updateService(editingId, formData);
      setEditingId(null);
    } else {
      addService(formData as any);
    }
    setFormData({ name: '', durationMinutes: 60, price: 1000, description: '' });
  };

  const handleEdit = (s: Service) => {
    setEditingId(s.id);
    setFormData(s);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold text-white mb-6">Serviços</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-fit">
          <h2 className="text-xl font-serif font-bold text-white mb-4">{editingId ? 'Editar Serviço' : 'Novo Serviço'}</h2>
          <div className="space-y-4">
            <Input label="Nome" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
            <Input type="number" label="Duração (min)" value={formData.durationMinutes || ''} onChange={e => setFormData({...formData, durationMinutes: parseInt(e.target.value) || 0})} />
            <Input type="number" label="Preço (MZN)" value={formData.price || ''} onChange={e => setFormData({...formData, price: parseInt(e.target.value) || 0})} />
            <Input label="Descrição" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
            <div className="flex gap-2">
              <Button onClick={handleSave} fullWidth>{editingId ? 'Salvar' : 'Adicionar'}</Button>
              {editingId && <Button variant="ghost" onClick={() => { setEditingId(null); setFormData({ name: '', durationMinutes: 60, price: 1000, description: '' }); }}>Cancelar</Button>}
            </div>
          </div>
        </Card>
        <div className="md:col-span-2 space-y-4">
          {services.map(s => (
            <Card key={s.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#2a1d35] rounded-full flex items-center justify-center text-accent-pink">
                  <Scissors className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">{s.name}</h3>
                  <p className="text-sm text-text-muted">{s.durationMinutes} min • {s.price} MZN</p>
                  {s.description && <p className="text-xs text-text-muted mt-1">{s.description}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => handleEdit(s)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="danger" onClick={() => deleteService(s.id)}>
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

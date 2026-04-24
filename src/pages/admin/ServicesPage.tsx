import React, { useState } from 'react';
import { useAppStore } from '../../store/AppContext';
import { Card, AnimatedCard } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Trash2, Edit2 } from 'lucide-react';
import { Service } from '../../types';

export default function ServicesPage() {
  const { services, addService, updateService, removeService } = useAppStore();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<Service, 'id'>>({
    name: '',
    durationMinutes: 60,
    price: 1000,
    icon: 'scissors'
  });

  const handleSave = () => {
    if (!formData.name) return;
    
    if (isEditing) {
      updateService(isEditing, formData);
      setIsEditing(null);
    } else {
      addService(formData);
    }
    
    setFormData({ name: '', durationMinutes: 60, price: 1000, icon: 'scissors' });
  };

  const handleEdit = (s: Service) => {
    setFormData(s);
    setIsEditing(s.id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-medium text-gray-900">Serviços</h1>
        <p className="text-gray-500 mt-1">Gerencie os serviços oferecidos.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-fit">
          <h2 className="text-lg font-medium mb-4">{isEditing ? 'Editar Serviço' : 'Adicionar Serviço'}</h2>
          <div className="space-y-4">
            <Input 
              label="Nome do Serviço" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
            <Input 
              label="Duração (Minutos)" 
              type="number"
              value={formData.durationMinutes} 
              onChange={e => setFormData({...formData, durationMinutes: parseInt(e.target.value) || 0})} 
            />
            <Input 
              label="Preço (MZN)" 
              type="number"
              value={formData.price} 
              onChange={e => setFormData({...formData, price: parseInt(e.target.value) || 0})} 
            />

            <Button fullWidth onClick={handleSave} className="mt-4">
              {isEditing ? 'Salvar Alterações' : 'Adicionar'}
            </Button>
            {isEditing && (
              <Button fullWidth variant="ghost" onClick={() => {
                setIsEditing(null);
                setFormData({ name: '', durationMinutes: 60, price: 1000, icon: 'scissors' });
              }}>
                Cancelar
              </Button>
            )}
          </div>
        </Card>

        <div className="md:col-span-2 space-y-4">
          {services.map((s, i) => (
            <AnimatedCard key={s.id} delay={i * 0.1} className="flex flex-col sm:flex-row gap-4 justify-between p-4">
              <div>
                <h3 className="font-medium text-gray-900 text-lg">{s.name}</h3>
                <p className="text-sm text-gray-500">
                  {s.durationMinutes} minutos • {(s.price).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                </p>
              </div>
              <div className="flex items-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 pb-1">
                <Button size="sm" variant="outline" onClick={() => handleEdit(s)}>
                  <Edit2 className="w-4 h-4 mr-1" /> Editar
                </Button>
                <Button size="sm" variant="danger" onClick={() => removeService(s.id)}>
                  <Trash2 className="w-4 h-4 mr-1" /> Remover
                </Button>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { AnimatedCard } from '../../components/ui/Card';
import { CheckCircle2 } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="max-w-xl mx-auto py-12">
      <AnimatedCard className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-serif text-gray-900 mb-4">Agendamento Confirmado!</h1>
        <p className="text-gray-600 mb-8 max-w-sm mx-auto">
          Seu horário foi reservado com sucesso no Tulipa Hair. Entraremos em contato em breve para confirmar os detalhes.
        </p>
        <Link to="/">
          <Button variant="outline">Fazer novo agendamento</Button>
        </Link>
      </AnimatedCard>
    </div>
  );
}

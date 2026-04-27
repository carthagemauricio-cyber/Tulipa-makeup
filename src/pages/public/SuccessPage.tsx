import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { AnimatedCard } from '../../components/ui/Card';
import { CheckCircle2, Copy } from 'lucide-react';

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      alert('Código copiado!');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12">
      <AnimatedCard className="text-center py-12 px-6">
        <div className="w-20 h-20 bg-[rgba(34,197,94,0.15)] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-serif text-white mb-4">Solicitação Recebida!</h1>
        <p className="text-text-muted mb-6 max-w-sm mx-auto">
          Sua solicitação de agendamento foi recebida com sucesso.
        </p>

        {code && (
          <div className="bg-[#334155] border border-border-theme rounded-2xl p-6 mb-8 max-w-sm mx-auto">
            <p className="text-[12px] uppercase tracking-wider font-semibold text-text-muted mb-2">Seu Código de Acompanhamento</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl font-mono font-bold text-accent-pink tracking-widest">{code}</span>
              <button onClick={handleCopy} className="text-text-muted hover:text-white transition-colors" title="Copiar código">
                <Copy className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-text-muted mt-4">
              Guarde este código para acompanhar o status do seu agendamento no painel do cliente.
            </p>
            <Link to="/track" className="block mt-4 text-sm text-accent-pink hover:underline">
              Acompanhar meu agendamento agora &rarr;
            </Link>
          </div>
        )}

        <Link to="/">
          <Button variant="outline">Voltar ao Início</Button>
        </Link>
      </AnimatedCard>
    </div>
  );
}

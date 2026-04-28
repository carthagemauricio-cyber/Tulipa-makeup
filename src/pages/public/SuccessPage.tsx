import { useLocation, Link, Navigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { motion } from 'motion/react';

export default function SuccessPage() {
  const location = useLocation();
  const state = location.state as { bookingCode: string };

  if (!state?.bookingCode) {
    return <Navigate to="/" />;
  }

  return (
    <div className="max-w-2xl mx-auto py-20 px-4 text-center">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#1c1524] p-10 rounded-3xl border border-border-theme shadow-2xl">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
        <h1 className="text-4xl font-serif font-bold text-white mb-4">Reserva Confirmada!</h1>
        <p className="text-text-muted mb-8 text-lg">Use o código abaixo para acompanhar o status da sua reserva.</p>
        <div className="bg-[#2a1d35] p-6 rounded-2xl mb-8 border border-border-theme inline-block">
          <p className="text-sm text-text-muted uppercase tracking-wider mb-2 font-bold">Código de Reserva</p>
          <p className="text-5xl font-mono tracking-widest text-accent-pink font-bold">{state.bookingCode}</p>
        </div>
        <div className="space-y-4">
          <Link to="/track"><Button fullWidth>Acompanhar Status</Button></Link>
          <Link to="/"><Button variant="ghost" fullWidth>Voltar ao Início</Button></Link>
        </div>
      </motion.div>
    </div>
  );
}

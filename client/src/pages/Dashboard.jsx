import React, { useEffect, useState } from 'react';
import { ShoppingCart, Banknote, Clock, TrendingUp } from 'lucide-react';
import { orderService } from '../services/api';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="card flex items-center space-x-4 border-l-4 border-primary"
    style={{ borderLeftColor: color.includes('primary') ? '#2E7D32' : color.replace('bg-', '') }}
  >
    <div className={`p-4 rounded-xl ${color} text-white shadow-lg`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-black text-gray-800 tracking-tight">
        {typeof value === 'number' ? value.toLocaleString() : value} Ar
      </p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ orderCount: 0, totalSales: 0, totalRemaining: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getStats()
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <motion.header 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Bonjour, 👋</h1>
          <p className="text-gray-500 text-lg">Voici un aperçu de votre activité aujourd'hui.</p>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Commandes"
          value={stats.orderCount}
          icon={<ShoppingCart size={24} />}
          color="bg-blue-600"
          delay={0.1}
        />
        <StatCard
          title="Ventes Totales"
          value={stats.totalSales}
          icon={<TrendingUp size={24} />}
          color="bg-primary"
          delay={0.2}
        />
        <StatCard
          title="Dettes Clients"
          value={stats.totalRemaining}
          icon={<Clock size={24} />}
          color="bg-red-600"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Activités Récentes</h2>
          {/* Recent activities would go here */}
          <p className="text-gray-500 italic">Aucune activité récente pour le moment.</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Ventes par Type</h2>
          <div className="space-y-4">
             {/* Charts or progress bars */}
             <p className="text-gray-500 italic text-sm">Les graphiques seront disponibles bientôt.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import { clientService } from '../services/api';
import { Search, User, Phone, MapPin } from 'lucide-react';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    clientService.getAll().then(res => {
      setClients(res.data);
      setLoading(false);
    });
  }, []);

  const filteredClients = clients.filter(c => 
    c.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.telephone?.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Nos Clients</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            className="input-field pl-10"
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map(client => (
          <div key={client.id} className="card hover:shadow-md transition-all group">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-primary font-bold text-xl group-hover:bg-primary group-hover:text-white transition-colors">
                {client.nom.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">{client.nom}</h3>
                <div className="flex items-center text-sm text-gray-500">
                   <Phone size={14} className="mr-1" />
                   {client.telephone || 'Non renseigné'}
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
               <span className="text-xs text-gray-400">Inscrit le {new Date(client.created_at).toLocaleDateString()}</span>
               <button className="text-sm font-semibold text-primary hover:underline italic">Voir historique</button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredClients.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">Aucun client trouvé.</div>
      )}
    </div>
  );
};

export default Clients;

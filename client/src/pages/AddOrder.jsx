import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { TSHIRT_TYPES, SIZES, PRICES, ALL_SIZES } from '../utils/constants';
import { orderService, clientService } from '../services/api';
import { Save, ChevronDown } from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator';

const buildInitialItems = (type) =>
  ALL_SIZES.map((s) => ({
    taille: s,
    quantite: 0,
    prix: PRICES[type]?.[s] || 0,
    total: 0,
  }));

const AddOrder = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [isNewClient, setIsNewClient] = useState(true);
  const [items, setItems] = useState(buildInitialItems('vraie coton'));
  const [avance, setAvance] = useState(0);
  const [selectedType, setSelectedType] = useState('vraie coton');

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      client_id: '',
      nom_client: '',
      telephone_client: '',
      type_tshirt: 'vraie coton',
      couleur: 'Noir',
      motif_devant: '',
      motif_dos: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    clientService.getAll().then((res) => setClients(res.data));
  }, []);

  // When type changes, rebuild items with new prices
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setSelectedType(newType);
    setItems(buildInitialItems(newType));
  };

  const handleQuantityChange = (index, qty) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const q = parseInt(qty) || 0;
        return { ...item, quantite: q, total: q * item.prix };
      })
    );
  };

  const total = items.reduce((acc, item) => acc + (item.total || 0), 0);
  const reste = total - (parseFloat(avance) || 0);

  const onSubmit = async (data) => {
    const filledItems = items.filter((i) => i.quantite > 0);
    if (filledItems.length === 0) {
      alert('Veuillez ajouter au moins une taille avec une quantité.');
      return;
    }

    const payload = {
      ...data,
      type_tshirt: selectedType,
      total,
      avance: parseFloat(avance) || 0,
      reste,
      items: filledItems,
    };

    try {
      await orderService.create(payload);
      alert('✅ Commande enregistrée avec succès !');
      if (window.confirm('Voulez-vous générer le reçu PDF ?')) {
        const clientName = isNewClient
          ? data.nom_client
          : clients.find((c) => c.id == data.client_id)?.nom || 'Client';
        generatePDF({ ...payload, client_name: clientName });
      }
      navigate('/orders');
    } catch (err) {
      alert('❌ Erreur: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Nouvelle Commande</h1>
          <p className="text-gray-500">Remplissez le formulaire pour créer une commande.</p>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-md"
        >
          <Save size={18} />
          Enregistrer
        </button>
      </div>

      {/* Client Info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-800">👤 Informations Client</h2>
        <div className="flex gap-3 mb-2">
          <button
            type="button"
            onClick={() => setIsNewClient(true)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
              isNewClient ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            Nouveau client
          </button>
          <button
            type="button"
            onClick={() => setIsNewClient(false)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
              !isNewClient ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            Client existant
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isNewClient ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nom *</label>
                <input {...register('nom_client', { required: isNewClient })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Rakoto" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Téléphone</label>
                <input {...register('telephone_client')} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="034 00 000 00" />
              </div>
            </>
          ) : (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">Sélectionner un client</label>
              <select {...register('client_id')} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">-- Choisir --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.nom} – {c.telephone}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Date de commande</label>
            <input type="date" {...register('date')} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>
      </div>

      {/* T-Shirt Details */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-800">👕 Détails T-Shirt</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
            <select
              value={selectedType}
              onChange={handleTypeChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {TSHIRT_TYPES.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Couleur</label>
            <input {...register('couleur')} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Noir, Blanc, Rouge..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Motif Devant</label>
            <input {...register('motif_devant')} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Logo entreprise, texte..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Motif Dos</label>
            <input {...register('motif_dos')} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Nom, numéro..." />
          </div>
        </div>
      </div>

      {/* Sizes Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-800">📏 Tailles & Quantités</h2>
        
        {/* Children */}
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Tailles Enfants</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b">
                <th className="pb-2">Taille</th>
                <th className="pb-2">Quantité</th>
                <th className="pb-2">Prix</th>
                <th className="pb-2 text-right">Sous-total</th>
              </tr>
            </thead>
            <tbody>
              {items.slice(0, 5).map((item, index) => (
                <tr key={item.taille} className={`border-b border-gray-50 transition-colors ${item.quantite > 0 ? 'bg-green-50' : ''}`}>
                  <td className="py-2 font-semibold text-gray-700 w-24">{item.taille}</td>
                  <td className="py-2">
                    <input
                      type="number"
                      min="0"
                      value={item.quantite}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      className="w-20 border border-gray-300 rounded px-2 py-1 text-center focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </td>
                  <td className="py-2 text-gray-500 font-mono">
                    {item.prix > 0 ? `${item.prix.toLocaleString()} Ar` : <span className="italic text-gray-300">N/A</span>}
                  </td>
                  <td className="py-2 text-right font-bold">
                    {item.total > 0 ? <span className="text-green-700">{item.total.toLocaleString()} Ar</span> : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-4">Tailles Adultes</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b">
                <th className="pb-2">Taille</th>
                <th className="pb-2">Quantité</th>
                <th className="pb-2">Prix</th>
                <th className="pb-2 text-right">Sous-total</th>
              </tr>
            </thead>
            <tbody>
              {items.slice(5).map((item, idx) => {
                const index = idx + 5;
                return (
                  <tr key={item.taille} className={`border-b border-gray-50 transition-colors ${item.quantite > 0 ? 'bg-green-50' : ''}`}>
                    <td className="py-2 font-semibold text-gray-700 w-24">{item.taille}</td>
                    <td className="py-2">
                      <input
                        type="number"
                        min="0"
                        value={item.quantite}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        className="w-20 border border-gray-300 rounded px-2 py-1 text-center focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </td>
                    <td className="py-2 text-gray-500 font-mono">{item.prix > 0 ? `${item.prix.toLocaleString()} Ar` : <span className="italic text-gray-300">N/A</span>}</td>
                    <td className="py-2 text-right font-bold">
                      {item.total > 0 ? <span className="text-green-700">{item.total.toLocaleString()} Ar</span> : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment */}
      <div className="bg-gray-900 rounded-xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-green-400">💰 Paiement</h2>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Total calculé</label>
            <p className="text-3xl font-black text-white">{total.toLocaleString()} Ar</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Avance reçue (Ar)</label>
            <input
              type="number"
              min="0"
              value={avance}
              onChange={(e) => setAvance(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-xl text-white font-bold focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center items-end">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Reste à payer</p>
          <p className={`text-5xl font-black mt-2 ${reste > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {reste.toLocaleString()} Ar
          </p>
          {reste === 0 && <p className="text-green-400 text-sm mt-2 font-semibold">✅ Commande soldée !</p>}
        </div>
      </div>
    </div>
  );
};

export default AddOrder;

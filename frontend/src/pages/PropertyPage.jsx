import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize2, Heart, Phone, Mail, ChevronLeft, Zap, Star } from 'lucide-react';
import { propertyApi, enquiryApi } from '../utils/api';
import { formatPrice, formatRelativeDate } from '../utils/formatters';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSave } from '../store/savedSlice';
import toast from 'react-hot-toast';

const MOCK = { id:'1', title:'Modern 3 Bed Semi-Detached', type:'SALE', price:425000,
  address:{ line1:'12 Oak Avenue', city:'Manchester', postcode:'M21 9JQ', country:'UK', displayAddress:'12 Oak Avenue, Manchester, M21 9JQ' },
  details:{ bedrooms:3, bathrooms:2, receptionRooms:1, squareFootage:1200, garden:true, parking:true, chainFree:true },
  epcRating:'B', tenure:'Freehold', agentName:'HomePro Estate Agents', agentPhone:'0161 123 4567', agentEmail:'info@homepro.co.uk',
  description:'A beautifully presented three-bedroom semi-detached home in a highly sought-after location. The property features a modern kitchen, spacious living areas, and a private rear garden.',
  imageUrls:['https://picsum.photos/seed/prop1/800/500','https://picsum.photos/seed/prop2/800/500','https://picsum.photos/seed/prop3/800/500'],
  aiHighlights:['Price 5% below local average','Outstanding school catchment','10 min walk to Metrolink station'],
  listedAt: new Date().toISOString() };

export default function PropertyPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(MOCK);
  const [activeImg, setActiveImg] = useState(0);
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryEmail, setEnquiryEmail] = useState('');
  const [enquiryMsg, setEnquiryMsg] = useState('');
  const dispatch = useDispatch();
  const { saved } = useSelector(s => s.saved);
  const isSaved = saved.includes(id);

  useEffect(() => {
    propertyApi.getById(id).then(r => setProperty(r.data)).catch(() => {});
  }, [id]);

  const submitEnquiry = async (e) => {
    e.preventDefault();
    try {
      await enquiryApi.submit({ propertyId: id, name: enquiryName, email: enquiryEmail, message: enquiryMsg, type:'VIEWING_REQUEST' });
      toast.success('Enquiry sent successfully!');
      setEnquiryName(''); setEnquiryEmail(''); setEnquiryMsg('');
    } catch { toast.error('Failed to send enquiry. Please try again.'); }
  };

  if (!property) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin"/></div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/buy" className="flex items-center gap-2 text-gray-500 hover:text-blue-700 mb-6 text-sm font-medium transition-colors">
          <ChevronLeft className="w-4 h-4"/>Back to search
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl overflow-hidden">
              <img src={property.imageUrls?.[activeImg] || `https://picsum.photos/seed/${id}/800/500`} alt={property.title} className="w-full h-80 object-cover"/>
              {property.imageUrls?.length > 1 && (
                <div className="flex gap-2 p-3 bg-white">
                  {property.imageUrls.map((url, i) => (
                    <button key={i} onClick={() => setActiveImg(i)} className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${activeImg===i ? 'border-blue-600' : 'border-transparent'}`}>
                      <img src={url} alt="" className="w-full h-full object-cover"/>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-heading font-bold text-gray-900">{property.title}</h1>
                  <p className="text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-4 h-4"/>{property.address?.displayAddress || `${property.address?.city}, ${property.address?.postcode}`}</p>
                </div>
                <button onClick={() => dispatch(toggleSave(id))} className={`p-3 rounded-full transition-all ${isSaved ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500'}`}>
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`}/>
                </button>
              </div>
              <p className="text-3xl font-heading font-bold text-blue-900 mt-4">{formatPrice(property.price, property.type)}</p>
              <p className="text-gray-400 text-sm mt-1">Listed {formatRelativeDate(property.listedAt)}</p>

              <div className="flex items-center gap-6 mt-6 py-6 border-y border-gray-100">
                <div className="flex items-center gap-2 text-gray-700"><Bed className="w-5 h-5 text-blue-500"/><span>{property.details?.bedrooms} bedrooms</span></div>
                <div className="flex items-center gap-2 text-gray-700"><Bath className="w-5 h-5 text-blue-500"/><span>{property.details?.bathrooms} bathrooms</span></div>
                {property.details?.squareFootage && <div className="flex items-center gap-2 text-gray-700"><Maximize2 className="w-5 h-5 text-blue-500"/><span>{property.details.squareFootage.toLocaleString()} sq ft</span></div>}
              </div>

              {property.aiHighlights?.length > 0 && (
                <div className="mt-4 space-y-2">
                  {property.aiHighlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 px-4 py-2 rounded-lg">
                      <Zap className="w-4 h-4 flex-shrink-0"/>{h}
                    </div>
                  ))}
                </div>
              )}

              {property.description && (
                <div className="mt-6"><h3 className="font-semibold text-gray-900 mb-2">About this property</h3><p className="text-gray-600 leading-relaxed">{property.description}</p></div>
              )}

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                {[['Tenure',property.tenure],['EPC Rating',property.epcRating],['Council Tax',property.councilTaxBand],['Chain Free',property.details?.chainFree?'Yes':'No']].filter(([,v])=>v).map(([k,v]) => (
                  <div key={k}><span className="text-gray-500">{k}</span><p className="font-semibold text-gray-900 mt-0.5">{v}</p></div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-heading font-semibold text-gray-900 mb-1">{property.agentName || 'Estate Agent'}</h3>
              <p className="text-gray-500 text-sm mb-4">Listed by your local expert</p>
              <a href={`tel:${property.agentPhone}`} className="w-full flex items-center justify-center gap-2 bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors mb-3">
                <Phone className="w-4 h-4"/>{property.agentPhone || 'Call agent'}
              </a>
              <form onSubmit={submitEnquiry} className="space-y-3 mt-4 pt-4 border-t border-gray-100">
                <h4 className="font-semibold text-gray-800">Send enquiry</h4>
                <input value={enquiryName} onChange={e=>setEnquiryName(e.target.value)} placeholder="Your name" required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400"/>
                <input value={enquiryEmail} onChange={e=>setEnquiryEmail(e.target.value)} type="email" placeholder="Email address" required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400"/>
                <textarea value={enquiryMsg} onChange={e=>setEnquiryMsg(e.target.value)} rows={3} placeholder="I'd like to arrange a viewing..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 resize-none"/>
                <button type="submit" className="w-full flex items-center justify-center gap-2 border-2 border-blue-700 text-blue-700 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                  <Mail className="w-4 h-4"/>Send enquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

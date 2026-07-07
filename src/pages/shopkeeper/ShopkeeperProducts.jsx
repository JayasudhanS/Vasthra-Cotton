import { products } from '../../data';
import { Link } from 'react-router-dom';

function ProductTable({ data, title }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">✦ Weaver Inventory</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>{title}</h1>
        </div>
        <span className="badge badge-warning !text-xs font-bold px-3.5 py-1.5">
          {data.length} Masterpieces
        </span>
      </div>

      {data.length === 0 ? (
        <div className="card-base p-16 text-center max-w-lg mx-auto bg-white border-dashed">
          <p className="text-[#6B4A48] m-0 font-medium">No sarees found in this collection.</p>
        </div>
      ) : (
        <div className="table-container bg-white shadow-sm border border-[#D4AF37]/20">
          <table className="table-base w-full">
            <thead>
              <tr>
                <th className="!text-xs uppercase tracking-wider">Saree Masterpiece</th>
                <th className="!text-xs uppercase tracking-wider">Weave Category</th>
                <th className="!text-xs uppercase tracking-wider">Offer Price</th>
                <th className="!text-xs uppercase tracking-wider">Available Stock</th>
                <th className="!text-xs uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map(p => (
                <tr key={p.id} className="hover:bg-[#FFF8F0]/50 transition-colors">
                  <td className="font-medium text-[#4A2C2A]">
                    <div className="flex items-center gap-3.5">
                      <img src={p.image} alt="" className="w-12 h-14 rounded-xl object-cover border border-[#D4AF37]/30 shadow-xs flex-shrink-0" />
                      <div>
                        <span className="font-bold text-[#7B1E3A] block text-sm">{p.name}</span>
                        <span className="text-[11px] text-[#6B4A48]/70">ID: #SV-{p.id}08 · {p.fabric || 'Pure Silk'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="text-[#6B4A48] font-medium text-xs">
                    <span className="bg-[#FFF8F0] px-3 py-1 rounded-full border border-[#D4AF37]/20">
                      {p.category}
                    </span>
                  </td>
                  <td className="font-bold text-[#7B1E3A] text-sm">₹{p.offerPrice.toLocaleString()}</td>
                  <td className="font-mono text-xs font-semibold text-[#4A2C2A]">{p.stock || 15} Units</td>
                  <td className="text-right">
                    <Link to={`/product/${p.id}`} className="text-xs font-semibold text-[#D4AF37] hover:text-[#7B1E3A] no-underline bg-[#FFF8F0] px-3 py-1.5 rounded-lg border border-[#D4AF37]/30 transition-colors">
                      View Drape
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function ShopkeeperProducts() { return <ProductTable data={products} title="All Catalogue Weaves" />; }


import React, { useEffect } from 'react';

const ProductModal = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = React.useState({ name: '', price: '', cost: '', stock: '' });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({ name: '', price: '', cost: '', stock: '' });
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{product ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Tên sản phẩm" 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
          />
          <input 
            type="number" 
            placeholder="Số lượng" 
            value={formData.price} 
            onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
          />
          <input 
            type="number" 
            placeholder="Giá tiền" 
            value={formData.cost} 
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })} 
          />
          <input 
            type="number" 
            placeholder="Hàng tồn kho" 
            value={formData.stock} 
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })} 
          />
          <button type="submit">{product ? 'Update' : 'Thêm'}</button>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
